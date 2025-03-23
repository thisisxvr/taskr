import { Router } from 'express';
import { 
  getAllTasks, 
  getTaskById, 
  createTask, 
  updateTask, 
  deleteTask 
} from '../controllers/taskController';
import { validateTaskInput, validateTaskQuery, validateTaskId } from '../middleware/validators';

const router = Router();

router.get('/', validateTaskQuery, getAllTasks);
router.get('/:id', validateTaskId, getTaskById);
router.post('/', validateTaskInput, createTask);
router.put('/:id', validateTaskId, validateTaskInput, updateTask);
router.delete('/:id', validateTaskId, deleteTask);

export default router;