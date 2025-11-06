import { Task } from "../entities/task.entity";

export function parseTaskId(value: string | undefined): number | null {
  if (!value) {
    return null;
  }

  const parsed = Number.parseInt(value, 10);
  if (Number.isNaN(parsed) || parsed <= 0) {
    return null;
  }

  return parsed;
}

export function sanitizeTask(task: Task) {
  return {
    id: task.id,
    title: task.title,
    completed: task.completed,
    createdAt: task.createdAt,
  };
}