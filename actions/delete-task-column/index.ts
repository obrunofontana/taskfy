'use server';

import { auth } from '@clerk/nextjs';
import { ACTION, ENTITY_TYPE } from '@prisma/client';
import { revalidatePath } from 'next/cache';

import { createAuditLog } from '@/lib/create-audit-log';
import { createSafeAction } from '@/lib/create-safe-action';
import { db } from '@/lib/db';

import { DeleteTaskColumn } from './schema';
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
    taskColumn = await db.taskColumn.delete({
      where: {
        id,
        projectId,
        project: {
          orgId,
        },
      },
    });

    await createAuditLog({
      entityTitle: taskColumn.title,
      entityId: taskColumn.id,
      entityType: ENTITY_TYPE.TASK_COLUMN,
      action: ACTION.DELETE,
    });
  } catch (error) {
    return {
      error: 'Failed to delete.',
    };
  }

  revalidatePath(`/project/${projectId}`);
  return { data: taskColumn };
};

export const deleteTaskColumn = createSafeAction(DeleteTaskColumn, handler);
