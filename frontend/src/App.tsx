import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import NotFound from './pages/NotFound';

const App: React.FC = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="container mx-auto p-4">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <footer className="border-t p-4 text-center">
        <p className="text-gray-500 text-sm">
          taskr &copy; {new Date().getFullYear()}
        </p>
      </footer>
    </div>
  );
};

export default App;