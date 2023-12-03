'use server';

import { auth } from '@clerk/nextjs';
import { ACTION, ENTITY_TYPE } from '@prisma/client';
import { revalidatePath } from 'next/cache';

import { createAuditLog } from '@/lib/create-audit-log';
import { createSafeAction } from '@/lib/create-safe-action';
import { db } from '@/lib/db';

import { CopyTask } from './schema';
import { InputType, ReturnType } from './types';

const handler = async (data: InputType): Promise<ReturnType> => {
  const { userId, orgId } = auth();

  if (!userId || !orgId) {
    return {
      error: 'Unauthorized',
    };
  }

  const { id, projectId } = data;
  let card;

  try {
    const cardToCopy = await db.task.findUnique({
      where: {
        id,
        taskColumn: {
          project: {
            orgId,
          },
        },
      },
    });

    if (!cardToCopy) {
      return { error: 'Card not found' };
    }

    const lastTask = await db.task.findFirst({
      where: { taskColumnId: cardToCopy.taskColumnId },
      orderBy: { order: 'desc' },
      select: { order: true },
    });

    const newOrder = lastTask ? lastTask.order + 1 : 1;

    card = await db.task.create({
      data: {
        title: `${cardToCopy.title} - Copy`,
        description: cardToCopy.description,
        order: newOrder,
        taskColumnId: cardToCopy.taskColumnId,
      },
    });

    await createAuditLog({
      entityTitle: card.title,
      entityId: card.id,
      entityType: ENTITY_TYPE.TASK,
      action: ACTION.CREATE,
    });
  } catch (error) {
    return {
      error: 'Failed to copy.',
    };
  }

  revalidatePath(`/project/${projectId}`);
  return { data: card };
};

export const copyTask = createSafeAction(CopyTask, handler);
