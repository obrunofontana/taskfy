'use server';

import { auth } from '@clerk/nextjs';
import { revalidatePath } from 'next/cache';

import { createSafeAction } from '@/lib/create-safe-action';
import { db } from '@/lib/db';

import { UpdateTaskOrder } from './schema';
import { InputType, ReturnType } from './types';

const handler = async (data: InputType): Promise<ReturnType> => {
  const { userId, orgId } = auth();

  if (!userId || !orgId) {
    return {
      error: 'Unauthorized',
    };
  }

  const { items, projectId } = data;
  let updatedTasks;

  try {
    const transaction = items.map((card) =>
      db.task.update({
        where: {
          id: card.id,
          taskColumn: {
            project: {
              orgId,
            },
          },
        },
        data: {
          order: card.order,
          taskColumnId: card.taskColumnId,
        },
      })
    );

    updatedTasks = await db.$transaction(transaction);
  } catch (error) {
    return {
      error: 'Failed to reorder.',
    };
  }

  revalidatePath(`/project/${projectId}`);
  return { data: updatedTasks };
};

export const updateTaskOrder = createSafeAction(UpdateTaskOrder, handler);
