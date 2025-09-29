/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState } from 'react';
import { UploadIcon, MagicWandIcon, PaletteIcon, SunIcon, LayersIcon } from './icons';

interface StartScreenProps {
  onFileSelect: (files: FileList | null) => void;
  hasSavedSession: boolean;
  onResumeSession: () => void;
}

const StartScreen: React.FC<StartScreenProps> = ({ onFileSelect, hasSavedSession, onResumeSession }) => {
  const [isDraggingOver, setIsDraggingOver] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFileSelect(e.target.files);
  };

  return (
    <div 
      className={`w-full max-w-5xl mx-auto text-center p-8 transition-all duration-300 rounded-2xl border-2 ${isDraggingOver ? 'bg-blue-500/10 border-dashed border-blue-400' : 'border-transparent'}`}
      onDragOver={(e) => { e.preventDefault(); setIsDraggingOver(true); }}
      onDragLeave={() => setIsDraggingOver(false)}
      onDrop={(e) => {
        e.preventDefault();
        setIsDraggingOver(false);
        onFileSelect(e.dataTransfer.files);
      }}
    >
      <div className="flex flex-col items-center gap-6 animate-fade-in">
        <h1 className="text-5xl font-extrabold tracking-tight text-gray-100 sm:text-6xl md:text-7xl">
          AI-Powered Photo Editing, <span className="text-blue-400">Simplified</span>.
        </h1>
        <p className="max-w-3xl text-lg text-gray-400 md:text-xl">
          Retouch single photos with precision, or apply filters and adjustments to hundreds of images at once with our new Batch Editor.
        </p>

        <div className="mt-6 flex flex-col items-center gap-4">
            {hasSavedSession && (
              <>
                <button 
                  onClick={onResumeSession}
                  className="relative inline-flex items-center justify-center px-10 py-5 text-xl font-bold text-white bg-green-600 rounded-full cursor-pointer group hover:bg-green-500 transition-colors animate-fade-in"
                  title="Resume your previous batch editing session"
                >
                    <LayersIcon className="w-6 h-6 mr-3" />
                    Resume Last Batch Session
                </button>

                <div className="flex items-center gap-2 my-1">
                    <div className="flex-grow h-px bg-gray-600/50 w-24"></div>
                    <span className="text-sm text-gray-500">OR START NEW</span>
                    <div className="flex-grow h-px bg-gray-600/50 w-24"></div>
                </div>
              </>
            )}
            <label htmlFor="image-upload-start" className="relative inline-flex items-center justify-center px-10 py-5 text-xl font-bold text-white bg-blue-600 rounded-full cursor-pointer group hover:bg-blue-500 transition-colors" title="Select a single image to start editing">
                <UploadIcon className="w-6 h-6 mr-3 transition-transform duration-500 ease-in-out group-hover:rotate-[360deg] group-hover:scale-110" />
                Upload an Image
            </label>
            <input id="image-upload-start" type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
            
            <div className="flex items-center gap-2 my-1">
                <div className="flex-grow h-px bg-gray-600/50 w-24"></div>
                <span className="text-sm text-gray-500">OR</span>
                <div className="flex-grow h-px bg-gray-600/50 w-24"></div>
            </div>

            <label htmlFor="batch-image-upload" className="relative inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white bg-gray-700 rounded-full cursor-pointer group hover:bg-gray-600 transition-colors" title="Select multiple images for batch processing">
                <LayersIcon className="w-6 h-6 mr-3" />
                Batch Edit Multiple Images
            </label>
            <input id="batch-image-upload" type="file" multiple className="hidden" accept="image/*" onChange={handleFileChange} />

            <p className="text-sm text-gray-500">or drag and drop files</p>
        </div>

        <div className="mt-16 w-full">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-black/20 p-6 rounded-lg border border-gray-700/50 flex flex-col items-center text-center">
                    <div className="flex items-center justify-center w-12 h-12 bg-gray-700 rounded-full mb-4">
                       <MagicWandIcon className="w-6 h-6 text-blue-400" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-100">Precise Retouching</h3>
                    <p className="mt-2 text-gray-400">Click any point on your image to remove blemishes, change colors, or add elements with pinpoint accuracy.</p>
                </div>
                <div className="bg-black/20 p-6 rounded-lg border border-gray-700/50 flex flex-col items-center text-center">
                    <div className="flex items-center justify-center w-12 h-12 bg-gray-700 rounded-full mb-4">
                       <PaletteIcon className="w-6 h-6 text-blue-400" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-100">Creative Filters</h3>
                    <p className="mt-2 text-gray-400">Transform photos with artistic styles. From vintage looks to futuristic glows, find or create the perfect filter.</p>
                </div>
                <div className="bg-black/20 p-6 rounded-lg border border-gray-700/50 flex flex-col items-center text-center">
                    <div className="flex items-center justify-center w-12 h-12 bg-gray-700 rounded-full mb-4">
                       <SunIcon className="w-6 h-6 text-blue-400" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-100">Pro Adjustments</h3>
                    <p className="mt-2 text-gray-400">Enhance lighting, blur backgrounds, or change the mood. Get studio-quality results without complex tools.</p>
                </div>
            </div>
        </div>

      </div>
    </div>
  );
};

export default StartScreen;