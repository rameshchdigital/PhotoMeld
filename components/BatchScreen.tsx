/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState, useMemo } from 'react';
import JSZip from 'jszip';
import {
  generateFilteredImage,
  generateAdjustedImage,
  generateEnhancedImage,
  generateUpscaledImage,
  generateColorizedImage
} from '../services/geminiService';
// FIX: The ProcessingStatus type is exported from FullPhotoEditorPage.tsx, not App.tsx. Corrected the import path.
import type { ProcessingStatus } from './FullPhotoEditorPage';
import { PaletteIcon, SunIcon, SparkleIcon, UpscaleIcon, ColorizeIcon, CheckCircleIcon, XCircleIcon, DownloadIcon, LayersIcon, ClockIcon, SaveIcon } from './icons';
import Spinner from './Spinner';

// --- Re-usable Components for Batch Screen ---

const filterPresets = [
    { name: 'Synthwave', prompt: 'Transform the image with an 80s synthwave and retro-futuristic aesthetic. Introduce vibrant neon glows, especially magenta, cyan, and electric blue. Add a subtle grid pattern to the background and faint horizontal scan lines to complete the retro CRT monitor feel.' },
    { name: 'Anime', prompt: 'Convert the photo into a high-quality Japanese anime art style. This should include bold, clean outlines, simplified color palettes with cel-shading, vibrant and saturated colors, and expressive, stylized features, particularly for any people in the image.' },
    { name: 'Lomo', prompt: 'Emulate the iconic Lomography film camera look. Apply heavy color saturation, high contrast, strong vignetting (darkened corners), and unpredictable color shifts, often towards blues and greens, for a spontaneous, experimental, and lo-fi aesthetic.' },
    { name: 'Vintage Film', prompt: "Apply a classic vintage film aesthetic. This should include warm, slightly faded colors with a shift towards amber and magenta in the shadows. Reduce the overall contrast to mimic aged photographic paper, and add a subtle, fine-grained texture. The final image should feel nostalgic and timeless." },
    { name: 'Cyberpunk', prompt: "Immerse the image in a high-contrast, cyberpunk neon world. Dramatically increase the contrast, crushing the blacks and making highlights pop with electric blues, vibrant pinks, and glowing cyans. Add atmospheric effects like a subtle haze or digital rain, and ensure that light sources cast a strong, colorful neon glow on surrounding surfaces." },
    { name: 'Watercolor', prompt: "Transform the photo into a beautiful watercolor sketch. The lines should be soft and slightly blurred, blending into the colors. The colors themselves should be vibrant but translucent, with visible brushstroke textures and paper grain. The final result should look like it was hand-painted on textured watercolor paper." },
];

const adjustmentPresets = [
    { name: 'Enhance Quality', apiFn: generateEnhancedImage, Icon: SparkleIcon, style: 'from-purple-600 to-indigo-500 shadow-purple-500/20 hover:shadow-purple-500/40' },
    { name: 'Upscale Image', apiFn: generateUpscaledImage, Icon: UpscaleIcon, style: 'from-teal-600 to-cyan-500 shadow-cyan-500/20 hover:shadow-cyan-500/40' },
    { name: 'Colorize Photo', apiFn: generateColorizedImage, Icon: ColorizeIcon, style: 'from-amber-500 to-orange-500 shadow-orange-500/20 hover:shadow-orange-500/40' },
    { name: 'Golden Hour', apiFn: (file: File) => generateAdjustedImage(file, "Bathe the entire image in the soft, warm, diffused light of the 'golden hour'. Introduce rich golden, yellow, and orange hues into the highlights, and create long, soft shadows. The overall mood should be dreamy, serene, and deeply atmospheric."), Icon: SunIcon, style: 'from-yellow-500 to-amber-500 shadow-amber-500/20 hover:shadow-amber-500/40' },
    { name: 'Cinematic', apiFn: (file: File) => generateAdjustedImage(file, "Apply a professional cinematic color grade. Shift the shadows and darker midtones towards a cool teal or cyan color, while pushing the highlights and skin tones towards a warm orange or yellow to create a polished, high-impact, modern movie look."), Icon: SunIcon, style: 'from-sky-500 to-blue-500 shadow-blue-500/20 hover:shadow-blue-500/40' },
    { name: 'Dramatic Noir', apiFn: (file: File) => generateAdjustedImage(file, "Convert the image to a high-contrast black and white 'noir' style. Crush the blacks to be deep and inky, make the whites bright and clean, and expand the mid-tone contrast to create a dramatic, moody, and timeless photographic look. The final image must be monochrome."), Icon: SunIcon, style: 'from-gray-600 to-gray-800 shadow-gray-800/20 hover:shadow-gray-800/40' },
];

// --- Main Batch Screen Component ---

interface BatchScreenProps {
  imageFiles: File[];
  imageUrls: string[];
  processingStatus: { [key: string]: ProcessingStatus };
  processedImageUrls: { [key: string]: string };
  onApplyBatchEdit: (editFn: (file: File) => Promise<string>) => void;
  isLoading: boolean;
  onSaveSession: () => void;
}

const BatchScreen: React.FC<BatchScreenProps> = ({
  imageFiles,
  imageUrls,
  processingStatus,
  processedImageUrls,
  onApplyBatchEdit,
  isLoading,
  onSaveSession,
}) => {
  const [activeTab, setActiveTab] = useState<'filters' | 'adjustments'>('filters');
  const [selectedOperation, setSelectedOperation] = useState<{ fn: (file: File) => Promise<string>; name: string } | null>(null);

  const handleSelectFilter = (prompt: string, name: string) => {
    setSelectedOperation({ fn: (file: File) => generateFilteredImage(file, prompt), name });
  };
  
  const handleSelectAdjustment = (apiFn: (file: File) => Promise<string>, name: string) => {
    setSelectedOperation({ fn: apiFn, name });
  };

  const handleApply = () => {
    if (selectedOperation) {
      onApplyBatchEdit(selectedOperation.fn);
    }
  };

  const handleDownloadZip = async () => {
    const zip = new JSZip();
    for (const file of imageFiles) {
        const url = processedImageUrls[file.name];
        if (url && processingStatus[file.name] === 'done') {
            const response = await fetch(url);
            const blob = await response.blob();
            const nameParts = file.name.split('.');
            const extension = nameParts.pop() || 'png';
            const baseName = nameParts.join('.');
            zip.file(`${baseName}-edited.${extension}`, blob);
        }
    }

    zip.generateAsync({ type: 'blob' }).then(content => {
        const link = document.createElement('a');
        link.href = URL.createObjectURL(content);
        link.download = 'PhotoMeld_Batch_Edit.zip';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(link.href);
    });
  };

  const { doneCount, totalCount } = useMemo(() => {
    const done = Object.values(processingStatus).filter(s => s === 'done' || s === 'error').length;
    return { doneCount: done, totalCount: imageFiles.length };
  }, [processingStatus, imageFiles.length]);

  const allDone = doneCount === totalCount;

  return (
    <main className="flex-1 flex overflow-hidden">
      {/* Control Panel */}
      <aside className="w-96 flex-shrink-0 bg-gray-900/60 backdrop-blur-sm border-r border-gray-700/50 p-6 flex flex-col gap-6 overflow-y-auto">
        <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-100 flex items-center justify-center gap-3"><LayersIcon className="w-7 h-7" /> Batch Editor</h2>
            <p className="text-gray-400">{totalCount} images loaded</p>
        </div>

        <div className="flex items-center justify-center gap-2 bg-black/20 p-1 rounded-md">
            <button onClick={() => setActiveTab('filters')} className={`flex items-center justify-center gap-2 w-full font-semibold py-2 px-4 rounded-md transition-all duration-200 text-sm ${activeTab === 'filters' ? 'bg-gray-600/80 text-white' : 'text-gray-400 hover:text-white hover:bg-white/10'}`}><PaletteIcon className="w-5 h-5" /> Filters</button>
            <button onClick={() => setActiveTab('adjustments')} className={`flex items-center justify-center gap-2 w-full font-semibold py-2 px-4 rounded-md transition-all duration-200 text-sm ${activeTab === 'adjustments' ? 'bg-gray-600/80 text-white' : 'text-gray-400 hover:text-white hover:bg-white/10'}`}><SunIcon className="w-5 h-5" /> Adjustments</button>
        </div>

        {/* Operation Selection */}
        <div className="flex-grow">
          {activeTab === 'filters' && (
            <div className="grid grid-cols-2 gap-3">
              {filterPresets.map(p => (
                <button key={p.name} onClick={() => handleSelectFilter(p.prompt, p.name)} disabled={isLoading} className={`p-4 rounded-lg text-center font-semibold transition-all ${selectedOperation?.name === p.name ? 'bg-blue-600 text-white ring-2 ring-blue-400' : 'bg-white/10 hover:bg-white/20'}`}>{p.name}</button>
              ))}
            </div>
          )}
          {activeTab === 'adjustments' && (
            <div className="flex flex-col gap-3">
              {adjustmentPresets.map(p => (
                <button key={p.name} onClick={() => handleSelectAdjustment(p.apiFn, p.name)} disabled={isLoading} className={`flex items-center justify-center gap-3 p-4 rounded-lg text-center font-bold transition-all ${selectedOperation?.name === p.name ? 'ring-2 ring-blue-400' : ''} bg-gradient-to-br ${p.style} text-white`}>
                    <p.Icon className="w-5 h-5"/> {p.name}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Action Panel */}
        <div className="flex flex-col gap-4">
            <div className="text-center bg-black/20 p-3 rounded-lg">
                <p className="font-semibold text-gray-200">Selected Operation:</p>
                <p className="text-blue-300">{selectedOperation?.name || 'None'}</p>
            </div>
            
            <button onClick={handleApply} disabled={!selectedOperation || isLoading} className="w-full bg-gradient-to-br from-blue-600 to-blue-500 text-white font-bold py-4 px-6 rounded-lg transition-all duration-300 ease-in-out shadow-lg shadow-blue-500/20 hover:shadow-xl hover:shadow-blue-500/40 hover:-translate-y-px active:scale-95 active:shadow-inner text-base disabled:from-blue-800 disabled:to-blue-700 disabled:shadow-none disabled:cursor-not-allowed disabled:transform-none">
                {isLoading ? 'Processing...' : 'Apply to All'}
            </button>

            <button onClick={onSaveSession} disabled={isLoading} className="w-full flex items-center justify-center gap-3 bg-gradient-to-br from-gray-600 to-gray-700 text-white font-bold py-3 px-5 rounded-lg transition-all duration-300 ease-in-out shadow-lg shadow-gray-700/20 hover:shadow-xl hover:shadow-gray-700/40 hover:-translate-y-px active:scale-95 active:shadow-inner text-base disabled:opacity-50">
                <SaveIcon className="w-5 h-5"/> Save Session
            </button>

            {isLoading && (
                <div className="w-full bg-gray-700 rounded-full h-2.5">
                    <div className="bg-blue-500 h-2.5 rounded-full" style={{ width: `${(doneCount / totalCount) * 100}%` }}></div>
                </div>
            )}
            <p className="text-center text-sm text-gray-400">{doneCount} / {totalCount} images processed.</p>

            <button onClick={handleDownloadZip} disabled={!allDone || isLoading || doneCount === 0} className="w-full flex items-center justify-center gap-3 bg-gradient-to-br from-green-600 to-green-500 text-white font-bold py-4 px-6 rounded-lg transition-all duration-300 ease-in-out shadow-lg shadow-green-500/20 hover:shadow-xl hover:shadow-green-500/40 hover:-translate-y-px active:scale-95 active:shadow-inner text-base disabled:from-green-800 disabled:to-green-700 disabled:shadow-none disabled:cursor-not-allowed disabled:transform-none">
                <DownloadIcon className="w-6 h-6"/> Download All as ZIP
            </button>
        </aside>

      {/* Image Grid */}
      <div className="flex-1 p-8 overflow-y-auto">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {imageFiles.map((file, index) => {
                const status = processingStatus[file.name];
                const processedUrl = processedImageUrls[file.name];
                const originalUrl = imageUrls[index];

                return (
                    <div key={file.name} className="relative aspect-square bg-black/20 rounded-lg overflow-hidden border-2 border-gray-700/50 animate-fade-in flex flex-col">
                        <img src={processedUrl || originalUrl} alt={file.name} className="w-full h-full object-cover" />
                        
                        {/* Status Overlay */}
                        <div className="absolute inset-0 flex items-center justify-center">
                            {status === 'pending' && (
                                <div className="absolute top-2 right-2 bg-gray-600/70 rounded-full p-1.5 backdrop-blur-sm" title="Pending">
                                    <ClockIcon className="w-6 h-6 text-gray-200" />
                                </div>
                            )}
                            {status === 'processing' && (
                                <div className="absolute inset-0 bg-black/70 backdrop-blur-sm flex flex-col items-center justify-center gap-2">
                                    <Spinner />
                                    <p className="text-sm font-semibold text-gray-300">Processing...</p>
                                </div>
                            )}
                            {status === 'done' && (
                                <div className="absolute top-2 right-2 bg-green-500/80 rounded-full p-1.5 backdrop-blur-sm" title="Done">
                                    <CheckCircleIcon className="w-6 h-6 text-white" />
                                </div>
                            )}
                             {status === 'error' && (
                                <div className="absolute inset-0 bg-red-900/70 backdrop-blur-sm flex flex-col items-center justify-center gap-2 text-center p-2" title="Error">
                                    <XCircleIcon className="w-8 h-8 text-red-300" />
                                    <p className="text-sm font-semibold text-red-200">Processing Failed</p>
                                </div>
                            )}
                        </div>

                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2">
                            <p className="text-white text-xs font-medium truncate">{file.name}</p>
                        </div>
                    </div>
                );
            })}
        </div>
      </div>
    </main>
  );
};

export default BatchScreen;