/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React from 'react';

interface InfoModalProps {
  title: string;
  children: React.ReactNode;
  onClose: () => void;
}

const InfoModal: React.FC<InfoModalProps> = ({ title, children, onClose }) => {
  return (
    <div 
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      <div 
        className="bg-gray-800 border border-gray-700 rounded-xl shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col m-4 animate-fade-in"
        onClick={e => e.stopPropagation()} // Prevent clicks inside modal from closing it
      >
        <header className="flex items-center justify-between p-4 border-b border-gray-700">
          <h2 className="text-xl font-bold text-gray-100">{title}</h2>
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-white transition-colors"
            aria-label="Close"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </header>
        <main className="p-6 overflow-y-auto text-gray-300 prose prose-invert prose-p:text-gray-300 prose-strong:text-white prose-ul:list-disc prose-li:my-1">
          {children}
        </main>
        <footer className="p-4 border-t border-gray-700 text-right">
            <button
                onClick={onClose}
                className="bg-blue-600 hover:bg-blue-500 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
            >
                Got it
            </button>
        </footer>
      </div>
    </div>
  );
};

export default InfoModal;