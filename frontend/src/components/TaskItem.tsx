import React, { useState } from 'react';
import { Task, TaskStatus } from '../types/Task';
import { updateTask, deleteTask } from '../api/taskApi';

interface TaskItemProps {
  task: Task;
  onTaskChanged: () => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, onTaskChanged }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description || '');
  const [status, setStatus] = useState(task.status);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getStatusBadge = (status: TaskStatus) => {
    switch (status) {
      case TaskStatus.TO_DO:
        return <span className="badge badge-todo">To Do</span>;
      case TaskStatus.IN_PROGRESS:
        return <span className="badge badge-progress">In Progress</span>;
      case TaskStatus.COMPLETED:
        return <span className="badge badge-completed">Completed</span>;
      default:
        return <span className="badge">Unknown</span>;
    }
  };

  const handleSave = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      await updateTask(task.id, {
        title,
        description: description || undefined,
        status
      });
      
      setIsEditing(false);
      onTaskChanged();
    } catch (err) {
      setError('Failed to update task');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this task?')) {
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      
      await deleteTask(task.id);
      onTaskChanged();
    } catch (err) {
      setError('Failed to delete task');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (newStatus: TaskStatus) => {
    try {
      setIsLoading(true);
      setError(null);
      
      await updateTask(task.id, {
        title: task.title,
        description: task.description,
        status: newStatus
      });
      
      onTaskChanged();
    } catch (err) {
      setError('Failed to update task status');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  if (isEditing) {
    return (
      <div className="card p-3 mb-3 border">
        {error && (
          <div className="bg-red-100 p-2 mb-3 text-red-700">
            {error}
          </div>
        )}
        
        <div className="mb-2">
          <label className="form-label">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="form-input"
            disabled={isLoading}
          />
        </div>
        
        <div className="mb-2">
          <label className="form-label">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="form-input"
            rows={2}
            disabled={isLoading}
          ></textarea>
        </div>
        
        <div className="mb-3">
          <label className="form-label">Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as TaskStatus)}
            className="form-input"
            disabled={isLoading}
          >
            <option value={TaskStatus.TO_DO}>To Do</option>
            <option value={TaskStatus.IN_PROGRESS}>In Progress</option>
            <option value={TaskStatus.COMPLETED}>Completed</option>
          </select>
        </div>
        
        <div className="flex justify-end gap-2">
          <button
            onClick={() => setIsEditing(false)}
            className="btn btn-secondary"
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="btn btn-primary"
            disabled={isLoading || !title}
          >
            {isLoading ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="card mb-3 border">
      {error && (
        <div className="bg-red-100 p-2 text-red-700 border-b">
          {error}
        </div>
      )}
      
      <div className="p-3">
        <div className="flex justify-between mb-1">
          <div>
            <h3 className="font-medium">{task.title}</h3>
            {task.description && (
              <p className="text-gray-600 text-sm">
                {task.description}
              </p>
            )}
          </div>
          <div>
            {getStatusBadge(task.status)}
          </div>
        </div>
      </div>
      
      <div className="border-t p-2 bg-gray-50 flex justify-between">
        <select 
          value={task.status}
          onChange={(e) => handleStatusChange(e.target.value as TaskStatus)}
          className="form-input py-1 w-auto"
          disabled={isLoading}
        >
          <option value={TaskStatus.TO_DO}>To Do</option>
          <option value={TaskStatus.IN_PROGRESS}>In Progress</option>
          <option value={TaskStatus.COMPLETED}>Completed</option>
        </select>
        
        <div>
          <button
            onClick={() => setIsEditing(true)}
            className="btn btn-secondary mr-1"
            disabled={isLoading}
          >
            Edit
          </button>
          <button
            onClick={handleDelete}
            className="btn btn-danger"
            disabled={isLoading}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskItem;