/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState } from 'react';
import { SparkleIcon } from './icons';
import Spinner from './Spinner';

interface LogoGeneratorPanelProps {
  onGenerate: (companyName: string, slogan: string, style: string) => void;
  onLogoSelect: (dataUrl: string) => void;
  isLoading: boolean;
  generatedLogos: string[];
}

const LogoGeneratorPanel: React.FC<LogoGeneratorPanelProps> = ({ onGenerate, onLogoSelect, isLoading, generatedLogos }) => {
  const [companyName, setCompanyName] = useState('');
  const [slogan, setSlogan] = useState('');
  const [style, setStyle] = useState('');
  
  const stylePresets = [
    'Minimalist', 'Geometric', 'Modern', 'Vintage', 'Abstract', 'Lettermark', 'Bold', 'Elegant'
  ];

  const handleStyleClick = (stylePreset: string) => {
    setStyle(prev => {
        if (prev.toLowerCase().includes(stylePreset.toLowerCase())) return prev;
        return prev ? `${prev}, ${stylePreset.toLowerCase()}` : `${stylePreset}`;
    });
  }

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    if (companyName.trim() && style.trim()) {
      onGenerate(companyName, slogan, style);
    }
  };

  return (
    <div className="w-full bg-gray-800/50 border border-gray-700 rounded-lg p-4 flex flex-col gap-4 animate-fade-in backdrop-blur-sm">
      <h3 className="text-lg font-semibold text-center text-gray-300 flex items-center justify-center gap-2">
        <SparkleIcon className="w-6 h-6" />
        AI Logo Generator
      </h3>
      <p className="text-sm text-center text-gray-400 -mt-2">
        Create a unique logo for your brand. The selected logo will replace your current image.
      </p>

      <form onSubmit={handleGenerate} className="flex flex-col gap-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="Company Name*"
                className="bg-gray-800 border-2 border-gray-700 text-gray-200 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none transition w-full"
                disabled={isLoading}
                required
                title="Enter the name of your company or brand"
            />
            <input
                type="text"
                value={slogan}
                onChange={(e) => setSlogan(e.target.value)}
                placeholder="Slogan (Optional)"
                className="bg-gray-800 border-2 border-gray-700 text-gray-200 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none transition w-full"
                disabled={isLoading}
                title="Enter an optional slogan or tagline"
            />
        </div>
        <textarea
          value={style}
          onChange={(e) => setStyle(e.target.value)}
          placeholder="Describe the logo style... e.g., 'A blue lion icon, geometric, minimalist'* "
          className="bg-gray-800 border-2 border-gray-700 text-gray-200 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none transition w-full min-h-[80px]"
          disabled={isLoading}
          rows={3}
          required
          title="Describe the visual style, colors, and any icon you want"
        />

        <div className="flex flex-wrap gap-2">
            {stylePresets.map(preset => (
                <button
                    key={preset}
                    type="button"
                    onClick={() => handleStyleClick(preset)}
                    disabled={isLoading}
                    className="bg-white/10 text-gray-200 text-xs font-semibold py-1 px-3 rounded-full hover:bg-white/20 transition-colors"
                >
                   + {preset}
                </button>
            ))}
        </div>
        
        <button
          type="submit"
          className="w-full bg-gradient-to-br from-purple-600 to-indigo-500 text-white font-bold py-4 px-6 rounded-lg transition-all duration-300 ease-in-out shadow-lg shadow-purple-500/20 hover:shadow-xl hover:shadow-purple-500/40 hover:-translate-y-px active:scale-95 active:shadow-inner text-base disabled:from-purple-800 disabled:to-indigo-700 disabled:shadow-none disabled:cursor-not-allowed disabled:transform-none"
          disabled={isLoading || !companyName.trim() || !style.trim()}
          title="Generate logo concepts"
        >
          {isLoading ? 'Generating...' : 'Generate Logos'}
        </button>
      </form>

      {isLoading && generatedLogos.length === 0 && (
         <div className="flex flex-col items-center justify-center gap-4 p-8">
            <Spinner />
            <p className="text-gray-300">Generating your logos...</p>
         </div>
      )}

      {generatedLogos.length > 0 && (
        <div className="pt-4 border-t border-gray-700 mt-4">
            <h4 className="text-md font-semibold text-center text-gray-200 mb-4">Select a Logo to Start Editing</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {generatedLogos.map((logoUrl, index) => (
                    <button
                        key={index}
                        onClick={() => onLogoSelect(logoUrl)}
                        className="aspect-square bg-white/10 rounded-lg overflow-hidden border-2 border-transparent hover:border-blue-500 hover:ring-2 hover:ring-blue-500 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500"
                        title={`Select logo option ${index + 1}`}
                    >
                        <img src={logoUrl} alt={`Generated Logo ${index + 1}`} className="w-full h-full object-contain" />
                    </button>
                ))}
            </div>
        </div>
      )}
    </div>
  );
};

export default LogoGeneratorPanel;