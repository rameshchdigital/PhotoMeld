/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState } from 'react';
// FIX: Import missing RestyleIcon.
import { RestyleIcon } from './icons';

interface RestylePanelProps {
  onApplyRestyle: (prompt: string) => void;
  isLoading: boolean;
}

const RestylePanel: React.FC<RestylePanelProps> = ({ onApplyRestyle, isLoading }) => {
  const [prompt, setPrompt] = useState('');

  const handleApply = () => {
    if (prompt.trim()) {
      onApplyRestyle(prompt);
    }
  };

  return (
    <div className="w-full bg-gray-800/50 border border-gray-700 rounded-lg p-4 flex flex-col items-center gap-4 animate-fade-in backdrop-blur-sm">
        <h3 className="text-lg font-semibold text-center text-gray-300 flex items-center justify-center gap-2">
            <RestyleIcon className="w-6 h-6" /> 
            AI Scene Restyler
        </h3>
        <p className="text-md text-gray-400 text-center">
            Describe a new theme or setting for your image. The AI will keep your subject and change the world around them.
        </p>

        <form onSubmit={(e) => { e.preventDefault(); handleApply(); }} className="w-full flex flex-col items-center gap-4 pt-2">
            <input
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="e.g., 'a vibrant, futuristic cyberpunk city at night'"
                className="flex-grow bg-gray-800 border border-gray-700 text-gray-200 rounded-lg p-5 text-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition w-full disabled:cursor-not-allowed disabled:opacity-60"
                disabled={isLoading}
                title="Describe the new scene or environment (e.g., 'a mystical forest at night')"
            />
            <button
                type="submit"
                className="w-full max-w-sm bg-gradient-to-br from-blue-600 to-blue-500 text-white font-bold py-4 px-6 rounded-lg transition-all duration-300 ease-in-out shadow-lg shadow-blue-500/20 hover:shadow-xl hover:shadow-blue-500/40 hover:-translate-y-px active:scale-95 active:shadow-inner text-base disabled:from-blue-800 disabled:to-blue-700 disabled:shadow-none disabled:cursor-not-allowed disabled:transform-none"
                disabled={isLoading || !prompt.trim()}
                title="Recreate the scene based on your description"
            >
                Restyle Scene
            </button>
        </form>
    </div>
  );
};

export default RestylePanel;