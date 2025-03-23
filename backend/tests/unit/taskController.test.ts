import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { 
  getAllTasks, 
  getTaskById, 
  createTask, 
  updateTask, 
  deleteTask 
} from '../../src/controllers/taskController';
import { TaskModel } from '../../src/models/taskModel';
import { mockRequest, mockResponse, mockNext } from '../mocks/express';
import { AppError } from '../../src/middleware/errorHandler';
import { TaskStatus } from '../../src/types';

vi.mock('../../src/models/taskModel', () => {
  const TaskStatus = {
    TO_DO: 'TO_DO',
    IN_PROGRESS: 'IN_PROGRESS',
    COMPLETED: 'COMPLETED'
  };
  
  return {
    TaskModel: {
      getAllTasks: vi.fn(),
      getTaskById: vi.fn(),
      createTask: vi.fn(),
      updateTask: vi.fn(),
      deleteTask: vi.fn()
    },
    TaskStatus
  };
});

describe('TaskController', () => {
  let req: any;
  let res: any;
  let next: any;
  
  beforeEach(() => {
    req = mockRequest();
    res = mockResponse();
    next = mockNext;
    
    vi.clearAllMocks();
  });
  
  afterEach(() => {
    vi.resetAllMocks();
  });
  
  describe('getAllTasks', () => {
    it('should return all tasks with 200 status code', async () => {
      const mockTasks = [
        { id: '1', title: 'Task 1', status: TaskStatus.TO_DO },
        { id: '2', title: 'Task 2', status: TaskStatus.IN_PROGRESS }
      ];
      
      vi.mocked(TaskModel.getAllTasks).mockResolvedValue(mockTasks);
      
      await getAllTasks(req, res, next);
      
      expect(TaskModel.getAllTasks).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockTasks);
    });
    
    it('should filter tasks by status when status query param is provided', async () => {
      const mockTasks = [
        { id: '1', title: 'Task 1', status: TaskStatus.TO_DO }
      ];
      
      req = mockRequest({ query: { status: TaskStatus.TO_DO } });
      
      vi.mocked(TaskModel.getAllTasks).mockResolvedValue(mockTasks);
      
      await getAllTasks(req, res, next);
      
      expect(TaskModel.getAllTasks).toHaveBeenCalledWith(TaskStatus.TO_DO);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockTasks);
    });
    
    it('should call next with error when TaskModel.getAllTasks throws', async () => {
      const error = new Error('Database error');
      
      vi.mocked(TaskModel.getAllTasks).mockRejectedValue(error);
      
      await getAllTasks(req, res, next);
      
      expect(next).toHaveBeenCalledWith(error);
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
    });
  });
  
  describe('getTaskById', () => {
    it('should return a task with 200 status code when found', async () => {
      const mockTask = { id: '1', title: 'Task 1', status: TaskStatus.TO_DO };
      
      req = mockRequest({ params: { id: '1' } });
      
      vi.mocked(TaskModel.getTaskById).mockResolvedValue(mockTask);
      
      await getTaskById(req, res, next);
      
      expect(TaskModel.getTaskById).toHaveBeenCalledWith('1');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockTask);
    });
    
    it('should call next with 404 error when task is not found', async () => {
      req = mockRequest({ params: { id: '999' } });
      
      vi.mocked(TaskModel.getTaskById).mockResolvedValue(null);
      
      await getTaskById(req, res, next);
      
      expect(next).toHaveBeenCalledWith(expect.any(AppError));
      expect(next.mock.calls[0][0].statusCode).toBe(404);
      expect(next.mock.calls[0][0].message).toContain('Task with ID 999 not found');
    });
  });
  
  describe('createTask', () => {
    it('should create and return a new task with 201 status code', async () => {
      const taskInput = { title: 'New Task', status: TaskStatus.TO_DO };
      const createdTask = { id: '1', ...taskInput, createdAt: '2023-01-01T00:00:00.000Z' };
      
      req = mockRequest({ body: taskInput });
      
      vi.mocked(TaskModel.createTask).mockResolvedValue(createdTask);
      
      await createTask(req, res, next);
      
      expect(TaskModel.createTask).toHaveBeenCalledWith(taskInput);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(createdTask);
    });
  });
  
  describe('updateTask', () => {
    it('should update and return a task with 200 status code', async () => {
      const taskInput = { title: 'Updated Task' };
      const updatedTask = { id: '1', title: 'Updated Task', status: TaskStatus.TO_DO };
      
      req = mockRequest({ params: { id: '1' }, body: taskInput });
      
      vi.mocked(TaskModel.updateTask).mockResolvedValue(updatedTask);
      
      await updateTask(req, res, next);
      
      expect(TaskModel.updateTask).toHaveBeenCalledWith('1', taskInput);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(updatedTask);
    });
    
    it('should call next with 404 error when task to update is not found', async () => {
      req = mockRequest({ params: { id: '999' }, body: { title: 'Updated Task' } });
      
      vi.mocked(TaskModel.updateTask).mockResolvedValue(null);
      
      await updateTask(req, res, next);
      
      expect(next).toHaveBeenCalledWith(expect.any(AppError));
      expect(next.mock.calls[0][0].statusCode).toBe(404);
      expect(next.mock.calls[0][0].message).toContain('Task with ID 999 not found');
    });
  });
  
  describe('deleteTask', () => {
    it('should delete a task and return 204 status code when successful', async () => {
      req = mockRequest({ params: { id: '1' } });
      
      vi.mocked(TaskModel.deleteTask).mockResolvedValue(true);
      
      await deleteTask(req, res, next);
      
      expect(TaskModel.deleteTask).toHaveBeenCalledWith('1');
      expect(res.status).toHaveBeenCalledWith(204);
      expect(res.send).toHaveBeenCalled();
    });
    
    it('should call next with 404 error when task to delete is not found', async () => {
      req = mockRequest({ params: { id: '999' } });
      
      vi.mocked(TaskModel.deleteTask).mockResolvedValue(false);
      
      await deleteTask(req, res, next);
      
      expect(next).toHaveBeenCalledWith(expect.any(AppError));
      expect(next.mock.calls[0][0].statusCode).toBe(404);
      expect(next.mock.calls[0][0].message).toContain('Task with ID 999 not found');
    });
  });
});