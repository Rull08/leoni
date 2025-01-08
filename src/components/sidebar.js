'use client'
import { useState } from 'react';
import { HomeIcon, UserIcon, CogIcon, Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="flex">
      <button
        className="p-2 bg-gray-800 text-white"
        onClick={toggleSidebar}
        aria-label="Toggle Sidebar"
      >
        {isOpen ? <XMarkIcon className="h-6 w-6" /> : <Bars3Icon className="h-6 w-6" />}
      </button>

      <div
        className={`fixed top-0 left-0 h-screen bg-gray-800 text-white transform ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } transition-transform duration-300 w-64`}
      >
        <div className="p-6 text-lg font-bold">My Sidebar</div>
        <nav className="flex-1">
          <ul className="space-y-2">
            <li>
              <a href="/" className="flex items-center p-4 hover:bg-gray-700">
                <HomeIcon className="h-6 w-6 mr-3" />
                Home
              </a>
            </li>
            <li>
              <a href="/profile" className="flex items-center p-4 hover:bg-gray-700">
                <UserIcon className="h-6 w-6 mr-3" />
                Profile
              </a>
            </li>
            <li>
              <a href="/settings" className="flex items-center p-4 hover:bg-gray-700">
                <CogIcon className="h-6 w-6 mr-3" />
                Settings
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;
