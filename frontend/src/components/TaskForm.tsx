import React from 'react';
import { TaskStatus } from '../types/Task';
import { useTaskForm } from '../hooks/useTaskForm';

interface TaskFormProps {
  onTaskAdded: () => void;
}

const TaskForm: React.FC<TaskFormProps> = ({ onTaskAdded }) => {
  const {
    values,
    errors,
    isLoading,
    error,
    handleChange,
    handleSubmit
  } = useTaskForm({
    onSuccess: onTaskAdded
  });

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
          value={values.title}
          onChange={(e) => handleChange('title', e.target.value)}
          className="form-input"
          placeholder="Enter task title"
          disabled={isLoading}
        />
        {errors.title && (
          <div className="text-red-500 text-sm mt-1">{errors.title}</div>
        )}
      </div>
      
      <div className="mb-2">
        <label htmlFor="description" className="form-label">
          Description
        </label>
        <textarea
          id="description"
          value={values.description || ''}
          onChange={(e) => handleChange('description', e.target.value)}
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
          value={values.status}
          onChange={(e) => handleChange('status', e.target.value as TaskStatus)}
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
          disabled={isLoading || !values.title.trim()}
        >
          {isLoading ? 'Saving...' : 'Save Task'}
        </button>
      </div>
    </form>
  );
};

export default TaskForm;