import { ILike, In } from 'typeorm';
import { AppDataSource } from '../db/data-source';
import { FilterTaskDto } from '../dto/task.dto';
import { Task } from '../entities/task.entity';
import { sanitizeTask } from '../utils/helpers';

function getTaskRepository() {
  return AppDataSource.getRepository(Task);
}

export async function getAllTasks({
  order,
  title,
  ids,
  completed,
  page,
  limit,
}: FilterTaskDto): Promise<Partial<Task>[]> {
  // define page and limit defaults
  page = Math.max(Number(page ?? 1), 1); // min page is 1, default is 10
  limit = Math.max(Number(limit ?? 10), 1); // min limit is 1, default is 10
  limit = Math.min(limit, 100); // max limit is 100
  const skip = (page - 1) * limit;

  const tasks = await getTaskRepository().find({
    // if sort by specified order or default to ascending
    ...(order ? { order: { id: order } } : { order: { id: 'ASC' } }),

    // partial match for title
    ...(title ? { where: { title: ILike(`%${title}%`) } } : {}),

    ...(ids ? { where: { id: In(ids) } } : {}),

    ...(completed ? { where: { completed } } : {}),

    take: limit,
    skip,
  });
  return tasks ? tasks.map(sanitizeTask) : [];
}

export async function createTask(
  title: string,
  completed?: boolean,
): Promise<Partial<Task>> {
  const repository = getTaskRepository();
  const task = repository.create({
    title: title.trim(),
    completed: completed ?? false,
  });
  return sanitizeTask(await repository.save(task));
}

export async function updateTask(
  id: number,
  updates: { title?: string; completed?: boolean },
): Promise<Partial<Task> | null> {
  const repository = getTaskRepository();
  const task = await repository.findOneBy({ id });
  if (!task) {
    return null;
  }

  if (updates.title !== undefined) {
    task.title = updates.title.trim();
  }

  if (updates.completed !== undefined) {
    task.completed = updates.completed;
  }

  return sanitizeTask(await repository.save(task));
}

export async function deleteTask(id: number): Promise<boolean> {
  const repository = getTaskRepository();
  const result = await repository.delete({ id });
  return (result.affected ?? 0) > 0;
}

export async function toggleTaskCompleted(
  id: number,
): Promise<Partial<Task> | null> {
  const repository = getTaskRepository();
  const task = await repository.findOneBy({ id });
  if (!task) {
    return null;
  }

  task.completed = !task.completed;
  return sanitizeTask(await repository.save(task));
}
