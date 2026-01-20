/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React from 'react';
import { EraseIcon } from './icons';

interface RemovePanelProps {
  onRemoveObject: () => void;
  isLoading: boolean;
  hasHotspot: boolean;
}

const RemovePanel: React.FC<RemovePanelProps> = ({ onRemoveObject, isLoading, hasHotspot }) => {

  return (
    <div className="w-full bg-gray-800/50 border border-gray-700 rounded-lg p-4 flex flex-col items-center gap-4 animate-fade-in backdrop-blur-sm">
        <h3 className="text-lg font-semibold text-center text-gray-300 flex items-center justify-center gap-2">
            <EraseIcon className="w-6 h-6" />
            Magic Remove
        </h3>
        <p className="text-md text-gray-400 text-center">
            {hasHotspot ? 'Object selected! Click the button below to remove it.' : 'Click any object on the image to select it.'}
        </p>

        <div className="pt-2 w-full max-w-sm">
            <button
                onClick={onRemoveObject}
                className="w-full bg-gradient-to-br from-blue-600 to-blue-500 text-white font-bold py-4 px-6 rounded-lg transition-all duration-300 ease-in-out shadow-lg shadow-blue-500/20 hover:shadow-xl hover:shadow-blue-500/40 hover:-translate-y-px active:scale-95 active:shadow-inner text-base disabled:from-blue-800 disabled:to-blue-700 disabled:shadow-none disabled:cursor-not-allowed disabled:transform-none"
                disabled={isLoading || !hasHotspot}
                title="Remove the selected object and intelligently fill the background"
            >
                Remove Object
            </button>
        </div>
    </div>
  );
};

export default RemovePanel;
