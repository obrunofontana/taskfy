'use server';

import { auth } from '@clerk/nextjs';
import { revalidatePath } from 'next/cache';

import { createSafeAction } from '@/lib/create-safe-action';
import { db } from '@/lib/db';

import { UpdateTaskColumnOrder } from './schema';
import { InputType, ReturnType } from './types';

const handler = async (data: InputType): Promise<ReturnType> => {
  const { userId, orgId } = auth();

  if (!userId || !orgId) {
    return {
      error: 'Unauthorized',
    };
  }

  const { items, projectId } = data;
  let taskColumns;

  try {
    const transaction = items.map((taskColumn) =>
      db.taskColumn.update({
        where: {
          id: taskColumn.id,
          project: {
            orgId,
          },
        },
        data: {
          order: taskColumn.order,
        },
      })
    );

    taskColumns = await db.$transaction(transaction);
  } catch (error) {
    return {
      error: 'Failed to reorder.',
    };
  }

  revalidatePath(`/project/${projectId}`);
  return { data: taskColumns };
};

export const updateTaskColumnOrder = createSafeAction(UpdateTaskColumnOrder, handler);
