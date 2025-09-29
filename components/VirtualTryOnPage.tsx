/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState, useCallback } from 'react';
import { ReactCompareSlider, ReactCompareSliderImage } from 'react-compare-slider';
import { generateVirtualTryOnImage } from '../services/geminiService';
import { UploadIcon, SparkleIcon, DownloadIcon, TshirtIcon } from './icons';
import Spinner from './Spinner';
import { Page } from '../App';
import { ToolCategory } from '../services/toolData';
import RelatedTools from './RelatedTools';

interface VirtualTryOnPageProps {
    onNavigate: (page: Page) => void;
    currentPage: Page;
    allTools: ToolCategory[];
}

const VirtualTryOnPage: React.FC<VirtualTryOnPageProps> = ({ onNavigate, currentPage, allTools }) => {
    const [originalFile, setOriginalFile] = useState<File | null>(null);
    const [originalUrl, setOriginalUrl] = useState<string | null>(null);
    const [resultUrl, setResultUrl] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [prompt, setPrompt] = useState('');
    const [isDraggingOver, setIsDraggingOver] = useState(false);

    const currentCategory = allTools.find(cat => cat.tools.some(tool => tool.page === currentPage));

    const resetState = () => {
        setOriginalFile(null);
        if (originalUrl) URL.revokeObjectURL(originalUrl);
        setOriginalUrl(null);
        if (resultUrl) URL.revokeObjectURL(resultUrl);
        setResultUrl(null);
        setIsLoading(false);
        setError(null);
        setPrompt('');
    }

    const handleFileSelect = (files: FileList | null) => {
        if (files && files[0]) {
            resetState();
            const file = files[0];
            setOriginalFile(file);
            setOriginalUrl(URL.createObjectURL(file));
        }
    };

    const handleGenerate = useCallback(async () => {
        if (!originalFile || !prompt.trim()) {
            setError("Please upload an image and describe an item to try on.");
            return;
        }
        setIsLoading(true);
        setError(null);
        setResultUrl(null);
        try {
            const newUrl = await generateVirtualTryOnImage(originalFile, prompt);
            setResultUrl(newUrl);
        } catch (e: any) {
            console.error(e);
            setError(e.message || 'An unknown error occurred.');
        } finally {
            setIsLoading(false);
        }
    }, [originalFile, prompt]);

    return (
        <main className="flex-1 overflow-y-auto p-4 sm:p-8 animate-fade-in">
            <div className="container mx-auto">
                <div className="text-center mb-8 sm:mb-12">
                    <div className="inline-flex items-center justify-center gap-3 bg-gray-800/50 border border-gray-700 rounded-full py-2 px-6 mb-4">
                        <TshirtIcon className="w-6 h-6 text-blue-400" />
                        <h2 className="text-sm font-bold uppercase tracking-wider text-blue-300">AI Tool</h2>
                    </div>
                    <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-gray-100">
                        AI Virtual Try-On
                    </h1>
                    <p className="max-w-3xl mx-auto mt-4 text-lg text-gray-400">
                        See how it looks before you buy or commit. Describe clothes, accessories, or even tattoos and see them realistically placed on your photo instantly and for free.
                    </p>
                </div>

                <div className="w-full max-w-5xl mx-auto bg-gray-800/50 border border-gray-700/50 rounded-2xl shadow-2xl p-4 sm:p-8">
                    {!originalUrl ? (
                        <div className="flex flex-col items-center justify-center gap-6 py-12">
                            <label htmlFor="tryon-upload" onDragOver={(e) => { e.preventDefault(); setIsDraggingOver(true); }} onDragLeave={() => setIsDraggingOver(false)} onDrop={(e) => { e.preventDefault(); setIsDraggingOver(false); handleFileSelect(e.dataTransfer.files); }} className={`relative w-full max-w-lg flex flex-col items-center justify-center p-10 border-4 rounded-2xl cursor-pointer group transition-all duration-300 ${isDraggingOver ? 'bg-blue-500/20 border-dashed border-blue-400' : 'bg-gray-900/50 border-dashed border-gray-600 hover:border-blue-500 hover:bg-gray-800/50'}`}><UploadIcon className="w-16 h-16 text-gray-500 group-hover:text-blue-400 transition-colors" /><p className="mt-4 text-xl font-semibold text-gray-300">Upload a Photo of Yourself</p><p className="mt-1 text-gray-400">Full body or portrait shots work best.</p></label>
                            <input id="tryon-upload" type="file" className="hidden" accept="image/*" onChange={(e) => handleFileSelect(e.target.files)} />
                        </div>
                    ) : (
                        <div className="flex flex-col lg:flex-row gap-8">
                            <div className="w-full lg:w-2/3 relative aspect-square bg-black/30 rounded-lg overflow-hidden">
                                {isLoading && <div className="absolute inset-0 bg-black/70 backdrop-blur-sm flex flex-col items-center justify-center z-20"><Spinner /><p className="text-lg font-semibold mt-4 text-gray-200">Applying Item...</p></div>}
                                <ReactCompareSlider itemOne={<ReactCompareSliderImage src={originalUrl} alt="Original" />} itemTwo={<ReactCompareSliderImage src={resultUrl || originalUrl} alt="Result" style={{ filter: resultUrl ? 'none' : 'blur(5px)' }} />} className="w-full h-full" />
                            </div>
                            <div className="w-full lg:w-1/3 flex flex-col gap-6">
                                <h3 className="text-xl font-bold text-white">1. Describe What to Try On</h3>
                                <input type="text" value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder="e.g., 'a black leather jacket'" className="w-full bg-gray-900/50 border-2 border-gray-700 rounded-lg p-4 text-lg text-gray-200 focus:ring-2 focus:ring-blue-500 focus:outline-none transition" disabled={isLoading} />
                                <h3 className="text-xl font-bold text-white">2. Generate the Look</h3>
                                <button onClick={handleGenerate} disabled={isLoading || !prompt.trim()} className="w-full bg-gradient-to-br from-purple-600 to-indigo-500 text-white font-bold py-4 px-6 rounded-lg transition-all duration-300 ease-in-out shadow-lg shadow-purple-500/20 hover:shadow-xl hover:shadow-purple-500/40 hover:-translate-y-px active:scale-95 active:shadow-inner text-lg disabled:opacity-50">
                                    <div className="flex items-center justify-center gap-2"><SparkleIcon className="w-6 h-6"/><span>{isLoading ? 'Processing...' : 'Try It On'}</span></div>
                                </button>
                                {error && <p className="text-sm text-red-400 text-center">{error}</p>}
                                <div className="flex-grow"></div>
                                <div className="flex items-center gap-3">
                                    <a href={resultUrl!} download="try-on-result.png" className={`w-full flex items-center justify-center gap-3 bg-green-600 text-white font-bold py-4 px-6 rounded-lg transition-opacity ${resultUrl ? 'opacity-100 hover:bg-green-500' : 'opacity-50 cursor-not-allowed'}`}><DownloadIcon className="w-6 h-6"/> Download</a>
                                    <button onClick={resetState} className="w-full bg-red-600 hover:bg-red-500 text-white font-bold py-4 px-6 rounded-lg">Start Over</button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <div className="max-w-5xl mx-auto mt-16 text-gray-300 space-y-12">
                     <section><h2 className="text-3xl font-bold text-center mb-8 text-white">Try Anything On, Instantly</h2><div className="grid md:grid-cols-4 gap-8 text-center"><div className="bg-black/20 p-6 rounded-lg"><h3 className="font-bold text-lg text-white mb-2">Clothing</h3><p className="text-sm">Wondering how a new jacket, dress, or suit would look? Be specific with colors and styles like 'a red silk dress' or 'a vintage denim jacket'.</p></div><div className="bg-black/20 p-6 rounded-lg"><h3 className="font-bold text-lg text-white mb-2">Accessories</h3><p className="text-sm">See how you look with different accessories. Try prompts like 'aviator sunglasses', 'a gold chain necklace', or 'a black beanie'.</p></div><div className="bg-black/20 p-6 rounded-lg"><h3 className="font-bold text-lg text-white mb-2">Hairstyles & Colors</h3><p className="text-sm">You can also experiment with your hair. Try 'change hair to platinum blonde' or 'give me a short bob haircut' to see a new you.</p></div><div className="bg-black/20 p-6 rounded-lg"><h3 className="font-bold text-lg text-white mb-2">Tattoos</h3><p className="text-sm">Visualize a tattoo before you get it. Use a prompt like 'a dragon tattoo on my left arm' to see a realistic preview on your own photo.</p></div></div></section>
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

export default VirtualTryOnPage;