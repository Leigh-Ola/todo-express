import { Router } from 'express';
import {
  listTasks,
  handleCreateTask,
  handleUpdateTask,
  handleDeleteTask,
  handleToggleTask,
} from '../controllers/tasks.controller';
import { validateBody, validateQuery } from '../middleware/validateRequest';
import { CreateTaskDto, FilterTaskDto, UpdateTaskDto } from '../dto/task.dto';

const router = Router();

router.get('/', validateQuery(FilterTaskDto), listTasks);
router.post('/', validateBody(CreateTaskDto), handleCreateTask);
router.put('/:id', validateBody(UpdateTaskDto), handleUpdateTask);
router.delete('/:id', handleDeleteTask);
router.patch('/:id/completed', handleToggleTask);

export default router;
