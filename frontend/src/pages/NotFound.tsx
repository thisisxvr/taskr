import React from 'react';
import { Link } from 'react-router-dom';

const NotFound: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center py-24">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-indigo-600 mb-4">404</h1>
        <div className="bg-white p-8 shadow-lg rounded-lg max-w-md">
          <h2 className="text-2xl font-semibold text-gray-800 mb-3">Page Not Found</h2>
          <p className="text-gray-600 mb-8">
            The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
          </p>
          <Link 
            to="/" 
            className="btn btn-primary inline-flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;