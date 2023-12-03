import { TaskColumn } from '@prisma/client';
import { z } from 'zod';

import { ActionState } from '@/lib/create-safe-action';

import { DeleteTaskColumn } from './schema';

export type InputType = z.infer<typeof DeleteTaskColumn>;
export type ReturnType = ActionState<InputType, TaskColumn>;
