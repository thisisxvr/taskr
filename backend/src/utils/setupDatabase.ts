import { TaskModel } from '../models/taskModel';

export const setupDatabase = async () => {
  try {
    await TaskModel.createTable();
    console.log('Database setup complete');
  } catch (error) {
    console.error('Error setting up database:', error);
    throw error;
  }
};

if (require.main === module) {
  setupDatabase()
    .then(() => console.log('DB setup complete'))
    .catch(err => {
      console.error('DB setup failed:', err);
      process.exit(1);
    });
}