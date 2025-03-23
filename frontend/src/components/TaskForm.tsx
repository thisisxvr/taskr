import React, { useState } from 'react';
import { createTask } from '../api/taskApi';
import { TaskStatus } from '../types/Task';

interface TaskFormProps {
  onTaskAdded: () => void;
}

const TaskForm: React.FC<TaskFormProps> = ({ onTaskAdded }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<TaskStatus>(TaskStatus.TO_DO);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      setError('Title is required');
      return;
    }
    
    try {
      setIsLoading(true);
      setError(null);
      
      await createTask({
        title,
        description: description || undefined,
        status
      });
      
      setTitle('');
      setDescription('');
      setStatus(TaskStatus.TO_DO);
      onTaskAdded();
    } catch (err) {
      setError('Failed to create task. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && (
        <div className="bg-red-100 p-2 mb-3 text-red-700">
          {error}
        </div>
      )}
      
      <div className="mb-2">
        <label htmlFor="title" className="form-label">
          Title <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="form-input"
          placeholder="Enter task title"
          disabled={isLoading}
        />
      </div>
      
      <div className="mb-2">
        <label htmlFor="description" className="form-label">
          Description
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="form-input"
          rows={2}
          placeholder="Optional description"
          disabled={isLoading}
        ></textarea>
      </div>
      
      <div className="mb-3">
        <label htmlFor="status" className="form-label">
          Status
        </label>
        <select
          id="status"
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
      
      <div className="text-right">
        <button
          type="submit"
          className="btn btn-primary"
          disabled={isLoading || !title.trim()}
        >
          {isLoading ? 'Saving...' : 'Save Task'}
        </button>
      </div>
    </form>
  );
};

export default TaskForm;