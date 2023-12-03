import { z } from 'zod';

export const CopyTaskColumn = z.object({
  id: z.string(),
  projectId: z.string(),
});
