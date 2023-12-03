import { z } from 'zod';

export const UpdateTaskOrder = z.object({
  items: z.array(
    z.object({
      id: z.string(),
      title: z.string(),
      order: z.number(),
      taskColumnId: z.string(),
      createdAt: z.date(),
      updatedAt: z.date(),
    })
  ),
  projectId: z.string(),
});
