import { TaskColumn } from '@prisma/client';
import { z } from 'zod';

import { ActionState } from '@/lib/create-safe-action';

import { CreateTaskColumn } from './schema';

export type InputType = z.infer<typeof CreateTaskColumn>;
export type ReturnType = ActionState<InputType, TaskColumn>;
