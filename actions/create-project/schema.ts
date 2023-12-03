import { z } from 'zod';

export const CreateProject = z.object({
  title: z
    .string({
      required_error: 'Título é obrigatório',
      invalid_type_error: 'Título é obrigatório',
    })
    .min(3, {
      message: 'Título é muito curto',
    }),
  image: z.string({
    required_error: 'Imagem é obrigatória',
    invalid_type_error: 'Imagem é obrigatória',
  }),
});
