/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React from 'react';
import { SparkleIcon, SearchIcon } from './icons';
import { Page } from '../App';

interface HeaderProps {
  onNavigate: (page: Page) => void;
  onOpenSearch: () => void;
}

const Header: React.FC<HeaderProps> = ({ onNavigate, onOpenSearch }) => {
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
            <button onClick={() => onNavigate('photoEditingCategory')} className="px-4 py-2 text-sm font-semibold text-gray-300 hover:text-white transition-colors" title="Explore all photo editing & enhancement tools">
              Photo Editing
            </button>
          </li>
          <li>
            <button onClick={() => onNavigate('portraitToolsCategory')} className="px-4 py-2 text-sm font-semibold text-gray-300 hover:text-white transition-colors" title="Explore all AI portrait tools">
              Portrait Tools
            </button>
          </li>
          <li>
            <button onClick={() => onNavigate('creativeCategory')} className="px-4 py-2 text-sm font-semibold text-gray-300 hover:text-white transition-colors" title="Explore all creative & generative AI tools">
              Creative AI
            </button>
          </li>
           <li>
            <button onClick={() => onNavigate('fileConverter')} className="px-4 py-2 text-sm font-semibold text-gray-300 hover:text-white transition-colors" title="Convert image file formats">
              File Converter
            </button>
          </li>
          <li>
            <button onClick={() => onNavigate('contact')} className="px-4 py-2 text-sm font-semibold text-gray-300 hover:text-white transition-colors" title="Get in touch with us">
              Contact
            </button>
          </li>
        </ul>
      </nav>
      <div className="w-40 text-right flex items-center justify-end gap-4">
        <button
          onClick={onOpenSearch}
          className="p-2 rounded-full text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
          title="Search for a tool"
          aria-label="Search for a tool"
        >
          <SearchIcon className="w-5 h-5" />
        </button>
        {/* Placeholder for future buttons like Login/Sign Up */}
      </div>
    </header>
  );
};

export default Header;
