/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState } from 'react';
import { SparkleIcon } from './icons';

interface HairstylePanelProps {
  onGenerate: (prompt: string) => void;
  isLoading: boolean;
}

const HairstylePanel: React.FC<HairstylePanelProps> = ({ onGenerate, isLoading }) => {
  const [customPrompt, setCustomPrompt] = useState('');

  const stylePresets = [
    { name: 'Long & Wavy', prompt: 'a long and wavy hairstyle' },
    { name: 'Short Bob', prompt: 'a short bob haircut' },
    { name: 'Pixie Cut', prompt: 'a chic pixie cut' },
    { name: 'Curly Afro', prompt: 'a voluminous curly afro' },
    { name: 'Slicked-back', prompt: 'a slicked-back hairstyle' },
    { name: 'Man Bun', prompt: 'a man bun' },
    { name: 'Buzz Cut', prompt: 'a buzz cut' },
    { name: 'Braids', prompt: 'intricate braids' },
  ];

  const colorPresets = [
    { name: 'Platinum Blonde', prompt: 'change their hair color to platinum blonde' },
    { name: 'Vibrant Pink', prompt: 'change their hair color to vibrant pink' },
    { name: 'Electric Blue', prompt: 'change their hair color to electric blue' },
    { name: 'Fiery Red', prompt: 'change their hair color to fiery red' },
  ];

  const handleApply = () => {
    if (customPrompt.trim()) {
      onGenerate(customPrompt);
    }
  };

  return (
    <div className="w-full bg-gray-800/50 border border-gray-700 rounded-lg p-4 flex flex-col items-center gap-4 animate-fade-in backdrop-blur-sm">
      <h3 className="text-lg font-semibold text-center text-gray-300 flex items-center justify-center gap-2">
        <SparkleIcon className="w-6 h-6" />
        AI Hairstyle Changer
      </h3>
      <p className="text-md text-gray-400 text-center -mt-2">
        Try on a new look! Describe a hairstyle or pick from the presets below.
      </p>

      <form onSubmit={(e) => { e.preventDefault(); handleApply(); }} className="w-full flex items-center gap-2">
        <input
          type="text"
          value={customPrompt}
          onChange={(e) => setCustomPrompt(e.target.value)}
          placeholder="Or describe a custom hairstyle..."
          className="flex-grow bg-gray-800 border border-gray-600 text-gray-200 rounded-lg p-4 focus:ring-2 focus:ring-blue-500 focus:outline-none transition w-full disabled:cursor-not-allowed disabled:opacity-60 text-base"
          disabled={isLoading}
          title="Describe any hairstyle you can imagine"
        />
        <button 
          type="submit"
          className="bg-gradient-to-br from-blue-600 to-blue-500 text-white font-bold py-4 px-6 rounded-lg transition-all duration-300 ease-in-out shadow-lg shadow-blue-500/20 hover:shadow-xl hover:shadow-blue-500/40 hover:-translate-y-px active:scale-95 active:shadow-inner text-base disabled:from-blue-800 disabled:to-blue-700 disabled:shadow-none disabled:cursor-not-allowed disabled:transform-none"
          disabled={isLoading || !customPrompt.trim()}
          title="Apply your custom hairstyle"
        >
          Apply
        </button>
      </form>

      <div className="flex items-center gap-2 my-1 w-full">
        <div className="flex-grow h-px bg-gray-600/50"></div>
        <span className="text-sm text-gray-500">OR CHOOSE A PRESET</span>
        <div className="flex-grow h-px bg-gray-600/50"></div>
      </div>

      <div className="w-full space-y-4">
        <div>
            <h4 className="font-semibold text-gray-300 mb-2">Styles</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {stylePresets.map(preset => (
                <button
                    key={preset.name}
                    onClick={() => onGenerate(preset.prompt)}
                    disabled={isLoading}
                    className="w-full text-center bg-white/10 border border-transparent text-gray-200 font-semibold py-4 px-2 rounded-lg transition-all duration-200 ease-in-out hover:bg-white/20 active:scale-95 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    title={`Apply the '${preset.name}' hairstyle`}
                >
                    {preset.name}
                </button>
                ))}
            </div>
        </div>
        <div>
            <h4 className="font-semibold text-gray-300 mb-2">Colors</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {colorPresets.map(preset => (
                <button
                    key={preset.name}
                    onClick={() => onGenerate(preset.prompt)}
                    disabled={isLoading}
                    className="w-full text-center bg-white/10 border border-transparent text-gray-200 font-semibold py-4 px-2 rounded-lg transition-all duration-200 ease-in-out hover:bg-white/20 active:scale-95 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    title={`Change hair color to ${preset.name}`}
                >
                    {preset.name}
                </button>
                ))}
            </div>
        </div>
      </div>
    </div>
  );
};

export default HairstylePanel;