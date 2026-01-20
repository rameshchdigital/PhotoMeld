/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState, useEffect } from 'react';
import { generateImageFromText } from '../services/geminiService';
import { SparkleIcon, DownloadIcon, UploadIcon, XCircleIcon } from './icons';
import Spinner from './Spinner';
import { Page } from '../App';
import { ToolCategory } from '../services/toolData';
import RelatedTools from './RelatedTools';

interface ImageGeneratorFromTextPageProps {
    onNavigate: (page: Page) => void;
    currentPage: Page;
    allTools: ToolCategory[];
}

type AspectRatio = '1:1' | '16:9' | '9:16' | '4:3' | '3:4';

const ImageGeneratorFromTextPage: React.FC<ImageGeneratorFromTextPageProps> = ({ onNavigate, currentPage, allTools }) => {
    const [prompt, setPrompt] = useState('');
    const [aspectRatio, setAspectRatio] = useState<AspectRatio>('1:1');
    const [inputImage, setInputImage] = useState<File | null>(null);
    const [inputImagePreview, setInputImagePreview] = useState<string | null>(null);
    const [resultUrl, setResultUrl] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const currentCategory = allTools.find(cat => cat.tools.some(tool => tool.page === currentPage));
    
    useEffect(() => {
        return () => {
            if (inputImagePreview) {
                URL.revokeObjectURL(inputImagePreview);
            }
        };
    }, [inputImagePreview]);

    const aspectRatios: { id: AspectRatio; label: string }[] = [
        { id: '1:1', label: 'Square' },
        { id: '16:9', label: 'Widescreen' },
        { id: '9:16', label: 'Portrait' },
        { id: '4:3', label: 'Landscape' },
        { id: '3:4', label: 'Tall' },
    ];
  
    const stylePresets = [
        'Photorealistic', 'Digital art', 'Cinematic', '3D render', 'Anime', 'Fantasy', 'Sci-fi', 'Vintage photo'
    ];

    const handleStyleClick = (style: string) => {
        setPrompt(prev => {
            const trimmedPrev = prev.trim();
            if (trimmedPrev.toLowerCase().includes(style.toLowerCase())) {
                return prev;
            }
            return trimmedPrev ? `${trimmedPrev.replace(/,$/, '').trim()}, ${style}` : style;
        });
    };
    
    const handleInputImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setInputImage(file);
            if (inputImagePreview) {
                URL.revokeObjectURL(inputImagePreview);
            }
            setInputImagePreview(URL.createObjectURL(file));
        }
    };

    const removeInputImage = () => {
        setInputImage(null);
        if (inputImagePreview) {
            URL.revokeObjectURL(inputImagePreview);
        }
        setInputImagePreview(null);
    };

    const handleGenerate = async () => {
        if (!prompt.trim()) return;
        setIsLoading(true);
        setError(null);
        setResultUrl(null);
        try {
            const generatedUrl = await generateImageFromText(prompt, aspectRatio, inputImage || undefined);
            setResultUrl(generatedUrl);
        } catch (e: any) {
            console.error(e);
            setError(e.message || 'An unknown error occurred.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <main className="flex-1 overflow-y-auto p-4 sm:p-8 animate-fade-in">
            <div className="container mx-auto">
                <div className="text-center mb-8 sm:mb-12">
                    <div className="inline-flex items-center justify-center gap-3 bg-gray-800/50 border border-gray-700 rounded-full py-2 px-6 mb-4">
                        <SparkleIcon className="w-6 h-6 text-blue-400" />
                        <h2 className="text-sm font-bold uppercase tracking-wider text-blue-300">AI Tool</h2>
                    </div>
                    <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-gray-100">AI Image Generator from Text</h1>
                    <p className="max-w-3xl mx-auto mt-4 text-lg text-gray-400">Create stunning, original images and high-quality art from a simple text description for free. Describe your vision, and our text-to-image AI will bring it to life in seconds.</p>
                </div>

                <div className="w-full max-w-5xl mx-auto bg-gray-800/50 border border-gray-700/50 rounded-2xl shadow-2xl p-4 sm:p-8">
                    <div className="flex flex-col lg:flex-row gap-8">
                        <div className="w-full lg:w-1/2 flex flex-col gap-4">
                            <h3 className="text-xl font-bold text-white">1. Describe The Image You Want</h3>
                             <textarea
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                                placeholder="e.g., 'An astronaut riding a horse on Mars, photorealistic, cinematic lighting.'"
                                className="flex-grow bg-gray-800 border-2 border-gray-700 text-gray-200 rounded-lg p-4 focus:ring-2 focus:ring-blue-500 focus:outline-none transition w-full disabled:cursor-not-allowed disabled:opacity-60 text-base min-h-[120px]"
                                disabled={isLoading}
                                rows={4}
                            />
                             <div className="flex flex-col gap-2">
                                <h4 className="font-semibold text-gray-300">Add a Style (Optional)</h4>
                                <div className="flex flex-wrap gap-2">
                                    {stylePresets.map(style => (
                                        <button
                                            key={style}
                                            type="button"
                                            onClick={() => handleStyleClick(style)}
                                            disabled={isLoading}
                                            className="bg-white/10 text-gray-200 text-xs font-semibold py-1 px-3 rounded-full hover:bg-white/20 transition-colors"
                                            title={`Add style: ${style}`}
                                        >
                                           + {style}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className="flex flex-col gap-2">
                                <h4 className="font-semibold text-gray-300">Image Prompt (Optional)</h4>
                                <p className="text-xs text-gray-400 -mt-2">Add an image for style, composition, or character reference.</p>
                                {inputImagePreview ? (
                                    <div className="relative w-full h-32 mt-2">
                                        <img src={inputImagePreview} alt="Input preview" className="w-full h-full object-cover rounded-lg" />
                                        <button onClick={removeInputImage} disabled={isLoading} className="absolute -top-2 -right-2 bg-red-600 rounded-full text-white p-0.5 shadow-md hover:bg-red-500 transition-colors">
                                            <XCircleIcon className="w-6 h-6"/>
                                        </button>
                                    </div>
                                ) : (
                                    <label htmlFor="input-image-upload" className="mt-1 flex justify-center w-full h-32 px-6 pt-5 pb-6 border-2 border-gray-600 border-dashed rounded-md cursor-pointer hover:border-gray-500">
                                        <div className="space-y-1 text-center">
                                            <UploadIcon className="mx-auto h-10 w-10 text-gray-400" />
                                            <p className="text-sm text-gray-400">
                                                <span className="font-semibold text-blue-400">Upload an image</span>
                                            </p>
                                        </div>
                                        <input id="input-image-upload" name="input-image-upload" type="file" className="sr-only" onChange={handleInputImageChange} accept="image/*" disabled={isLoading}/>
                                    </label>
                                )}
                            </div>
                            <h3 className="text-xl font-bold text-white">2. Select an Aspect Ratio</h3>
                            <div className="grid grid-cols-5 gap-2">
                                {aspectRatios.map(({ id, label }) => (
                                    <button key={id} type="button" onClick={() => setAspectRatio(id)} disabled={isLoading} className={`py-2 px-1 text-center rounded-md text-xs font-semibold transition-all ${aspectRatio === id ? 'bg-blue-600 text-white' : 'bg-gray-700 hover:bg-gray-600'}`}>
                                        {label} <span className="block text-gray-400">{id}</span>
                                    </button>
                                ))}
                            </div>
                             <button onClick={handleGenerate} disabled={isLoading || !prompt.trim()} className="w-full bg-gradient-to-br from-purple-600 to-indigo-500 text-white font-bold py-4 px-6 rounded-lg transition-all duration-300 ease-in-out shadow-lg shadow-purple-500/20 hover:shadow-xl hover:shadow-purple-500/40 hover:-translate-y-px active:scale-95 active:shadow-inner text-lg disabled:opacity-50">
                                <div className="flex items-center justify-center gap-2"><SparkleIcon className="w-6 h-6"/><span>{isLoading ? 'Generating...' : 'Generate Image'}</span></div>
                            </button>
                            {error && <p className="text-sm text-red-400 text-center">{error}</p>}
                        </div>
                        <div className="w-full lg:w-1/2 relative aspect-square bg-black/30 rounded-lg overflow-hidden flex items-center justify-center">
                            {isLoading ? <Spinner /> : resultUrl ? (
                                <>
                                <img src={resultUrl} alt="Generated" className="w-full h-full object-contain" />
                                <a href={resultUrl} download="photomeld-generated.png" className="absolute bottom-4 right-4 flex items-center justify-center gap-2 bg-green-600/80 backdrop-blur-sm text-white font-bold py-2 px-4 rounded-lg transition-all hover:bg-green-500"><DownloadIcon className="w-5 h-5"/> Download</a>
                                </>
                            ) : <p className="text-gray-500">Your generated image will appear here.</p>}
                        </div>
                    </div>
                </div>
                 {currentCategory && (
                    <div className="container mx-auto mt-16">
                        <RelatedTools
                            category={currentCategory}
                            currentPage={currentPage}
                            onNavigate={onNavigate}
                        />
                    </div>
                )}
            </div>
        </main>
    );
};

export default ImageGeneratorFromTextPage;