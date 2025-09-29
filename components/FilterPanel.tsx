/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState } from 'react';
import { SynthwaveIcon, AnimeIcon, LomoIcon, GlitchIcon, VintageFilmIcon, CyberpunkIcon, WatercolorIcon, DramaticLightIcon, GhibliIcon } from './icons';

interface FilterPanelProps {
  onApplyFilter: (prompt: string) => void;
  isLoading: boolean;
}

const FilterPanel: React.FC<FilterPanelProps> = ({ onApplyFilter, isLoading }) => {
  const [customPrompt, setCustomPrompt] = useState('');

  const presets = [
    { name: 'Ghibli Style', prompt: "Transform the photo into the iconic, nostalgic art style of a Studio Ghibli film. The result should feature lush, painterly backgrounds with soft, detailed clouds and vibrant foliage. Apply a warm, gentle lighting that evokes a sense of wonder. Characters and foreground elements should have clean outlines but soft, painterly coloring, reminiscent of Hayao Miyazaki's animation style.", Icon: GhibliIcon },
    { name: 'Synthwave', prompt: 'Transform the image with an 80s synthwave and retro-futuristic aesthetic. Introduce vibrant neon glows, especially magenta, cyan, and electric blue. Add a subtle grid pattern to the background and faint horizontal scan lines to complete the retro CRT monitor feel.', Icon: SynthwaveIcon },
    { name: 'Anime', prompt: 'Convert the photo into a high-quality Japanese anime art style. This should include bold, clean outlines, simplified color palettes with cel-shading, vibrant and saturated colors, and expressive, stylized features, particularly for any people in the image.', Icon: AnimeIcon },
    { name: 'Lomo', prompt: 'Emulate the iconic Lomography film camera look. Apply heavy color saturation, high contrast, strong vignetting (darkened corners), and unpredictable color shifts, often towards blues and greens, for a spontaneous, experimental, and lo-fi aesthetic.', Icon: LomoIcon },
    { name: 'Glitch', prompt: 'Deconstruct the image with a digital glitch art style. Introduce elements like pixel sorting, datamoshing artifacts, RGB channel splitting (chromatic aberration), and geometric distortions to create a futuristic, chaotic, and tech-dystopian vibe.', Icon: GlitchIcon },
    { name: 'Vintage Film', prompt: "Apply a classic vintage film aesthetic. This should include warm, slightly faded colors with a shift towards amber and magenta in the shadows. Reduce the overall contrast to mimic aged photographic paper, and add a subtle, fine-grained texture. The final image should feel nostalgic and timeless.", Icon: VintageFilmIcon },
    { name: 'Cyberpunk', prompt: "Immerse the image in a high-contrast, cyberpunk neon world. Dramatically increase the contrast, crushing the blacks and making highlights pop with electric blues, vibrant pinks, and glowing cyans. Add atmospheric effects like a subtle haze or digital rain, and ensure that light sources cast a strong, colorful neon glow on surrounding surfaces.", Icon: CyberpunkIcon },
    { name: 'Watercolor', prompt: "Transform the photo into a beautiful watercolor sketch. The lines should be soft and slightly blurred, blending into the colors. The colors themselves should be vibrant but translucent, with visible brushstroke textures and paper grain. The final result should look like it was hand-painted on textured watercolor paper.", Icon: WatercolorIcon },
    { name: 'Dramatic', prompt: "Dramatically enhance the lighting to create a moody, cinematic feel. Deepen the shadows and add a strong, directional light source (like a single spotlight or light coming through a window) that sculpts the subject and creates high contrast. The result should be atmospheric and visually striking, like a scene from a noir film.", Icon: DramaticLightIcon },
  ];
  
  const handleApplyCustom = () => {
    if (customPrompt.trim()) {
      onApplyFilter(customPrompt);
    }
  };

  return (
    <div className="w-full bg-gray-800/50 border border-gray-700 rounded-lg p-4 flex flex-col gap-4 animate-fade-in backdrop-blur-sm">
      <h3 className="text-lg font-semibold text-center text-gray-300">Apply a Creative Filter</h3>
      <p className="text-sm text-center text-gray-400 -mt-2">Apply a one-click artistic style to your image.</p>
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 pt-2">
        {presets.map(({ name, prompt, Icon }) => (
          <button
            key={name}
            onClick={() => onApplyFilter(prompt)}
            disabled={isLoading}
            className="flex flex-col items-center justify-center gap-3 text-center bg-white/10 border border-transparent text-gray-200 font-semibold py-6 px-4 rounded-lg transition-all duration-200 ease-in-out hover:bg-white/20 hover:border-white/20 active:scale-95 text-base disabled:opacity-50 disabled:cursor-not-allowed"
            title={`Apply the '${name}' filter`}
          >
            <Icon className="w-8 h-8 text-blue-300" />
            <span>{name}</span>
          </button>
        ))}
      </div>

      <div className="flex items-center gap-2 my-1">
        <div className="flex-grow h-px bg-gray-600/50"></div>
        <span className="text-sm text-gray-500">OR</span>
        <div className="flex-grow h-px bg-gray-600/50"></div>
      </div>
      
      <form onSubmit={(e) => { e.preventDefault(); handleApplyCustom(); }} className="w-full flex items-center gap-2">
        <input
          type="text"
          value={customPrompt}
          onChange={(e) => setCustomPrompt(e.target.value)}
          placeholder="Or describe a custom filter..."
          className="flex-grow bg-gray-800 border border-gray-600 text-gray-200 rounded-lg p-4 focus:ring-2 focus:ring-blue-500 focus:outline-none transition w-full disabled:cursor-not-allowed disabled:opacity-60 text-base"
          disabled={isLoading}
          title="Describe a unique filter style"
        />
        <button 
          type="submit"
          className="bg-gradient-to-br from-blue-600 to-blue-500 text-white font-bold py-4 px-6 rounded-lg transition-all duration-300 ease-in-out shadow-lg shadow-blue-500/20 hover:shadow-xl hover:shadow-blue-500/40 hover:-translate-y-px active:scale-95 active:shadow-inner text-base disabled:from-blue-800 disabled:to-blue-700 disabled:shadow-none disabled:cursor-not-allowed disabled:transform-none"
          disabled={isLoading || !customPrompt.trim()}
          title="Apply your custom filter"
        >
          Apply
        </button>
      </form>
    </div>
  );
};

export default FilterPanel;