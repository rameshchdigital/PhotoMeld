/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Page } from '../App';
import { allTools } from '../services/toolData';
import { SearchIcon, CloseIcon } from './icons';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (page: Page) => void;
}

const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose, onNavigate }) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      // Focus the input when the modal opens
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      // Reset query when modal closes
      setQuery('');
    }
  }, [isOpen]);

  // Handle Escape key press
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  const filteredTools = useMemo(() => {
    if (!query.trim()) {
      return [];
    }
    const lowerCaseQuery = query.toLowerCase();
    return allTools.filter(tool =>
      tool.name.toLowerCase().includes(lowerCaseQuery) ||
      tool.description.toLowerCase().includes(lowerCaseQuery) ||
      tool.keywords.toLowerCase().includes(lowerCaseQuery)
    ).slice(0, 10); // Limit to 10 results
  }, [query]);

  const handleResultClick = (page: Page) => {
    onNavigate(page);
    onClose();
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 bg-black/70 backdrop-blur-sm flex justify-center z-50 animate-fade-in"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      <div
        className="bg-gray-800 border border-gray-700 rounded-xl shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col m-8 mt-24 animate-fade-in"
        onClick={e => e.stopPropagation()}
      >
        <header className="flex items-center gap-4 p-4 border-b border-gray-700">
          <SearchIcon className="w-6 h-6 text-gray-400" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for a tool (e.g., 'background remover')"
            className="w-full bg-transparent text-lg text-gray-100 placeholder-gray-500 focus:outline-none"
          />
          <button onClick={onClose} className="text-gray-400 hover:text-white" aria-label="Close search">
            <CloseIcon className="h-6 w-6" />
          </button>
        </header>
        <main className="p-2 overflow-y-auto">
          {query.trim() && filteredTools.length === 0 && (
            <div className="p-8 text-center text-gray-400">
              <p>No tools found for "{query}"</p>
            </div>
          )}
          {filteredTools.length > 0 && (
            <ul className="space-y-1">
              {filteredTools.map(tool => (
                <li key={tool.page}>
                  <button
                    onClick={() => handleResultClick(tool.page as Page)}
                    className="w-full text-left p-4 rounded-lg hover:bg-blue-500/10 transition-colors flex items-center gap-4 group"
                  >
                    <div className="bg-gray-900 p-3 rounded-lg flex-shrink-0">
                      <tool.Icon className="w-6 h-6 text-blue-400" />
                    </div>
                    <div>
                      <h3 className="font-bold text-white group-hover:text-blue-300">{tool.name}</h3>
                      <p className="text-sm text-gray-400 line-clamp-1">{tool.description}</p>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </main>
      </div>
    </div>
  );
};

export default SearchModal;
