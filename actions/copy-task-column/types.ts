import { TaskColumn } from '@prisma/client';
import { z } from 'zod';

import { ActionState } from '@/lib/create-safe-action';

import { CopyTaskColumn } from './schema';

export type InputType = z.infer<typeof CopyTaskColumn>;
export type ReturnType = ActionState<InputType, TaskColumn>;
