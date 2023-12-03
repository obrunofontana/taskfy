'use server';

import { auth } from '@clerk/nextjs';
import { ACTION, ENTITY_TYPE } from '@prisma/client';
import { revalidatePath } from 'next/cache';

import { createAuditLog } from '@/lib/create-audit-log';
import { createSafeAction } from '@/lib/create-safe-action';
import { db } from '@/lib/db';

import { UpdateProject } from './schema';
import { InputType, ReturnType } from './types';

const handler = async (data: InputType): Promise<ReturnType> => {
  const { userId, orgId } = auth();

  if (!userId || !orgId) {
    return {
      error: 'Unauthorized',
    };
  }

  const { title, id } = data;
  let project;

  try {
    project = await db.project.update({
      where: {
        id,
        orgId,
      },
      data: {
        title,
      },
    });

    await createAuditLog({
      entityTitle: project.title,
      entityId: project.id,
      entityType: ENTITY_TYPE.PROJECT,
      action: ACTION.UPDATE,
    });
  } catch (error) {
    return {
      error: 'Failed to update.',
    };
  }

  revalidatePath(`/project/${id}`);
  return { data: project };
};

export const updateBoard = createSafeAction(UpdateProject, handler);
