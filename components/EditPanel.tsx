/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React from 'react';
import { RectangleIcon, LassoIcon, WandIcon, ClearSelectionIcon } from './icons';

export type SelectionTool = 'rectangle' | 'lasso' | 'magicWand';

interface EditPanelProps {
  prompt: string;
  setPrompt: (prompt: string) => void;
  onGenerate: () => void;
  isLoading: boolean;
  hasSelection: boolean;
  activeTool: SelectionTool;
  setActiveTool: (tool: SelectionTool) => void;
  onClearSelection: () => void;
  magicWandTolerance: number;
  setMagicWandTolerance: (tolerance: number) => void;
}

const EditPanel: React.FC<EditPanelProps> = ({
  prompt,
  setPrompt,
  onGenerate,
  isLoading,
  hasSelection,
  activeTool,
  setActiveTool,
  onClearSelection,
  magicWandTolerance,
  setMagicWandTolerance
}) => {
  const tools: { id: SelectionTool; label: string; Icon: React.FC<{ className?: string }> }[] = [
    { id: 'rectangle', label: 'Rectangle Select', Icon: RectangleIcon },
    { id: 'lasso', label: 'Lasso Select', Icon: LassoIcon },
    { id: 'magicWand', label: 'Magic Wand', Icon: WandIcon },
  ];

  return (
    <div className="w-full bg-gray-800/50 border border-gray-700 rounded-lg p-4 flex flex-col gap-4 animate-fade-in backdrop-blur-sm">
      <div className="grid grid-cols-4 items-center gap-2 bg-black/20 p-1 rounded-md">
        {tools.map(({ id, label, Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTool(id)}
            className={`flex flex-col items-center justify-center gap-1 w-full font-semibold py-2 px-3 rounded-md transition-all duration-200 text-xs ${
              activeTool === id
                ? 'bg-gray-600/80 text-white'
                : 'text-gray-400 hover:text-white hover:bg-white/10'
            }`}
            title={label}
          >
            <Icon className="w-6 h-6" />
            <span>{label.split(' ')[0]}</span>
          </button>
        ))}
        <button
          onClick={onClearSelection}
          disabled={!hasSelection || isLoading}
          className="flex flex-col items-center justify-center gap-1 w-full font-semibold py-2 px-3 rounded-md transition-all duration-200 text-xs text-gray-400 hover:text-white hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed"
          title="Clear Selection"
        >
          <ClearSelectionIcon className="w-6 h-6" />
          <span>Clear</span>
        </button>
      </div>

      {activeTool === 'magicWand' && (
        <div className="w-full bg-black/20 p-3 rounded-lg flex flex-col gap-2 animate-fade-in">
          <div className="flex items-center justify-between">
              <label htmlFor="magic-wand-tolerance" className="font-semibold text-gray-200">
                  Tolerance
              </label>
              <span className="text-sm font-mono bg-gray-700/50 px-2 py-1 rounded">
                  {magicWandTolerance}
              </span>
          </div>
          <input
              id="magic-wand-tolerance"
              type="range"
              min="1"
              max="200"
              step="1"
              value={magicWandTolerance}
              onChange={(e) => setMagicWandTolerance(Number(e.target.value))}
              disabled={isLoading}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
              title="Adjust color sensitivity for the Magic Wand"
          />
        </div>
      )}

      <div className="pt-2">
        <div className="flex flex-col items-center gap-4">
          <p className="text-md text-gray-400 text-center">
            {hasSelection ? 'Great! Now describe your edit for the selected area.' : 'Use a tool above to make a selection on the image.'}
          </p>
          <form onSubmit={(e) => { e.preventDefault(); onGenerate(); }} className="w-full flex items-center gap-2">
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder={hasSelection ? "e.g., 'remove this object'" : "First make a selection on the image"}
              className="flex-grow bg-gray-800 border border-gray-700 text-gray-200 rounded-lg p-5 text-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition w-full disabled:cursor-not-allowed disabled:opacity-60"
              disabled={isLoading || !hasSelection}
              title="Describe the edit you want to make in the selected area"
            />
            <button
              type="submit"
              className="bg-gradient-to-br from-blue-600 to-blue-500 text-white font-bold py-5 px-8 text-lg rounded-lg transition-all duration-300 ease-in-out shadow-lg shadow-blue-500/20 hover:shadow-xl hover:shadow-blue-500/40 hover:-translate-y-px active:scale-95 active:shadow-inner disabled:from-blue-800 disabled:to-blue-700 disabled:shadow-none disabled:cursor-not-allowed disabled:transform-none"
              disabled={isLoading || !prompt.trim() || !hasSelection}
              title="Apply the described edit to the selected area"
            >
              Generate
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditPanel;