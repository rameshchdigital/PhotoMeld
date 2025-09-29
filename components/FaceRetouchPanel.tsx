/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React from 'react';
// FIX: Import missing icons FaceSmileIcon and EyeSparklesIcon.
import { FaceIcon, FaceSmileIcon, EyeSparklesIcon } from './icons';

interface FaceRetouchPanelProps {
  onApplyFaceRetouch: (prompt: string) => void;
  isLoading: boolean;
}

const FaceRetouchPanel: React.FC<FaceRetouchPanelProps> = ({ onApplyFaceRetouch, isLoading }) => {
  const presets = [
    { 
      name: 'Smooth Skin', 
      prompt: "Perform a high-end skin retouch. Subtly even out skin tone and reduce the appearance of minor blemishes, pores, and fine lines. Crucially, the natural skin texture must be preserved to avoid an artificial, 'plastic' look. The result should look like healthy, natural skin.",
      Icon: FaceIcon,
    },
    { 
      name: 'Whiten Teeth', 
      prompt: "Perform a natural teeth whitening enhancement. Gently reduce yellow staining and increase the brightness of the teeth to a realistic, healthy white. Avoid over-whitening that looks artificial or distracting. The goal is a believable, confident smile.",
      Icon: FaceSmileIcon,
    },
    { 
      name: 'Enhance Eyes', 
      prompt: "Subtly make the eyes more captivating. Gently brighten the irises to reveal their color and detail, add a slight 'sparkle' by enhancing the catchlights, and slightly brighten the sclera (the whites of the eyes) for a clearer, more vibrant look. The enhancement should be entirely natural.",
      Icon: EyeSparklesIcon,
    },
  ];

  return (
    <div className="w-full bg-gray-800/50 border border-gray-700 rounded-lg p-4 flex flex-col gap-4 animate-fade-in backdrop-blur-sm">
      <h3 className="text-lg font-semibold text-center text-gray-300">Natural Portrait Retouching</h3>
      <p className="text-sm text-center text-gray-400 -mt-2">Apply one-click enhancements for a professional look.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
        {presets.map(({ name, prompt, Icon }) => (
          <button
            key={name}
            onClick={() => onApplyFaceRetouch(prompt)}
            disabled={isLoading}
            className="flex flex-col items-center justify-center gap-3 text-center bg-white/10 border border-transparent text-gray-200 font-semibold py-6 px-4 rounded-lg transition-all duration-200 ease-in-out hover:bg-white/20 hover:border-white/20 active:scale-95 text-base disabled:opacity-50 disabled:cursor-not-allowed"
            title={`Apply the '${name}' retouch`}
          >
            <Icon className="w-8 h-8 text-blue-300" />
            <span>{name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default FaceRetouchPanel;