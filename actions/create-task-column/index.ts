'use server';

import { auth } from '@clerk/nextjs';
import { ACTION, ENTITY_TYPE } from '@prisma/client';
import { revalidatePath } from 'next/cache';

import { createAuditLog } from '@/lib/create-audit-log';
import { createSafeAction } from '@/lib/create-safe-action';
import { db } from '@/lib/db';

import { CreateTaskColumn } from './schema';
import { InputType, ReturnType } from './types';

const handler = async (data: InputType): Promise<ReturnType> => {
  const { userId, orgId } = auth();

  if (!userId || !orgId) {
    return {
      error: 'Unauthorized',
    };
  }

  const { title, projectId } = data;
  let taskColumn;

  try {
    const project = await db.project.findUnique({
      where: {
        id: projectId,
        orgId,
      },
    });

    if (!project) {
      return {
        error: 'Project not found',
      };
    }

    const lastTaskColumn = await db.taskColumn.findFirst({
      where: { projectId: projectId },
      orderBy: { order: 'desc' },
      select: { order: true },
    });

    const newOrder = lastTaskColumn ? lastTaskColumn.order + 1 : 1;

    taskColumn = await db.taskColumn.create({
      data: {
        title,
        projectId,
        order: newOrder,
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
      error: 'Failed to create.',
    };
  }

  revalidatePath(`/project/${projectId}`);
  return { data: taskColumn };
};

export const createTaskColumn = createSafeAction(CreateTaskColumn, handler);
