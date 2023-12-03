'use server';

import { auth } from '@clerk/nextjs';
import { ACTION, ENTITY_TYPE } from '@prisma/client';
import { revalidatePath } from 'next/cache';

import { createAuditLog } from '@/lib/create-audit-log';
import { createSafeAction } from '@/lib/create-safe-action';
import { db } from '@/lib/db';

import { UpdateList } from './schema';
import { InputType, ReturnType } from './types';

const handler = async (data: InputType): Promise<ReturnType> => {
  const { userId, orgId } = auth();

  if (!userId || !orgId) {
    return {
      error: 'Unauthorized',
    };
  }

  const { title, id, projectId } = data;
  let taskColumn;

  try {
    taskColumn = await db.taskColumn.update({
      where: {
        id,
        projectId,
        project: {
          orgId,
        },
      },
      data: {
        title,
      },
    });

    await createAuditLog({
      entityTitle: taskColumn.title,
      entityId: taskColumn.id,
      entityType: ENTITY_TYPE.TASK_COLUMN,
      action: ACTION.UPDATE,
    });
  } catch (error) {
    return {
      error: 'Failed to update.',
    };
  }

  revalidatePath(`/project/${projectId}`);
  return { data: taskColumn };
};

export const updateTaskColumn = createSafeAction(UpdateList, handler);
