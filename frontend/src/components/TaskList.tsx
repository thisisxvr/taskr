import React from 'react';
import TaskItem from './TaskItem';
import { Task } from '../types/Task';

interface TaskListProps {
  tasks: Task[];
  onTasksChanged: () => void;
}

const TaskList: React.FC<TaskListProps> = ({ tasks, onTasksChanged }) => {
  if (tasks.length === 0) {
    return (
      <div className="border p-4 text-center">
        <p>No tasks found. Add a new task to get started.</p>
      </div>
    );
  }

  return (
    <div>
      {tasks.map((task) => (
        <TaskItem 
          key={task.id} 
          task={task} 
          onTaskChanged={onTasksChanged} 
        />
      ))}
    </div>
  );
};

export default TaskList;