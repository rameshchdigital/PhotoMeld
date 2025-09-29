/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState } from 'react';
import { generateTattooDesigns } from '../services/geminiService';
import { SparkleIcon, DownloadIcon, TattooIcon } from './icons';
import Spinner from './Spinner';
import { Page } from '../App';
import { ToolCategory } from '../services/toolData';
import RelatedTools from './RelatedTools';

interface TattooGeneratorPageProps {
    onNavigate: (page: Page) => void;
    currentPage: Page;
    allTools: ToolCategory[];
}

const TattooGeneratorPage: React.FC<TattooGeneratorPageProps> = ({ onNavigate, currentPage, allTools }) => {
    const [prompt, setPrompt] = useState<string>('');
    const [tattooUrls, setTattooUrls] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const currentCategory = allTools.find(cat => cat.tools.some(tool => tool.page === currentPage));

    const handleGenerate = async () => {
        if (!prompt.trim()) {
            setError('Please enter a description for your tattoo.');
            return;
        }
        setIsLoading(true);
        setError(null);
        setTattooUrls([]);
        try {
            const resultUrls = await generateTattooDesigns(prompt);
            setTattooUrls(resultUrls);
        } catch (e: any) {
            console.error(e);
            setError(e.message || 'An unknown error occurred while generating designs.');
        } finally {
            setIsLoading(false);
        }
    };
    
    return (
        <main className="flex-1 overflow-y-auto p-4 sm:p-8 animate-fade-in">
            <div className="container mx-auto">
                <div className="text-center mb-8 sm:mb-12">
                     <div className="inline-flex items-center justify-center gap-3 bg-gray-800/50 border border-gray-700 rounded-full py-2 px-6 mb-4">
                        <TattooIcon className="w-6 h-6 text-blue-400" />
                        <h2 className="text-sm font-bold uppercase tracking-wider text-blue-300">AI Tool</h2>
                    </div>
                    <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-gray-100">
                        Free AI Tattoo Generator
                    </h1>
                    <p className="max-w-3xl mx-auto mt-4 text-lg text-gray-400">
                        Visualize your next tattoo before it's permanent. Describe any idea, style, or concept, and get unique, custom tattoo designs in seconds. Perfect for inspiration and collaborating with your tattoo artist.
                    </p>
                </div>

                <div className="w-full max-w-5xl mx-auto bg-gray-800/50 border border-gray-700/50 rounded-2xl shadow-2xl p-4 sm:p-8">
                    <div className="flex flex-col gap-6">
                        <textarea
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            placeholder="Describe your tattoo idea... e.g., 'A minimalist geometric wolf head, line art style'"
                            className="w-full h-32 bg-gray-900/50 border-2 border-gray-700 rounded-lg p-4 text-lg text-gray-200 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
                            disabled={isLoading}
                        />
                        <button onClick={handleGenerate} disabled={isLoading || !prompt.trim()} className="w-full max-w-sm mx-auto bg-gradient-to-br from-purple-600 to-indigo-500 text-white font-bold py-4 px-6 rounded-lg transition-all duration-300 ease-in-out shadow-lg shadow-purple-500/20 hover:shadow-xl hover:shadow-purple-500/40 hover:-translate-y-px active:scale-95 active:shadow-inner text-lg disabled:opacity-50">
                            <div className="flex items-center justify-center gap-2">
                                <SparkleIcon className="w-6 h-6"/>
                                <span>{isLoading ? 'Designing...' : 'Generate Designs'}</span>
                            </div>
                        </button>
                        {error && <p className="text-sm text-red-400 text-center">{error}</p>}
                    </div>

                    <div className="mt-8">
                        {isLoading ? (
                            <div className="flex flex-col items-center justify-center gap-4 p-8 min-h-[300px]">
                                <Spinner />
                                <p className="text-lg font-semibold text-gray-300">Generating your designs...</p>
                            </div>
                        ) : tattooUrls.length > 0 && (
                            <div className="flex flex-col items-center gap-4">
                                <h3 className="text-2xl font-bold text-white">Your Tattoo Concepts</h3>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
                                    {tattooUrls.map((url, i) => (
                                        <div key={i} className="flex flex-col gap-2 group">
                                            <div className="aspect-square bg-white rounded-lg overflow-hidden p-2">
                                                <img src={url} alt={`Generated Tattoo ${i + 1}`} className="w-full h-full object-contain"/>
                                            </div>
                                            <a href={url} download={`tattoo-design-${i+1}.png`} className="flex items-center justify-center gap-2 w-full bg-green-600 hover:bg-green-500 text-white font-bold py-2 rounded-lg transition-colors text-sm">
                                                <DownloadIcon className="w-5 h-5"/> Download
                                            </a>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="max-w-5xl mx-auto mt-16 text-gray-300 space-y-12">
                    <section><h2 className="text-3xl font-bold text-center mb-8 text-white">How to Design Your Tattoo</h2><div className="grid md:grid-cols-3 gap-8 text-center"><div className="bg-black/20 p-6 rounded-lg"><p className="text-4xl font-bold text-blue-400 mb-2">1</p><h3 className="font-bold text-lg text-white mb-2">Describe Your Idea</h3><p className="text-sm">Be as detailed as possible. Mention the subject, style (e.g., minimalist, watercolor), and any other key elements.</p></div><div className="bg-black/20 p-6 rounded-lg"><p className="text-4xl font-bold text-blue-400 mb-2">2</p><h3 className="font-bold text-lg text-white mb-2">Generate Concepts</h3><p className="text-sm">Our AI will create several unique tattoo designs based on your prompt, giving you multiple options to consider.</p></div><div className="bg-black/20 p-6 rounded-lg"><p className="text-4xl font-bold text-blue-400 mb-2">3</p><h3 className="font-bold text-lg text-white mb-2">Save & Share</h3><p className="text-sm">Download your favorite designs to show to your tattoo artist or share for feedback.</p></div></div></section>
                    <section><h2 className="text-3xl font-bold text-center mb-8 text-white">Tips for Better Designs</h2><ul className="grid md:grid-cols-2 gap-6 text-base"><li className="bg-black/20 p-6 rounded-lg flex items-start gap-4"><SparkleIcon className="w-6 h-6 text-blue-400 mt-1 flex-shrink-0" /><div><strong className="text-white">Specify the Style:</strong> Use keywords like "line art," "traditional," "neo-traditional," "geometric," "dotwork," or "blackwork" for best results.</div></li><li className="bg-black/20 p-6 rounded-lg flex items-start gap-4"><SparkleIcon className="w-6 h-6 text-blue-400 mt-1 flex-shrink-0" /><div><strong className="text-white">Combine Elements:</strong> Try combining ideas, like "a lion wearing a crown with geometric patterns" or "a snake wrapped around a dagger."</div></li><li className="bg-black/20 p-6 rounded-lg flex items-start gap-4"><SparkleIcon className="w-6 h-6 text-blue-400 mt-1 flex-shrink-0" /><div><strong className="text-white">Keep It Simple:</strong> For cleaner results, start with a simple concept. You can always add more detail in a new prompt.</div></li><li className="bg-black/20 p-6 rounded-lg flex items-start gap-4"><SparkleIcon className="w-6 h-6 text-blue-400 mt-1 flex-shrink-0" /><div><strong className="text-white">Focus on the Design:</strong> The AI is trained to generate the artwork on a plain background, perfect for use as a stencil or reference.</div></li></ul></section>
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

export default TattooGeneratorPage;