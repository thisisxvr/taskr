import { z } from 'zod';

export enum TaskStatus {
  TO_DO = 'TO_DO',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED'
}

export const taskSchema = z.object({
  title: z.string()
    .min(1, { message: 'Title is required' })
    .max(100, { message: 'Title must be less than 100 characters' }),
  description: z.string().optional(),
  status: z.enum([
    TaskStatus.TO_DO,
    TaskStatus.IN_PROGRESS,
    TaskStatus.COMPLETED
  ]).optional()
});

export const taskQuerySchema = z.object({
  status: z.enum([
    TaskStatus.TO_DO,
    TaskStatus.IN_PROGRESS,
    TaskStatus.COMPLETED
  ]).optional()
});

export const taskIdSchema = z.object({
  id: z.string().uuid({ message: 'Invalid task ID format' })
});

export type TaskInput = z.infer<typeof taskSchema>;

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  createdAt?: string;
  updatedAt?: string;
}