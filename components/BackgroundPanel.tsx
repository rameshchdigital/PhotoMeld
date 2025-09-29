/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState, useEffect } from 'react';
// FIX: Import missing ScissorsIcon.
import { UploadIcon, BackgroundIcon, ScissorsIcon } from './icons';

interface BackgroundPanelProps {
  onReplaceBackground: (options: { image?: File; prompt?: string }) => void;
  onRemoveBackground: () => void;
  isLoading: boolean;
}

const BackgroundPanel: React.FC<BackgroundPanelProps> = ({ onReplaceBackground, onRemoveBackground, isLoading }) => {
  const [backgroundFile, setBackgroundFile] = useState<File | null>(null);
  const [backgroundPreview, setBackgroundPreview] = useState<string | null>(null);
  const [prompt, setPrompt] = useState<string>('');

  useEffect(() => {
    if (backgroundFile) {
      const objectUrl = URL.createObjectURL(backgroundFile);
      setBackgroundPreview(objectUrl);
      
      // Clear the text prompt if an image is uploaded
      setPrompt('');

      return () => URL.revokeObjectURL(objectUrl);
    } else {
      setBackgroundPreview(null);
    }
  }, [backgroundFile]);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setBackgroundFile(e.target.files[0]);
    }
  };

  const handlePromptChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPrompt(e.target.value);
    // Clear the uploaded file if user starts typing a prompt
    if (backgroundFile) {
        setBackgroundFile(null);
        setBackgroundPreview(null);
    }
  }

  const handleApply = () => {
    onReplaceBackground({ image: backgroundFile, prompt });
  };
  
  const canApply = !isLoading && (!!backgroundFile || prompt.trim() !== '');

  return (
    <div className="w-full bg-gray-800/50 border border-gray-700 rounded-lg p-4 flex flex-col gap-4 animate-fade-in backdrop-blur-sm">
      <h3 className="text-lg font-semibold text-center text-gray-300 flex items-center justify-center gap-2">
        <BackgroundIcon className="w-6 h-6" />
        Background Tools
      </h3>

      <button
        onClick={onRemoveBackground}
        disabled={isLoading}
        className="flex items-center justify-center gap-2 w-full bg-gradient-to-br from-purple-600 to-indigo-500 text-white font-bold py-4 px-6 rounded-lg transition-all duration-300 ease-in-out shadow-lg shadow-purple-500/20 hover:shadow-xl hover:shadow-purple-500/40 hover:-translate-y-px active:scale-95 active:shadow-inner text-base disabled:from-purple-800 disabled:to-indigo-700 disabled:shadow-none disabled:cursor-not-allowed disabled:transform-none"
        aria-label="Remove image background"
        title="Automatically remove the background and make it transparent"
      >
        <ScissorsIcon className="w-5 h-5" />
        Remove Background
      </button>

      <div className="flex items-center gap-2 my-1">
        <div className="flex-grow h-px bg-gray-600/50"></div>
        <span className="text-sm text-gray-500">OR REPLACE WITH</span>
        <div className="flex-grow h-px bg-gray-600/50"></div>
      </div>
      
      <div className="flex flex-col md:flex-row items-center gap-4">
        {/* Left side: Image Upload */}
        <div className="w-full md:w-1/3 flex flex-col items-center gap-2">
            <label htmlFor="bg-image-upload" className={`relative flex flex-col items-center justify-center w-full h-32 border-2 ${ backgroundFile ? 'border-blue-500' : 'border-gray-600 border-dashed'} rounded-lg cursor-pointer bg-gray-800/50 hover:bg-gray-700/50 transition-colors`} title="Upload an image to use as the new background">
                {backgroundPreview ? (
                     <img src={backgroundPreview} alt="Background Preview" className="w-full h-full object-cover rounded-md" />
                ) : (
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <UploadIcon className="w-8 h-8 mb-2 text-gray-400" />
                        <p className="mb-1 text-sm text-gray-400"><span className="font-semibold">Click to upload</span></p>
                        <p className="text-xs text-gray-500">PNG, JPG, WEBP</p>
                    </div>
                )}
                <input id="bg-image-upload" type="file" className="hidden" accept="image/*" onChange={handleFileChange} disabled={isLoading}/>
            </label>
            {backgroundFile && (
                <button 
                  onClick={() => setBackgroundFile(null)}
                  className="text-xs text-red-400 hover:text-red-300"
                  disabled={isLoading}
                  title="Clear the selected background image"
                >
                  Remove
                </button>
            )}
        </div>
        
        <div className="flex items-center gap-2 my-1 md:h-24 md:flex-col">
            <div className="flex-grow h-px w-full md:w-px md:h-full bg-gray-600/50"></div>
            <span className="text-sm text-gray-500">OR</span>
            <div className="flex-grow h-px w-full md:w-px md:h-full bg-gray-600/50"></div>
        </div>

        {/* Right side: Text Prompt */}
        <div className="w-full md:flex-grow">
            <input
                type="text"
                value={prompt}
                onChange={handlePromptChange}
                placeholder="Describe a new background..."
                className="h-32 text-center flex-grow bg-gray-800 border-2 border-gray-600 text-gray-200 rounded-lg p-4 focus:ring-2 focus:ring-blue-500 focus:outline-none transition w-full disabled:cursor-not-allowed disabled:opacity-60 text-base"
                disabled={isLoading}
                title="Describe the new background you want to generate"
            />
        </div>
      </div>

      <div className="pt-2">
        <button
            onClick={handleApply}
            className="w-full bg-gradient-to-br from-blue-600 to-blue-500 text-white font-bold py-4 px-6 rounded-lg transition-all duration-300 ease-in-out shadow-lg shadow-blue-500/20 hover:shadow-xl hover:shadow-blue-500/40 hover:-translate-y-px active:scale-95 active:shadow-inner text-base disabled:from-blue-800 disabled:to-blue-700 disabled:shadow-none disabled:cursor-not-allowed disabled:transform-none"
            disabled={!canApply}
            title="Replace the background using your uploaded image or text prompt"
        >
            Apply Background
        </button>
      </div>
    </div>
  );
};

export default BackgroundPanel;