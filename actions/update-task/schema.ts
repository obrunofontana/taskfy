import { z } from 'zod';

export const UpdateTask = z.object({
  projectId: z.string(),
  description: z.optional(
    z
      .string({
        required_error: 'Descrição é obrigatória',
        invalid_type_error: 'Descrição é obrigatória',
      })
      .min(3, {
        message: 'Descrição é muito curta',
      })
  ),
  title: z.optional(
    z
      .string({
        required_error: 'Título é obrigatório',
        invalid_type_error: 'Título é obrigatório',
      })
      .min(3, {
        message: 'Título é muito curto',
      })
  ),
  id: z.string(),
});
