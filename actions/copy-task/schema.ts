import { z } from 'zod';

export const CopyTask = z.object({
  id: z.string(),
  projectId: z.string(),
});
