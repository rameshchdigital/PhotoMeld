/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState } from 'react';
// FIX: Import missing PoseIcon.
import { PoseIcon } from './icons';

interface PosePanelProps {
  onApplyPose: (prompt: string) => void;
  isLoading: boolean;
}

const PosePanel: React.FC<PosePanelProps> = ({ onApplyPose, isLoading }) => {
  const [prompt, setPrompt] = useState('');

  const handleApply = () => {
    if (prompt.trim()) {
      onApplyPose(prompt);
    }
  };

  return (
    <div className="w-full bg-gray-800/50 border border-gray-700 rounded-lg p-4 flex flex-col items-center gap-4 animate-fade-in backdrop-blur-sm">
        <h3 className="text-lg font-semibold text-center text-gray-300 flex items-center justify-center gap-2">
            <PoseIcon className="w-6 h-6" />
            AI Pose Editor
        </h3>
        <p className="text-md text-gray-400 text-center">
            Describe how you want to change the pose of the person in the image.
        </p>

        <form onSubmit={(e) => { e.preventDefault(); handleApply(); }} className="w-full flex flex-col items-center gap-4 pt-2">
            <input
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="e.g., 'make the person wave their right hand'"
                className="flex-grow bg-gray-800 border border-gray-700 text-gray-200 rounded-lg p-5 text-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition w-full disabled:cursor-not-allowed disabled:opacity-60"
                disabled={isLoading}
                title="Describe the desired pose change (e.g., 'make them raise their left arm')"
            />
            <button
                type="submit"
                className="w-full max-w-sm bg-gradient-to-br from-blue-600 to-blue-500 text-white font-bold py-4 px-6 rounded-lg transition-all duration-300 ease-in-out shadow-lg shadow-blue-500/20 hover:shadow-xl hover:shadow-blue-500/40 hover:-translate-y-px active:scale-95 active:shadow-inner text-base disabled:from-blue-800 disabled:to-blue-700 disabled:shadow-none disabled:cursor-not-allowed disabled:transform-none"
                disabled={isLoading || !prompt.trim()}
                title="Apply the described pose change to the subject"
            >
                Apply Pose
            </button>
        </form>
    </div>
  );
};

export default PosePanel;