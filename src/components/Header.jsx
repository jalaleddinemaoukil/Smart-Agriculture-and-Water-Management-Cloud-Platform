import React from 'react';
import { Menu, Settings } from 'lucide-react';

function Header({ onMenuClick }) {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <button onClick={onMenuClick} className="mr-4 lg:hidden">
            <Menu className="w-6 h-6 text-gray-600" />
          </button>
          <h1 className="text-2xl font-bold text-green-600">SAWMP</h1>
          <span className="ml-3 text-sm text-gray-500 hidden sm:inline">
            Smart Agriculture & Water Management
          </span>
        </div>
        <div className="flex items-center space-x-4">
          <div className="hidden md:flex items-center bg-green-50 px-3 py-2 rounded-lg">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-2"></div>
            <span className="text-sm text-green-700 font-medium">Live</span>
          </div>
          <button className="p-2 hover:bg-gray-100 rounded-lg transition">
            <Settings className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;