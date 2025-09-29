/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState } from 'react';
import { SparkleIcon } from './icons';

type AspectRatio = '1:1' | '16:9' | '9:16' | '4:3' | '3:4';

interface ImageGeneratorPanelProps {
  onGenerate: (prompt: string, aspectRatio: AspectRatio) => void;
  isLoading: boolean;
}

const ImageGeneratorPanel: React.FC<ImageGeneratorPanelProps> = ({ onGenerate, isLoading }) => {
  const [prompt, setPrompt] = useState('');
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('1:1');

  const aspectRatios: { id: AspectRatio; label: string }[] = [
    { id: '1:1', label: 'Square' },
    { id: '16:9', label: 'Widescreen' },
    { id: '9:16', label: 'Portrait' },
    { id: '4:3', label: 'Landscape' },
    { id: '3:4', label: 'Tall' },
  ];
  
  const stylePresets = [
    'Photorealistic', 'Digital art', 'Cinematic', '3D render', 'Anime', 'Fantasy', 'Sci-fi', 'Vintage photo'
  ];

  const handleStyleClick = (style: string) => {
    setPrompt(prev => {
        // Avoid adding duplicate styles
        if (prev.toLowerCase().includes(style.toLowerCase())) return prev;
        return prev ? `${prev}, ${style.toLowerCase()}` : `${style}`;
    });
  }

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim()) {
      onGenerate(prompt, aspectRatio);
    }
  };

  return (
    <div className="w-full bg-gray-800/50 border border-gray-700 rounded-lg p-4 flex flex-col gap-4 animate-fade-in backdrop-blur-sm">
      <h3 className="text-lg font-semibold text-center text-gray-300 flex items-center justify-center gap-2">
        <SparkleIcon className="w-6 h-6" />
        AI Image Generator
      </h3>
      <p className="text-sm text-center text-gray-400 -mt-2">
        Create a brand new image from a text description. This will replace your current image.
      </p>

      <form onSubmit={handleGenerate} className="flex flex-col gap-4">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Describe anything you can imagine... e.g., 'An astronaut riding a horse on Mars, photorealistic.'"
          className="flex-grow bg-gray-800 border-2 border-gray-700 text-gray-200 rounded-lg p-4 focus:ring-2 focus:ring-blue-500 focus:outline-none transition w-full disabled:cursor-not-allowed disabled:opacity-60 text-base min-h-[120px]"
          disabled={isLoading}
          rows={4}
          title="Describe the image you want to create"
        />

        <div className="flex flex-col gap-2">
            <label className="font-semibold text-gray-300 text-sm">Add a style:</label>
            <div className="flex flex-wrap gap-2">
                {stylePresets.map(style => (
                    <button
                        key={style}
                        type="button"
                        onClick={() => handleStyleClick(style)}
                        disabled={isLoading}
                        className="bg-white/10 text-gray-200 text-xs font-semibold py-1 px-3 rounded-full hover:bg-white/20 transition-colors"
                    >
                       + {style}
                    </button>
                ))}
            </div>
        </div>

        <div className="flex flex-col gap-2">
            <label className="font-semibold text-gray-300 text-sm">Aspect Ratio:</label>
            <div className="grid grid-cols-5 gap-2">
                {aspectRatios.map(({ id, label }) => (
                    <button
                        key={id}
                        type="button"
                        onClick={() => setAspectRatio(id)}
                        disabled={isLoading}
                        className={`py-2 px-1 text-center rounded-md text-xs font-semibold transition-all ${aspectRatio === id ? 'bg-blue-600 text-white' : 'bg-gray-700 hover:bg-gray-600'}`}
                    >
                        {label} <span className="block text-gray-400">{id}</span>
                    </button>
                ))}
            </div>
        </div>
        
        <button
          type="submit"
          className="w-full bg-gradient-to-br from-purple-600 to-indigo-500 text-white font-bold py-4 px-6 rounded-lg transition-all duration-300 ease-in-out shadow-lg shadow-purple-500/20 hover:shadow-xl hover:shadow-purple-500/40 hover:-translate-y-px active:scale-95 active:shadow-inner text-base disabled:from-purple-800 disabled:to-indigo-700 disabled:shadow-none disabled:cursor-not-allowed disabled:transform-none"
          disabled={isLoading || !prompt.trim()}
          title="Generate a new image based on your prompt"
        >
          Generate Image
        </button>
      </form>
    </div>
  );
};

export default ImageGeneratorPanel;