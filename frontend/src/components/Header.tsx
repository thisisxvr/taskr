import React from 'react';
import { Link } from 'react-router-dom';

const Header: React.FC = () => {
  return (
    <header className="bg-blue-500 text-white p-4">
      <div className="container mx-auto">
        <Link to="/" className="font-bold">
          taskr
        </Link>
      </div>
    </header>
  );
};

export default Header;