/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React from 'react';
import { PassportIcon } from './icons';

interface PassportPhotoPanelProps {
  onGenerate: () => void;
  isLoading: boolean;
}

const PassportPhotoPanel: React.FC<PassportPhotoPanelProps> = ({ onGenerate, isLoading }) => {
  return (
    <div className="w-full bg-gray-800/50 border border-gray-700 rounded-lg p-4 flex flex-col items-center gap-4 animate-fade-in backdrop-blur-sm">
      <h3 className="text-lg font-semibold text-center text-gray-300 flex items-center justify-center gap-2">
        <PassportIcon className="w-6 h-6" />
        AI Passport Photo Maker
      </h3>
      <p className="text-md text-gray-400 text-center">
        Automatically create a professional, compliant passport photo from your image.
      </p>

      <div className="bg-black/20 p-4 rounded-lg text-sm text-gray-300 w-full">
        <h4 className="font-semibold text-gray-100 mb-2">Instructions for Best Results:</h4>
        <ul className="list-disc list-inside space-y-1 text-gray-400">
            <li>Use a clear, high-quality photo.</li>
            <li>Ensure you are facing the camera directly.</li>
            <li>Have a neutral facial expression with eyes open.</li>
            <li>The AI will automatically handle the background, centering, and cropping.</li>
        </ul>
      </div>

      <div className="pt-2 w-full max-w-sm">
        <button
          onClick={onGenerate}
          className="w-full bg-gradient-to-br from-blue-600 to-blue-500 text-white font-bold py-4 px-6 rounded-lg transition-all duration-300 ease-in-out shadow-lg shadow-blue-500/20 hover:shadow-xl hover:shadow-blue-500/40 hover:-translate-y-px active:scale-95 active:shadow-inner text-base disabled:from-blue-800 disabled:to-blue-700 disabled:shadow-none disabled:cursor-not-allowed disabled:transform-none"
          disabled={isLoading}
          title="Automatically convert the current image to a passport photo"
        >
          Create Passport Photo
        </button>
      </div>
    </div>
  );
};

export default PassportPhotoPanel;