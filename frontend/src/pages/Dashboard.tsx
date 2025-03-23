import React, { useState, useEffect } from 'react';
import TaskList from '../components/TaskList';
import TaskForm from '../components/TaskForm';
import { fetchTasks } from '../api/taskApi';
import { Task, TaskStatus } from '../types/Task';

const Dashboard: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<TaskStatus | ''>('');
  const [showAddForm, setShowAddForm] = useState<boolean>(false);

  useEffect(() => {
    loadTasks();
  }, [statusFilter]);

  const loadTasks = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await fetchTasks(statusFilter || undefined);
      setTasks(data);
    } catch (err) {
      setError('Failed to load tasks. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = () => {
    loadTasks();
  };

  const handleTaskAdded = () => {
    loadTasks();
    setShowAddForm(false);
  };

  const handleStatusFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStatusFilter(e.target.value as TaskStatus | '');
  };

  return (
    <div>
      {/* header */}
      <div className="mb-4 flex justify-between">
        <h1>Tasks</h1>
        <button 
          onClick={() => setShowAddForm(!showAddForm)}
          className="btn btn-primary"
        >
          {showAddForm ? 'Cancel' : 'Add Task'}
        </button>
      </div>

      {/* add task form */}
      {showAddForm && (
        <div className="card p-4 mb-4">
          <TaskForm onTaskAdded={handleTaskAdded} />
        </div>
      )}

      {/* filters */}
      <div className="mb-4 flex justify-between">
        <div>
          <span className="mr-2">Filter:</span>
          <select
            value={statusFilter}
            onChange={handleStatusFilterChange}
            className="form-input py-1 px-2 inline-block w-auto"
          >
            <option value="">All Status</option>
            <option value={TaskStatus.TO_DO}>To Do</option>
            <option value={TaskStatus.IN_PROGRESS}>In Progress</option>
            <option value={TaskStatus.COMPLETED}>Completed</option>
          </select>
        </div>
        <button 
          onClick={handleRefresh}
          className="btn btn-secondary"
        >
          Refresh
        </button>
      </div>

      {/* task list */}
      {isLoading ? (
        <div className="text-center py-4">Loading...</div>
      ) : error ? (
        <div className="bg-red-100 p-2 mb-4">
          {error}
        </div>
      ) : (
        <TaskList tasks={tasks} onTasksChanged={handleRefresh} />
      )}
    </div>
  );
};

export default Dashboard;