/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState } from 'react';
import { PaletteIcon } from './icons';

interface GradientPanelProps {
  onApplyFilter: (prompt: string) => void;
  isLoading: boolean;
}

type GradientDirection = 'to bottom' | 'to right' | 'radial';

const GradientPanel: React.FC<GradientPanelProps> = ({ onApplyFilter, isLoading }) => {
  const [color1, setColor1] = useState<string>('#4f46e5');
  const [color2, setColor2] = useState<string>('#ec4899');
  const [opacity, setOpacity] = useState<number>(50);
  const [direction, setDirection] = useState<GradientDirection>('to bottom');

  const handleApply = () => {
    let directionDescription = '';
    switch (direction) {
        case 'to right':
            directionDescription = `a linear gradient from left (${color1}) to right (${color2})`;
            break;
        case 'radial':
            directionDescription = `a radial gradient starting with ${color1} at the center and fading to ${color2} at the edges`;
            break;
        case 'to bottom':
        default:
            directionDescription = `a linear gradient from top (${color1}) to bottom (${color2})`;
            break;
    }

    const prompt = `Apply ${directionDescription}. This gradient should act as a color overlay blended over the entire image with an opacity of approximately ${opacity}%. The original image details must remain visible. The effect should be smooth, atmospheric, and well-integrated.`;
    onApplyFilter(prompt);
  };

  const directionOptions: { id: GradientDirection; label: string }[] = [
    { id: 'to bottom', label: 'Top to Bottom' },
    { id: 'to right', label: 'Left to Right' },
    { id: 'radial', label: 'Radial' },
  ];

  return (
    <div className="w-full bg-gray-800/50 border border-gray-700 rounded-lg p-4 flex flex-col gap-4 animate-fade-in backdrop-blur-sm">
      <h3 className="text-lg font-semibold text-center text-gray-300 flex items-center justify-center gap-2">
        <PaletteIcon className="w-6 h-6" />
        Gradient Overlay
      </h3>
      <p className="text-sm text-center text-gray-400 -mt-2">Add a stylish, colorful overlay to your image.</p>
      
      {/* Color Pickers */}
      <div className="grid grid-cols-2 gap-4 bg-black/20 p-4 rounded-lg">
        <div className="flex flex-col items-center gap-2">
            <label htmlFor="color1" className="font-semibold text-gray-300">Color 1</label>
            <div className="relative w-20 h-20 rounded-full border-4 border-gray-600 overflow-hidden">
                <input
                    type="color"
                    id="color1"
                    value={color1}
                    onChange={(e) => setColor1(e.target.value)}
                    disabled={isLoading}
                    className="absolute inset-0 w-full h-full cursor-pointer border-none p-0"
                    title="Select the first color of the gradient"
                />
            </div>
            <span className="font-mono text-sm text-gray-400">{color1}</span>
        </div>
        <div className="flex flex-col items-center gap-2">
            <label htmlFor="color2" className="font-semibold text-gray-300">Color 2</label>
            <div className="relative w-20 h-20 rounded-full border-4 border-gray-600 overflow-hidden">
                <input
                    type="color"
                    id="color2"
                    value={color2}
                    onChange={(e) => setColor2(e.target.value)}
                    disabled={isLoading}
                    className="absolute inset-0 w-full h-full cursor-pointer border-none p-0"
                    title="Select the second color of the gradient"
                />
            </div>
            <span className="font-mono text-sm text-gray-400">{color2}</span>
        </div>
      </div>

      {/* Direction Buttons */}
      <div className="flex flex-col gap-2">
        <label className="font-semibold text-gray-300">Direction</label>
        <div className="grid grid-cols-3 gap-2">
          {directionOptions.map(({ id, label }) => (
            <button
              key={id}
              onClick={() => setDirection(id)}
              disabled={isLoading}
              className={`w-full text-center bg-white/10 border-2 border-transparent text-gray-200 font-semibold py-3 px-2 rounded-lg transition-all duration-200 ease-in-out hover:bg-white/20 active:scale-95 text-sm disabled:opacity-50 disabled:cursor-not-allowed ${direction === id ? 'ring-2 ring-offset-2 ring-offset-gray-800 ring-blue-500 border-blue-500' : ''}`}
              title={`Set gradient direction to ${label}`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Opacity Slider */}
      <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
              <label htmlFor="opacity-slider" className="font-semibold text-gray-300">
                  Opacity
              </label>
              <span className="text-sm font-mono bg-gray-700/50 px-2 py-1 rounded">
                  {opacity}%
              </span>
          </div>
          <input
              id="opacity-slider"
              type="range"
              min="10"
              max="100"
              step="5"
              value={opacity}
              onChange={(e) => setOpacity(Number(e.target.value))}
              disabled={isLoading}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
              title="Adjust the transparency of the gradient overlay"
          />
      </div>

      {/* Apply Button */}
      <div className="pt-2">
        <button
          onClick={handleApply}
          className="w-full bg-gradient-to-br from-blue-600 to-blue-500 text-white font-bold py-4 px-6 rounded-lg transition-all duration-300 ease-in-out shadow-lg shadow-blue-500/20 hover:shadow-xl hover:shadow-blue-500/40 hover:-translate-y-px active:scale-95 active:shadow-inner text-base disabled:from-blue-800 disabled:to-blue-700 disabled:shadow-none disabled:cursor-not-allowed disabled:transform-none"
          disabled={isLoading}
          title="Apply the configured gradient to the image"
        >
          Apply Gradient
        </button>
      </div>
    </div>
  );
};

export default GradientPanel;