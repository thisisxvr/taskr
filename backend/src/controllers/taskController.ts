import { Request, Response, NextFunction } from 'express';
import { TaskModel } from '../models/taskModel';
import { TaskStatus } from '../types';
import { AppError } from '../middleware/errorHandler';

export const getAllTasks = async (
  req: Request, 
  res: Response, 
  next: NextFunction
) => {
  try {
    const statusFilter = req.query.status as TaskStatus | undefined;
    
    const tasks = await TaskModel.getAllTasks(statusFilter);
    res.status(200).json(tasks);
  } catch (error) {
    next(error);
  }
};

export const getTaskById = async (
  req: Request, 
  res: Response, 
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const task = await TaskModel.getTaskById(id);
    
    if (!task) {
      throw new AppError(`Task with ID ${id} not found`, 404);
    }
    
    res.status(200).json(task);
  } catch (error) {
    next(error);
  }
};

export const createTask = async (
  req: Request, 
  res: Response, 
  next: NextFunction
) => {
  try {
    const taskInput = req.body;
    const task = await TaskModel.createTask(taskInput);
    res.status(201).json(task);
  } catch (error) {
    next(error);
  }
};

export const updateTask = async (
  req: Request, 
  res: Response, 
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const taskInput = req.body;
    
    const updatedTask = await TaskModel.updateTask(id, taskInput);
    
    if (!updatedTask) {
      throw new AppError(`Task with ID ${id} not found`, 404);
    }
    
    res.status(200).json(updatedTask);
  } catch (error) {
    next(error);
  }
};

export const deleteTask = async (
  req: Request, 
  res: Response, 
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const deleted = await TaskModel.deleteTask(id);
    
    if (!deleted) {
      throw new AppError(`Task with ID ${id} not found`, 404);
    }
    
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};