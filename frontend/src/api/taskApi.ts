import axios from 'axios';
import { Task, TaskInput, TaskStatus } from '../types/Task';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const fetchTasks = async (status?: TaskStatus): Promise<Task[]> => {
  try {
    const params = status ? { status } : {};
    const response = await api.get<Task[]>('/tasks', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching tasks:', error);
    throw error;
  }
};

export const fetchTask = async (id: string): Promise<Task> => {
  try {
    const response = await api.get<Task>(`/tasks/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching task ${id}:`, error);
    throw error;
  }
};

export const createTask = async (taskInput: TaskInput): Promise<Task> => {
  try {
    const response = await api.post<Task>('/tasks', taskInput);
    return response.data;
  } catch (error) {
    console.error('Error creating task:', error);
    throw error;
  }
};

export const updateTask = async (id: string, taskInput: TaskInput): Promise<Task> => {
  try {
    const response = await api.put<Task>(`/tasks/${id}`, taskInput);
    return response.data;
  } catch (error) {
    console.error(`Error updating task ${id}:`, error);
    throw error;
  }
};

export const deleteTask = async (id: string): Promise<void> => {
  try {
    await api.delete(`/tasks/${id}`);
  } catch (error) {
    console.error(`Error deleting task ${id}:`, error);
    throw error;
  }
};