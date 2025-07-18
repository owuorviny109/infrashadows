import React from 'react';
import { Link } from 'react-router-dom';

function Header() {
  return (
    <header className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-xl font-bold">InfraShadows</Link>
        <nav>
          <ul className="flex space-x-4">
            <li><Link to="/" className="hover:text-gray-300">Home</Link></li>
            <li><Link to="/analysis" className="hover:text-gray-300">Analysis</Link></li>
            <li><Link to="/map" className="hover:text-gray-300">Map</Link></li>
          </ul>
        </nav>
      </div>
    </header>
  );
}

export default Header;