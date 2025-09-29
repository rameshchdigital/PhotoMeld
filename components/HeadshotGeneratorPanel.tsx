/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState, useEffect, useCallback } from 'react';
import { UploadIcon, SparkleIcon, XCircleIcon } from './icons';
import Spinner from './Spinner';

interface HeadshotGeneratorPanelProps {
  onGenerate: (selfies: File[]) => void;
  onHeadshotSelect: (dataUrl: string) => void;
  isLoading: boolean;
  generatedHeadshots: string[];
}

const MIN_FILES = 4;
const MAX_FILES = 10;

const HeadshotGeneratorPanel: React.FC<HeadshotGeneratorPanelProps> = ({ onGenerate, onHeadshotSelect, isLoading, generatedHeadshots }) => {
  const [selfies, setSelfies] = useState<File[]>([]);
  const [selfiePreviews, setSelfiePreviews] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
        handleFiles(e.target.files);
    }
  };

  const handleFiles = (files: FileList) => {
    setError(null);
    const newFiles = Array.from(files);
    if (selfies.length + newFiles.length > MAX_FILES) {
        setError(`You can upload a maximum of ${MAX_FILES} images.`);
        return;
    }
    setSelfies(prev => [...prev, ...newFiles]);
  };

  const removeSelfie = (indexToRemove: number) => {
    setSelfies(prev => prev.filter((_, index) => index !== indexToRemove));
    setSelfiePreviews(prev => prev.filter((_, index) => index !== indexToRemove));
  };

  useEffect(() => {
    const newUrls = selfies.map(file => URL.createObjectURL(file));
    setSelfiePreviews(newUrls);

    return () => {
      newUrls.forEach(url => URL.revokeObjectURL(url));
    };
  }, [selfies]);

  const handleGenerate = () => {
    if (selfies.length < MIN_FILES) {
      setError(`Please upload at least ${MIN_FILES} selfies for the best results.`);
      return;
    }
    setError(null);
    onGenerate(selfies);
  };
  
  const handleDrop = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    handleFiles(e.dataTransfer.files);
  }, [selfies]);

  const handleDragOver = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const canGenerate = !isLoading && selfies.length >= MIN_FILES && selfies.length <= MAX_FILES;

  return (
    <div className="w-full bg-gray-800/50 border border-gray-700 rounded-lg p-4 flex flex-col gap-4 animate-fade-in backdrop-blur-sm">
      <h3 className="text-lg font-semibold text-center text-gray-300 flex items-center justify-center gap-2">
        <SparkleIcon className="w-6 h-6" />
        AI Headshot Generator
      </h3>
      <p className="text-sm text-center text-gray-400 -mt-2">
        Upload your selfies to create professional headshots in minutes. Save time and money!
      </p>

      {generatedHeadshots.length > 0 ? (
        <div className="pt-4">
            <h4 className="text-md font-semibold text-center text-gray-200 mb-4">Your Headshots are Ready!</h4>
            <p className="text-sm text-center text-gray-400 -mt-2 mb-4">Select one to load it into the editor for further adjustments or download.</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {generatedHeadshots.map((headshotUrl, index) => (
                    <button
                        key={index}
                        onClick={() => onHeadshotSelect(headshotUrl)}
                        className="aspect-[4/5] bg-white/10 rounded-lg overflow-hidden border-2 border-transparent hover:border-blue-500 hover:ring-2 hover:ring-blue-500 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500"
                        title={`Select headshot option ${index + 1}`}
                    >
                        <img src={headshotUrl} alt={`Generated Headshot ${index + 1}`} className="w-full h-full object-cover" />
                    </button>
                ))}
            </div>
        </div>
      ) : isLoading ? (
        <div className="flex flex-col items-center justify-center gap-4 p-8">
            <Spinner />
            <p className="text-gray-300">Generating your headshots...</p>
            <p className="text-sm text-gray-400">This may take a few moments.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
            <div className="bg-black/20 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-200">Instructions:</h4>
                <ul className="list-disc list-inside text-sm text-gray-400 mt-1 space-y-1">
                    <li>Upload {MIN_FILES}-{MAX_FILES} clear selfies.</li>
                    <li>Use varied angles and expressions.</li>
                    <li>Ensure good, consistent lighting. Avoid sunglasses and hats.</li>
                </ul>
            </div>
            {selfies.length > 0 && (
                <div className="grid grid-cols-5 gap-2">
                    {selfiePreviews.map((preview, index) => (
                        <div key={index} className="relative aspect-square">
                            <img src={preview} alt={`Selfie ${index + 1}`} className="w-full h-full object-cover rounded-md" />
                            <button onClick={() => removeSelfie(index)} className="absolute -top-1 -right-1 bg-red-600 rounded-full text-white p-0.5">
                                <XCircleIcon className="w-5 h-5"/>
                            </button>
                        </div>
                    ))}
                </div>
            )}
            <label 
              htmlFor="selfie-upload" 
              className="relative flex flex-col items-center justify-center w-full h-32 border-2 border-gray-600 border-dashed rounded-lg cursor-pointer bg-gray-800/50 hover:bg-gray-700/50 transition-colors"
              onDrop={handleDrop}
              onDragOver={handleDragOver}
            >
                <UploadIcon className="w-8 h-8 mb-2 text-gray-400" />
                <p className="mb-1 text-sm text-gray-400"><span className="font-semibold">Click to upload</span> or drag & drop</p>
                <p className="text-xs text-gray-500">{selfies.length} / {MAX_FILES} images selected</p>
                <input id="selfie-upload" type="file" multiple className="hidden" accept="image/*" onChange={handleFileChange} disabled={isLoading || selfies.length >= MAX_FILES}/>
            </label>
             {error && <p className="text-sm text-red-400 text-center">{error}</p>}
            <button
                onClick={handleGenerate}
                className="w-full bg-gradient-to-br from-purple-600 to-indigo-500 text-white font-bold py-4 px-6 rounded-lg transition-all duration-300 ease-in-out shadow-lg shadow-purple-500/20 hover:shadow-xl hover:shadow-purple-500/40 hover:-translate-y-px active:scale-95 active:shadow-inner text-base disabled:from-purple-800 disabled:to-indigo-700 disabled:shadow-none disabled:cursor-not-allowed disabled:transform-none"
                disabled={!canGenerate}
                title="Generate professional headshots from your uploaded selfies"
            >
                Generate Headshots ({selfies.length} images)
            </button>
        </div>
      )}
    </div>
  );
};

export default HeadshotGeneratorPanel;
