import { z } from 'zod';

export const DeleteTaskColumn = z.object({
  id: z.string(),
  projectId: z.string(),
});
