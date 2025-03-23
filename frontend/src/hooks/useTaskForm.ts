import { TaskInput, TaskStatus } from '../types/Task';
import { createTask, updateTask } from '../api/taskApi';
import { useForm } from './useForm';

interface UseTaskFormProps {
  initialValues?: TaskInput;
  taskId?: string;
  onSuccess: () => void;
}

export function useTaskForm({
  initialValues = {
    title: '',
    description: '',
    status: TaskStatus.TO_DO
  },
  taskId,
  onSuccess
}: UseTaskFormProps) {
  const validateTask = (values: TaskInput) => {
    const errors: Record<string, string> = {};
    
    if (!values.title || !values.title.trim()) {
      errors.title = 'Title is required';
    }
    
    return errors;
  };

  const handleSubmit = async (values: TaskInput) => {
    if (taskId) {
      // Update existing task
      await updateTask(taskId, {
        title: values.title,
        description: values.description || undefined,
        status: values.status
      });
    } else {
      // Create new task
      await createTask({
        title: values.title,
        description: values.description || undefined,
        status: values.status
      });
    }
    
    onSuccess();
  };

  return useForm<TaskInput>({
    initialValues,
    validate: validateTask,
    onSubmit: handleSubmit
  });
}