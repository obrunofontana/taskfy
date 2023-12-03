'use server';

import { auth } from '@clerk/nextjs';
import { ACTION, ENTITY_TYPE } from '@prisma/client';
import { revalidatePath } from 'next/cache';

import { createAuditLog } from '@/lib/create-audit-log';
import { createSafeAction } from '@/lib/create-safe-action';
import { db } from '@/lib/db';

import { CreateTask } from './schema';
import { InputType, ReturnType } from './types';

const handler = async (data: InputType): Promise<ReturnType> => {
  const { userId, orgId } = auth();

  if (!userId || !orgId) {
    return {
      error: 'Unauthorized',
    };
  }

  const { title, projectId, taskColumnId } = data;
  let task;

  try {
    const taskColumn = await db.taskColumn.findUnique({
      where: {
        id: taskColumnId,
        project: {
          orgId,
        },
      },
    });

    if (!taskColumn) {
      return {
        error: 'TaskColumn not found',
      };
    }

    const lastTask = await db.task.findFirst({
      where: { taskColumnId },
      orderBy: { order: 'desc' },
      select: { order: true },
    });

    const newOrder = lastTask ? lastTask.order + 1 : 1;

    task = await db.task.create({
      data: {
        title,
        taskColumnId,
        order: newOrder,
      },
    });

    await createAuditLog({
      entityId: task.id,
      entityTitle: task.title,
      entityType: ENTITY_TYPE.TASK,
      action: ACTION.CREATE,
    });
  } catch (error) {
    return {
      error: 'Failed to create.',
    };
  }

  revalidatePath(`/project/${projectId}`);
  return { data: task };
};

export const createTask = createSafeAction(CreateTask, handler);
