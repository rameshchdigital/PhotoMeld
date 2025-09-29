/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState } from 'react';
import { generateFantasyMap } from '../services/geminiService';
import { SparkleIcon, DownloadIcon, MapIcon } from './icons';
import Spinner from './Spinner';
import { Page } from '../App';
import { ToolCategory } from '../services/toolData';
import RelatedTools from './RelatedTools';

interface FantasyMapGeneratorPageProps {
    onNavigate: (page: Page) => void;
    currentPage: Page;
    allTools: ToolCategory[];
}

const FantasyMapGeneratorPage: React.FC<FantasyMapGeneratorPageProps> = ({ onNavigate, currentPage, allTools }) => {
    const [prompt, setPrompt] = useState<string>('');
    const [mapUrl, setMapUrl] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const currentCategory = allTools.find(cat => cat.tools.some(tool => tool.page === currentPage));

    const handleGenerate = async () => {
        if (!prompt.trim()) {
            setError('Please enter a description for your map.');
            return;
        }
        setIsLoading(true);
        setError(null);
        setMapUrl(null);
        try {
            const resultUrl = await generateFantasyMap(prompt);
            setMapUrl(resultUrl);
        } catch (e: any) {
            console.error(e);
            setError(e.message || 'An unknown error occurred while generating the map.');
        } finally {
            setIsLoading(false);
        }
    };
    
    return (
        <main className="flex-1 overflow-y-auto p-4 sm:p-8 animate-fade-in">
            <div className="container mx-auto">
                <div className="text-center mb-8 sm:mb-12">
                     <div className="inline-flex items-center justify-center gap-3 bg-gray-800/50 border border-gray-700 rounded-full py-2 px-6 mb-4">
                        <MapIcon className="w-6 h-6 text-blue-400" />
                        <h2 className="text-sm font-bold uppercase tracking-wider text-blue-300">AI Tool</h2>
                    </div>
                    <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-gray-100">
                        AI Fantasy Map Generator
                    </h1>
                    <p className="max-w-3xl mx-auto mt-4 text-lg text-gray-400">
                        Bring your fictional world to life. Describe a continent, kingdom, or region, and our AI will draw a beautiful, detailed fantasy map for your D&D campaign, novel, or creative project.
                    </p>
                </div>

                <div className="w-full max-w-5xl mx-auto bg-gray-800/50 border border-gray-700/50 rounded-2xl shadow-2xl p-4 sm:p-8">
                    <div className="flex flex-col gap-6">
                        <textarea
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            placeholder="Describe your map... e.g., 'A continent named Eldoria, with a large mountain range in the center, a dense forest to the west, and several islands to the south, in the style of a vintage parchment map.'"
                            className="w-full h-32 bg-gray-900/50 border-2 border-gray-700 rounded-lg p-4 text-lg text-gray-200 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
                            disabled={isLoading}
                        />
                        <button onClick={handleGenerate} disabled={isLoading || !prompt.trim()} className="w-full max-w-sm mx-auto bg-gradient-to-br from-purple-600 to-indigo-500 text-white font-bold py-4 px-6 rounded-lg transition-all duration-300 ease-in-out shadow-lg shadow-purple-500/20 hover:shadow-xl hover:shadow-purple-500/40 hover:-translate-y-px active:scale-95 active:shadow-inner text-lg disabled:opacity-50">
                            <div className="flex items-center justify-center gap-2">
                                <SparkleIcon className="w-6 h-6"/>
                                <span>{isLoading ? 'Drawing Your World...' : 'Generate Map'}</span>
                            </div>
                        </button>
                        {error && <p className="text-sm text-red-400 text-center">{error}</p>}
                    </div>

                    <div className="mt-8">
                        {isLoading ? (
                            <div className="flex flex-col items-center justify-center gap-4 p-8 min-h-[400px]">
                                <Spinner />
                                <p className="text-lg font-semibold text-gray-300">Generating your map...</p>
                            </div>
                        ) : mapUrl && (
                            <div className="flex flex-col items-center gap-4">
                                <h3 className="text-2xl font-bold text-white">Your Map is Ready!</h3>
                                <img src={mapUrl} alt="Generated Fantasy Map" className="w-full h-auto object-contain rounded-lg shadow-lg border border-gray-700" />
                                <a href={mapUrl} download="fantasy-map.png" className="w-full max-w-sm flex items-center justify-center gap-2 bg-green-600 hover:bg-green-500 text-white font-bold py-3 px-6 rounded-lg transition-colors">
                                    <DownloadIcon className="w-5 h-5"/> Download Map
                                </a>
                            </div>
                        )}
                    </div>
                </div>

                 <div className="max-w-5xl mx-auto mt-16 text-gray-300 space-y-12">
                    <section>
                        <h2 className="text-3xl font-bold text-center mb-8 text-white">How to Create Your Fantasy Map</h2>
                        <div className="grid md:grid-cols-3 gap-8 text-center">
                            <div className="bg-black/20 p-6 rounded-lg"><p className="text-4xl font-bold text-blue-400 mb-2">1</p><h3 className="font-bold text-lg text-white mb-2">Describe Your World</h3><p className="text-sm">Write a detailed description. Include names of places, key geographical features like mountains or rivers, and the desired artistic style.</p></div>
                            <div className="bg-black/20 p-6 rounded-lg"><p className="text-4xl font-bold text-blue-400 mb-2">2</p><h3 className="font-bold text-lg text-white mb-2">Generate Map</h3><p className="text-sm">Click the generate button. Our AI will interpret your text and begin creating a unique map from scratch, complete with labels and icons.</p></div>
                            <div className="bg-black/20 p-6 rounded-lg"><p className="text-4xl font-bold text-blue-400 mb-2">3</p><h3 className="font-bold text-lg text-white mb-2">Download & Explore</h3><p className="text-sm">Your map will appear in moments. Download the high-resolution image for your D&D campaign, novel, or creative project.</p></div>
                        </div>
                    </section>
                    <section>
                        <h2 className="text-3xl font-bold text-center mb-8 text-white">Tips for Great Maps</h2>
                         <ul className="grid md:grid-cols-2 gap-6 text-base">
                            <li className="bg-black/20 p-6 rounded-lg flex items-start gap-4"><SparkleIcon className="w-6 h-6 text-blue-400 mt-1 flex-shrink-0" /><div><strong className="text-white">Be Specific with Names:</strong> Instead of "a forest," try "a dense, ancient forest of giant redwood trees called the Whisperwood." Naming places helps the AI generate labels.</div></li>
                            <li className="bg-black/20 p-6 rounded-lg flex items-start gap-4"><SparkleIcon className="w-6 h-6 text-blue-400 mt-1 flex-shrink-0" /><div><strong className="text-white">Mention the Style:</strong> Add keywords like "vintage parchment style," "hand-drawn ink," "colorful and vibrant," "top-down satellite view," or "elven cartography."</div></li>
                             <li className="bg-black/20 p-6 rounded-lg flex items-start gap-4"><SparkleIcon className="w-6 h-6 text-blue-400 mt-1 flex-shrink-0" /><div><strong className="text-white">Use Relative Positions:</strong> Phrases like "a desert to the east of the mountains" or "a river flowing from the north to the southern sea" help the AI build a logical and coherent layout.</div></li>
                            <li className="bg-black/20 p-6 rounded-lg flex items-start gap-4"><SparkleIcon className="w-6 h-6 text-blue-400 mt-1 flex-shrink-0" /><div><strong className="text-white">Iterate and Refine:</strong> Don't love the first result? Tweak your prompt and try again! Add more detail, change the style, or specify different locations to get the perfect map for your world.</div></li>
                        </ul>
                    </section>
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

export default FantasyMapGeneratorPage;