import { Task } from '@prisma/client';
import { z } from 'zod';

import { ActionState } from '@/lib/create-safe-action';

import { CopyTask } from './schema';

export type InputType = z.infer<typeof CopyTask>;
export type ReturnType = ActionState<InputType, Task>;
