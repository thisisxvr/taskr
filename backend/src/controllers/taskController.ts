import { Request, Response, NextFunction } from 'express';
import { TaskModel } from '../models/taskModel';
import { TaskStatus } from '../types';
import { AppError } from '../middleware/errorHandler';
import { controllerHandler } from '../utils/controllerHandler';

const _getAllTasks = async (
  req: Request, 
  res: Response
) => {
  const statusFilter = req.query.status as TaskStatus | undefined;
  
  const tasks = await TaskModel.getAllTasks(statusFilter);
  res.status(200).json(tasks);
};

const _getTaskById = async (
  req: Request, 
  res: Response
) => {
  const { id } = req.params;
  const task = await TaskModel.getTaskById(id);
  
  if (!task) {
    throw new AppError(`Task with ID ${id} not found`, 404);
  }
  
  res.status(200).json(task);
};

const _createTask = async (
  req: Request, 
  res: Response
) => {
  const taskInput = req.body;
  const task = await TaskModel.createTask(taskInput);
  res.status(201).json(task);
};

const _updateTask = async (
  req: Request, 
  res: Response
) => {
  const { id } = req.params;
  const taskInput = req.body;
  
  const updatedTask = await TaskModel.updateTask(id, taskInput);
  
  if (!updatedTask) {
    throw new AppError(`Task with ID ${id} not found`, 404);
  }
  
  res.status(200).json(updatedTask);
};

const _deleteTask = async (
  req: Request, 
  res: Response
) => {
  const { id } = req.params;
  const deleted = await TaskModel.deleteTask(id);
  
  if (!deleted) {
    throw new AppError(`Task with ID ${id} not found`, 404);
  }
  
  res.status(204).send();
};

// Export wrapped controller functions
export const getAllTasks = controllerHandler(_getAllTasks);
export const getTaskById = controllerHandler(_getTaskById);
export const createTask = controllerHandler(_createTask);
export const updateTask = controllerHandler(_updateTask);
export const deleteTask = controllerHandler(_deleteTask);