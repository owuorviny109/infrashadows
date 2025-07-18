import React from 'react';

function Footer() {
  return (
    <footer className="bg-gray-800 text-white p-4 mt-8">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-sm">&copy; {new Date().getFullYear()} InfraShadows Project</p>
            <p className="text-xs text-gray-400">Visualizing infrastructure impacts in Kilimani, Nairobi</p>
          </div>
          <div className="flex space-x-4">
            <a href="#" className="text-gray-300 hover:text-white text-sm">About</a>
            <a href="#" className="text-gray-300 hover:text-white text-sm">Privacy</a>
            <a href="#" className="text-gray-300 hover:text-white text-sm">Terms</a>
            <a href="#" className="text-gray-300 hover:text-white text-sm">Contact</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;