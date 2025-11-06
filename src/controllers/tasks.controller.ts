import { NextFunction, Request, Response } from 'express';
import {
  getAllTasks,
  createTask,
  updateTask,
  deleteTask,
  toggleTaskCompleted,
} from '../services/tasks.service';
import { parseTaskId } from '../utils/helpers';
import { CreateTaskDto, UpdateTaskDto, FilterTaskDto } from '../dto/task.dto';
import { HttpStatusCode } from "../utils/errorCodes"
import { validate } from 'class-validator';

export async function listTasks(
  req: Request & {
    validatedQuery?: FilterTaskDto;
  },
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const tasks = await getAllTasks(req.validatedQuery!);
    res.status(HttpStatusCode.OK).json(tasks);
  } catch (err) {
    next(err);
  }
}

export async function handleCreateTask(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> {
  try {
    const dto = req.body as CreateTaskDto;
    const task = await createTask(dto.title, dto.completed);
    res.status(HttpStatusCode.CREATED).json(task);
  } catch (err) {
    next(err);
  }
}

export async function handleUpdateTask(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> {
  try {
    const id = parseTaskId(req.params.id);
    if (!id) {
      return res.status(HttpStatusCode.BAD_REQUEST).json({ error: 'Invalid task id.' });
    }

    const dto = req.body as UpdateTaskDto;
    if (dto.title === undefined && dto.completed === undefined) {
      return res
        .status(HttpStatusCode.BAD_REQUEST)
        .json({ error: 'At least one of title or completed must be provided.' });
    }

    const updated = await updateTask(id, dto);
    if (!updated) {
      return res.status(HttpStatusCode.NOT_FOUND).json({ error: 'Task not found.' });
    }

    res.status(HttpStatusCode.OK).json(updated);
  } catch (err) {
    next(err);
  }
}

export async function handleDeleteTask(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> {
  try {
    const id = parseTaskId(req.params.id);
    if (!id) {
      return res.status(HttpStatusCode.BAD_REQUEST).json({ error: 'Invalid task id.' });
    }

    const deleted = await deleteTask(id);
    if (!deleted) {
      return res.status(HttpStatusCode.NOT_FOUND).json({ error: 'Task not found.' });
    }

    res.status(HttpStatusCode.NO_CONTENT).send();
  } catch (err) {
    next(err);
  }
}

export async function handleToggleTask(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> {
  try {
    const id = parseTaskId(req.params.id);
    if (!id) {
      return res.status(HttpStatusCode.BAD_REQUEST).json({ error: 'Invalid task id.' });
    }

    const toggled = await toggleTaskCompleted(id);
    if (!toggled) {
      return res.status(HttpStatusCode.NOT_FOUND).json({ error: 'Task not found.' });
    }

    res.status(HttpStatusCode.OK).json(toggled);
  } catch (err) {
    next(err);
  }
}
