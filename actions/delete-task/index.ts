'use server';

import { auth } from '@clerk/nextjs';
import { ACTION, ENTITY_TYPE } from '@prisma/client';
import { revalidatePath } from 'next/cache';

import { createAuditLog } from '@/lib/create-audit-log';
import { createSafeAction } from '@/lib/create-safe-action';
import { db } from '@/lib/db';

import { DeleteTask } from './schema';
import { InputType, ReturnType } from './types';

const handler = async (data: InputType): Promise<ReturnType> => {
  const { userId, orgId } = auth();

  if (!userId || !orgId) {
    return {
      error: 'Unauthorized',
    };
  }

  const { id, projectId } = data;
  let task;

  try {
    task = await db.task.delete({
      where: {
        id,
        taskColumn: {
          project: {
            orgId,
          },
        },
      },
    });

    await createAuditLog({
      entityTitle: task.title,
      entityId: task.id,
      entityType: ENTITY_TYPE.TASK,
      action: ACTION.DELETE,
    });
  } catch (error) {
    return {
      error: 'Failed to delete.',
    };
  }

  revalidatePath(`/project/${projectId}`);
  return { data: task };
};

export const deleteTask = createSafeAction(DeleteTask, handler);
