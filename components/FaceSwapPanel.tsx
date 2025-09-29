/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState, useEffect } from 'react';
import { UploadIcon, FaceSwapIcon } from './icons';

type SwapMode = 'currentIsSource' | 'currentIsTarget';

interface FaceSwapPanelProps {
  onFaceSwap: (otherImage: File, mode: SwapMode) => void;
  isLoading: boolean;
}

const FaceSwapPanel: React.FC<FaceSwapPanelProps> = ({ onFaceSwap, isLoading }) => {
  const [otherFile, setOtherFile] = useState<File | null>(null);
  const [otherFilePreview, setOtherFilePreview] = useState<string | null>(null);
  const [mode, setMode] = useState<SwapMode>('currentIsSource');

  useEffect(() => {
    if (otherFile) {
      const objectUrl = URL.createObjectURL(otherFile);
      setOtherFilePreview(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    } else {
      setOtherFilePreview(null);
    }
  }, [otherFile]);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setOtherFile(e.target.files[0]);
    }
  };

  const handleApply = () => {
    if (otherFile) {
      onFaceSwap(otherFile, mode);
    }
  };
  
  const canApply = !isLoading && !!otherFile;

  return (
    <div className="w-full bg-gray-800/50 border border-gray-700 rounded-lg p-4 flex flex-col gap-4 animate-fade-in backdrop-blur-sm">
      <h3 className="text-lg font-semibold text-center text-gray-300 flex items-center justify-center gap-2">
        <FaceSwapIcon className="w-6 h-6" />
        AI Face Swap
      </h3>
      <p className="text-sm text-center text-gray-400 -mt-2">
        Instantly transform your look. Swap a face from another photo onto your current image.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center bg-black/20 p-4 rounded-lg">
        <div className="flex flex-col gap-2">
            <h4 className="font-semibold text-gray-200">Step 1: Define Roles</h4>
            <p className="text-xs text-gray-400 mb-2">How should the main image on screen be used?</p>
            <div className="flex flex-col gap-2">
                <button onClick={() => setMode('currentIsSource')} className={`w-full text-left p-3 rounded-md border-2 transition-all ${mode === 'currentIsSource' ? 'bg-blue-500/20 border-blue-500' : 'bg-gray-700/50 border-transparent hover:bg-gray-600/50'}`}>
                    <p className="font-semibold text-gray-100">Use Main Image as Source</p>
                    <p className="text-xs text-gray-400">The face from the main image will be put onto the new one you upload.</p>
                </button>
                <button onClick={() => setMode('currentIsTarget')} className={`w-full text-left p-3 rounded-md border-2 transition-all ${mode === 'currentIsTarget' ? 'bg-blue-500/20 border-blue-500' : 'bg-gray-700/50 border-transparent hover:bg-gray-600/50'}`}>
                    <p className="font-semibold text-gray-100">Use Main Image as Target</p>
                    <p className="text-xs text-gray-400">A face from the new image you upload will be put onto the main image.</p>
                </button>
            </div>
        </div>
        <div className="flex flex-col gap-2">
            <h4 className="font-semibold text-gray-200">Step 2: Upload Other Image</h4>
            <label htmlFor="other-image-upload" className={`relative flex flex-col items-center justify-center w-full h-40 border-2 border-gray-600 border-dashed rounded-lg cursor-pointer bg-gray-800/50 hover:bg-gray-700/50 transition-colors`} title={mode === 'currentIsSource' ? 'Upload the image to receive the face' : 'Upload the image containing the face to use'}>
                {otherFilePreview ? (
                    <img src={otherFilePreview} alt="Other image preview" className="w-full h-full object-cover rounded-md" />
                ) : (
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <UploadIcon className="w-8 h-8 mb-2 text-gray-400" />
                        <p className="mb-1 text-sm text-gray-400">
                            {mode === 'currentIsSource' ? 'Upload Target Image' : 'Upload Source Image'}
                        </p>
                    </div>
                )}
                <input id="other-image-upload" type="file" className="hidden" accept="image/*" onChange={handleFileChange} disabled={isLoading}/>
            </label>
        </div>
      </div>

      <div className="pt-2">
        <button
            onClick={handleApply}
            className="w-full bg-gradient-to-br from-blue-600 to-blue-500 text-white font-bold py-4 px-6 rounded-lg transition-all duration-300 ease-in-out shadow-lg shadow-blue-500/20 hover:shadow-xl hover:shadow-blue-500/40 hover:-translate-y-px active:scale-95 active:shadow-inner text-base disabled:from-blue-800 disabled:to-blue-700 disabled:shadow-none disabled:cursor-not-allowed disabled:transform-none"
            disabled={!canApply}
            title="Perform the face swap operation"
        >
            Swap Faces
        </button>
      </div>
    </div>
  );
};

export default FaceSwapPanel;