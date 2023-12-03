'use server';

import { auth } from '@clerk/nextjs';
import { ACTION, ENTITY_TYPE } from '@prisma/client';
import { revalidatePath } from 'next/cache';

import { createAuditLog } from '@/lib/create-audit-log';
import { createSafeAction } from '@/lib/create-safe-action';
import { db } from '@/lib/db';

import { CopyTaskColumn } from './schema';
import { InputType, ReturnType } from './types';

const handler = async (data: InputType): Promise<ReturnType> => {
  const { userId, orgId } = auth();

  if (!userId || !orgId) {
    return {
      error: 'Unauthorized',
    };
  }

  const { id, projectId } = data;
  let taskColumn;

  try {
    const taskColumnToCopy = await db.taskColumn.findUnique({
      where: {
        id,
        projectId,
        project: {
          orgId,
        },
      },
      include: {
        tasks: true,
      },
    });

    if (!taskColumnToCopy) {
      return { error: 'TaskColumn not found' };
    }

    const lastTaskColumn = await db.taskColumn.findFirst({
      where: { projectId },
      orderBy: { order: 'desc' },
      select: { order: true },
    });

    const newOrder = lastTaskColumn ? lastTaskColumn.order + 1 : 1;

    taskColumn = await db.taskColumn.create({
      data: {
        projectId: taskColumnToCopy.projectId,
        title: `${taskColumnToCopy.title} - Cópia`,
        order: newOrder,
        tasks: {
          createMany: {
            data: taskColumnToCopy.tasks.map((task) => ({
              title: task.title,
              description: task.description,
              order: task.order,
            })),
          },
        },
      },
      include: {
        tasks: true,
      },
    });

    await createAuditLog({
      entityTitle: taskColumn.title,
      entityId: taskColumn.id,
      entityType: ENTITY_TYPE.TASK_COLUMN,
      action: ACTION.CREATE,
    });
  } catch (error) {
    return {
      error: 'Failed to copy.',
    };
  }

  revalidatePath(`/project/${projectId}`);
  return { data: taskColumn };
};

export const copyTaskColumn = createSafeAction(CopyTaskColumn, handler);
