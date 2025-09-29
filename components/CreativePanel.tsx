/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState } from 'react';
import FilterPanel from './FilterPanel';
import RestylePanel from './RestylePanel';
import BackgroundPanel from './BackgroundPanel';
import GradientPanel from './GradientPanel';
import ImageGeneratorPanel from './ImageUploader'; // Using ImageUploader.tsx for the new panel
import LogoGeneratorPanel from './LogoGeneratorPanel';
// FIX: Import missing icons RestyleIcon, TextureIcon, and GradientIcon.
import { PaletteIcon, RestyleIcon, BackgroundIcon, TextureIcon, GradientIcon, SparkleIcon, LogoIcon } from './icons';

// --- TexturePanel Component Definition ---
interface TexturePanelProps {
  onApplyFilter: (prompt: string) => void;
  isLoading: boolean;
}

const TexturePanel: React.FC<TexturePanelProps> = ({ onApplyFilter, isLoading }) => {
  const [customPrompt, setCustomPrompt] = useState('');
  const [opacity, setOpacity] = useState<number>(50);

  const textures = [
    { name: 'Paper', description: 'a subtle, fibrous watercolor paper texture' },
    { name: 'Canvas', description: 'a classic woven artist canvas texture' },
    { name: 'Film Grain', description: 'a fine, realistic 35mm film grain' },
    { name: 'Dust & Scratches', description: 'a vintage effect with subtle dust specks and linear scratches' },
    { name: 'Cracked Paint', description: 'an aged, cracked paint texture, like an old mural' },
    { name: 'Leather', description: 'a high-quality, detailed leather grain texture' },
  ];
  
  const handleApply = (textureDescription: string) => {
    if (!textureDescription.trim()) return;
    const prompt = `Apply a photorealistic '${textureDescription.trim()}' texture overlay to the entire image. The texture should be blended with an opacity of approximately ${opacity}%, ensuring the original image details remain clearly visible beneath the texture. The final result should be artistic and seamlessly integrated.`;
    onApplyFilter(prompt);
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleApply(customPrompt);
  };

  return (
    <div className="w-full bg-gray-800/50 border border-gray-700 rounded-lg p-4 flex flex-col gap-4 animate-fade-in backdrop-blur-sm">
      <h3 className="text-lg font-semibold text-center text-gray-300 flex items-center justify-center gap-2">
        <TextureIcon className="w-6 h-6" />
        Texture Overlays
      </h3>
      <p className="text-sm text-center text-gray-400 -mt-2">Add a creative layer to your image.</p>
      
      <div className="bg-black/20 p-4 rounded-lg flex flex-col gap-3 mt-2">
          <div className="flex items-center justify-between">
              <label htmlFor="opacity-slider" className="font-semibold text-gray-200">
                  Texture Opacity
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
              title="Adjust the transparency of the texture overlay"
          />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {textures.map(({ name, description }) => (
          <button
            key={name}
            onClick={() => handleApply(description)}
            disabled={isLoading}
            className="w-full text-center bg-white/10 border border-transparent text-gray-200 font-semibold py-4 px-4 rounded-lg transition-all duration-200 ease-in-out hover:bg-white/20 active:scale-95 text-base disabled:opacity-50 disabled:cursor-not-allowed"
            title={`Apply the '${name}' texture`}
          >
            {name}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-2 my-1">
        <div className="flex-grow h-px bg-gray-600/50"></div>
        <span className="text-sm text-gray-500">OR</span>
        <div className="flex-grow h-px bg-gray-600/50"></div>
      </div>
      
      <form onSubmit={handleCustomSubmit} className="w-full flex items-center gap-2">
        <input
          type="text"
          value={customPrompt}
          onChange={(e) => setCustomPrompt(e.target.value)}
          placeholder="Or describe a custom texture..."
          className="flex-grow bg-gray-800 border border-gray-600 text-gray-200 rounded-lg p-4 focus:ring-2 focus:ring-blue-500 focus:outline-none transition w-full disabled:cursor-not-allowed disabled:opacity-60 text-base"
          disabled={isLoading}
          title="Describe a unique texture to apply"
        />
        <button 
          type="submit"
          className="bg-gradient-to-br from-blue-600 to-blue-500 text-white font-bold py-4 px-6 rounded-lg transition-all duration-300 ease-in-out shadow-lg shadow-blue-500/20 hover:shadow-xl hover:shadow-blue-500/40 hover:-translate-y-px active:scale-95 active:shadow-inner text-base disabled:from-blue-800 disabled:to-blue-700 disabled:shadow-none disabled:cursor-not-allowed disabled:transform-none"
          disabled={isLoading || !customPrompt.trim()}
          title="Apply your custom texture"
        >
          Apply
        </button>
      </form>
    </div>
  );
};
// --- End: TexturePanel Component Definition ---


interface CreativePanelProps {
  onApplyFilter: (prompt: string) => void;
  onApplyRestyle: (prompt: string) => void;
  onReplaceBackground: (options: { image?: File; prompt?: string }) => void;
  onRemoveBackground: () => void;
  onGenerateImage: (prompt: string, aspectRatio: '1:1' | '16:9' | '9:16' | '4:3' | '3:4') => void;
  onGenerateLogo: (companyName: string, slogan: string, style: string) => void;
  onLogoSelect: (dataUrl: string) => void;
  isLoading: boolean;
  generatedLogos: string[];
}

type SubTab = 'filters' | 'textures' | 'gradients' | 'restyle' | 'background' | 'generate' | 'logo';

const CreativePanel: React.FC<CreativePanelProps> = (props) => {
  const [subTab, setSubTab] = useState<SubTab>('filters');

  const tabs: { id: SubTab; label: string; Icon: React.FC<{ className?: string }>, title: string }[] = [
    { id: 'filters', label: 'Filters', Icon: PaletteIcon, title: 'Apply one-click artistic filters' },
    { id: 'textures', label: 'Textures', Icon: TextureIcon, title: 'Overlay creative textures like paper or film grain' },
    { id: 'gradients', label: 'Gradients', Icon: GradientIcon, title: 'Apply a colored gradient overlay' },
    { id: 'restyle', label: 'Scene Restyle', Icon: RestyleIcon, title: 'Reimagine the entire scene while keeping the main subject' },
    { id: 'background', label: 'Background', Icon: BackgroundIcon, title: 'Replace or remove the image background' },
    { id: 'generate', label: 'AI Generator', Icon: SparkleIcon, title: 'Create a new image from a text prompt' },
    { id: 'logo', label: 'AI Logo', Icon: LogoIcon, title: 'Generate a unique logo for your brand' },
  ];

  return (
    <div className="w-full bg-gray-800/50 border border-gray-700 rounded-lg p-4 flex flex-col gap-4 animate-fade-in backdrop-blur-sm">
      <div className="grid grid-cols-7 items-center justify-center gap-1 bg-black/20 p-1 rounded-md">
        {tabs.map(({ id, label, Icon, title }) => (
          <button
            key={id}
            onClick={() => setSubTab(id)}
            className={`flex flex-col items-center justify-center gap-1 w-full font-semibold py-2 px-1 rounded-md transition-all duration-200 text-xs ${
              subTab === id
                ? 'bg-gray-600/80 text-white'
                : 'text-gray-400 hover:text-white hover:bg-white/10'
            }`}
            title={title}
          >
            <Icon className="w-5 h-5" />
            <span>{label}</span>
          </button>
        ))}
      </div>

      <div className="pt-2">
        {subTab === 'filters' && <FilterPanel onApplyFilter={props.onApplyFilter} isLoading={props.isLoading} />}
        {subTab === 'textures' && <TexturePanel onApplyFilter={props.onApplyFilter} isLoading={props.isLoading} />}
        {subTab === 'gradients' && <GradientPanel onApplyFilter={props.onApplyFilter} isLoading={props.isLoading} />}
        {subTab === 'restyle' && <RestylePanel onApplyRestyle={props.onApplyRestyle} isLoading={props.isLoading} />}
        {subTab === 'background' && <BackgroundPanel onReplaceBackground={props.onReplaceBackground} onRemoveBackground={props.onRemoveBackground} isLoading={props.isLoading} />}
        {subTab === 'generate' && <ImageGeneratorPanel onGenerate={props.onGenerateImage} isLoading={props.isLoading} />}
        {subTab === 'logo' && <LogoGeneratorPanel 
            onGenerate={props.onGenerateLogo}
            onLogoSelect={props.onLogoSelect}
            isLoading={props.isLoading}
            generatedLogos={props.generatedLogos}
        />}
      </div>
    </div>
  );
};

export default CreativePanel;