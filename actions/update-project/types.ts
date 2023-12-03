import { Project } from '@prisma/client';
import { z } from 'zod';

import { ActionState } from '@/lib/create-safe-action';

import { UpdateProject } from './schema';

export type InputType = z.infer<typeof UpdateProject>;
export type ReturnType = ActionState<InputType, Project>;
