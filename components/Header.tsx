/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React from 'react';
import { SparkleIcon } from './icons';
import { Page } from '../App';

interface HeaderProps {
  onNavigate: (page: Page) => void;
}

const Header: React.FC<HeaderProps> = ({ onNavigate }) => {
  return (
    <header className="w-full py-2 px-6 border-b border-gray-700/50 bg-gray-900/60 backdrop-blur-sm sticky top-0 z-50 flex items-center justify-between">
      <button onClick={() => onNavigate('home')} className="flex items-center gap-3" title="Go to Homepage">
          <SparkleIcon className="w-7 h-7 text-blue-400" />
          <h1 className="text-xl font-bold tracking-tight text-gray-100">
            PhotoMeld
          </h1>
      </button>
      <nav>
        <ul className="flex items-center">
          <li>
            <button onClick={() => onNavigate('photoEditingCategory')} className="px-4 py-2 text-sm font-semibold text-gray-300 hover:text-white transition-colors">
              Photo Editing
            </button>
          </li>
          <li>
            <button onClick={() => onNavigate('portraitToolsCategory')} className="px-4 py-2 text-sm font-semibold text-gray-300 hover:text-white transition-colors">
              Portrait Tools
            </button>
          </li>
          <li>
            <button onClick={() => onNavigate('creativeCategory')} className="px-4 py-2 text-sm font-semibold text-gray-300 hover:text-white transition-colors">
              Creative AI
            </button>
          </li>
           <li>
            <button onClick={() => onNavigate('fileConverter')} className="px-4 py-2 text-sm font-semibold text-gray-300 hover:text-white transition-colors">
              File Converter
            </button>
          </li>
          <li>
            <button onClick={() => onNavigate('contact')} className="px-4 py-2 text-sm font-semibold text-gray-300 hover:text-white transition-colors">
              Contact
            </button>
          </li>
        </ul>
      </nav>
      <div className="w-40 text-right">
        {/* Placeholder for future buttons like Login/Sign Up */}
      </div>
    </header>
  );
};

export default Header;