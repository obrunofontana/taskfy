import { Task, TaskColumn } from '@prisma/client';

export type TaskColumWithTasks = TaskColumn & { tasks: Task[] };

export type TaskWithTaskColumn = Task & { taskColumn: TaskColumn };
