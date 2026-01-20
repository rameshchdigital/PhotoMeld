/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState, useEffect } from 'react';
import { generatePromptFromImage } from '../services/geminiService';
import { UploadIcon, SparkleIcon, QuestionMarkCircleIcon, CheckCircleIcon } from './icons';
import Spinner from './Spinner';
import { Page } from '../App';
import { ToolCategory } from '../services/toolData';
import RelatedTools from './RelatedTools';

interface ImageToPromptGeneratorPageProps {
    onNavigate: (page: Page) => void;
    currentPage: Page;
    allTools: ToolCategory[];
}

const ImageToPromptGeneratorPage: React.FC<ImageToPromptGeneratorPageProps> = ({ onNavigate, currentPage, allTools }) => {
    const [originalFile, setOriginalFile] = useState<File | null>(null);
    const [originalUrl, setOriginalUrl] = useState<string | null>(null);
    const [generatedPrompt, setGeneratedPrompt] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [isDraggingOver, setIsDraggingOver] = useState(false);
    const [isCopied, setIsCopied] = useState(false);

    const currentCategory = allTools.find(cat => cat.tools.some(tool => tool.page === currentPage));

    useEffect(() => {
        return () => {
            if (originalUrl) URL.revokeObjectURL(originalUrl);
        };
    }, [originalUrl]);

    const handleFileSelect = (files: FileList | null) => {
        if (files && files[0]) {
            const file = files[0];
            setOriginalFile(file);
            if (originalUrl) URL.revokeObjectURL(originalUrl);
            setOriginalUrl(URL.createObjectURL(file));
            setGeneratedPrompt(null);
            setError(null);
        }
    };

    const handleGenerate = async () => {
        if (!originalFile) return;
        setIsLoading(true);
        setError(null);
        setGeneratedPrompt(null);
        try {
            const prompt = await generatePromptFromImage(originalFile);
            setGeneratedPrompt(prompt);
        } catch (e: any) {
            console.error(e);
            setError(e.message || 'An unknown error occurred.');
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleCopy = () => {
        if (generatedPrompt) {
            navigator.clipboard.writeText(generatedPrompt);
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000);
        }
    };

    return (
        <main className="flex-1 overflow-y-auto p-4 sm:p-8 animate-fade-in">
            <div className="container mx-auto">
                <div className="text-center mb-8 sm:mb-12">
                    <div className="inline-flex items-center justify-center gap-3 bg-gray-800/50 border border-gray-700 rounded-full py-2 px-6 mb-4">
                        <QuestionMarkCircleIcon className="w-6 h-6 text-blue-400" />
                        <h2 className="text-sm font-bold uppercase tracking-wider text-blue-300">AI Tool</h2>
                    </div>
                    <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-gray-100">AI Image to Prompt Generator</h1>
                    <p className="max-w-3xl mx-auto mt-4 text-lg text-gray-400">Discover the right words for your AI art. Upload any image, and our AI will analyze it to generate a detailed and creative text prompt you can use with image generators.</p>
                </div>

                <div className="w-full max-w-5xl mx-auto bg-gray-800/50 border border-gray-700/50 rounded-2xl shadow-2xl p-4 sm:p-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                        {/* Left Column: Image Uploader & Display */}
                        <div className="flex flex-col gap-4">
                            {!originalUrl ? (
                                <label
                                    htmlFor="prompt-gen-upload"
                                    onDragOver={(e) => { e.preventDefault(); setIsDraggingOver(true); }}
                                    onDragLeave={() => setIsDraggingOver(false)}
                                    onDrop={(e) => { e.preventDefault(); setIsDraggingOver(false); handleFileSelect(e.dataTransfer.files); }}
                                    className={`relative w-full aspect-square flex flex-col items-center justify-center p-10 border-4 rounded-2xl cursor-pointer group transition-all duration-300 ${isDraggingOver ? 'bg-blue-500/20 border-dashed border-blue-400' : 'bg-gray-900/50 border-dashed border-gray-600 hover:border-blue-500 hover:bg-gray-800/50'}`}
                                >
                                    <UploadIcon className="w-16 h-16 text-gray-500 group-hover:text-blue-400 transition-colors" />
                                    <p className="mt-4 text-xl font-semibold text-gray-300">Upload an Image to Analyze</p>
                                </label>
                            ) : (
                                <img src={originalUrl} alt="Uploaded for analysis" className="w-full h-auto object-contain rounded-lg shadow-lg border border-gray-700"/>
                            )}
                            <input id="prompt-gen-upload" type="file" className="hidden" accept="image/*" onChange={(e) => handleFileSelect(e.target.files)} />
                            <button onClick={handleGenerate} disabled={isLoading || !originalFile} className="w-full bg-gradient-to-br from-purple-600 to-indigo-500 text-white font-bold py-4 px-6 rounded-lg transition-all text-lg disabled:opacity-50">
                                <div className="flex items-center justify-center gap-2"><SparkleIcon className="w-6 h-6"/><span>{isLoading ? 'Analyzing...' : 'Generate Prompt'}</span></div>
                            </button>
                        </div>

                        {/* Right Column: Prompt Result */}
                        <div className="flex flex-col gap-4">
                            {isLoading ? (
                                <div className="w-full h-96 flex flex-col items-center justify-center bg-black/20 rounded-lg"><Spinner /><p className="mt-4 text-gray-300">Generating prompt...</p></div>
                            ) : generatedPrompt ? (
                                <div className="relative">
                                    <textarea readOnly value={generatedPrompt} className="w-full h-96 bg-gray-900/50 border-2 border-gray-700 rounded-lg p-4 text-gray-200 focus:outline-none" />
                                    <button onClick={handleCopy} className={`absolute top-3 right-3 flex items-center gap-2 text-sm font-semibold py-2 px-4 rounded-md transition-colors ${isCopied ? 'bg-green-600 text-white' : 'bg-blue-600 hover:bg-blue-500 text-white'}`}>
                                        {isCopied ? <><CheckCircleIcon className="w-5 h-5"/> Copied!</> : 'Copy Prompt'}
                                    </button>
                                </div>
                            ) : (
                                <div className="w-full h-96 flex items-center justify-center bg-black/20 rounded-lg text-gray-500">Your generated prompt will appear here.</div>
                            )}
                            {error && <p className="text-sm text-red-400 text-center">{error}</p>}
                        </div>
                    </div>
                </div>

                <div className="max-w-5xl mx-auto mt-16 text-gray-300 space-y-12">
                    <section><h2 className="text-3xl font-bold text-center mb-8 text-white">How to Generate a Prompt From an Image</h2><div className="grid md:grid-cols-3 gap-8 text-center"><div className="bg-black/20 p-6 rounded-lg"><p className="text-4xl font-bold text-blue-400 mb-2">1</p><h3 className="font-bold text-lg text-white mb-2">Upload Image</h3><p className="text-sm">Choose any image you find inspiring. It could be a photograph, a digital painting, or a movie screenshot.</p></div><div className="bg-black/20 p-6 rounded-lg"><p className="text-4xl font-bold text-blue-400 mb-2">2</p><h3 className="font-bold text-lg text-white mb-2">Generate Prompt</h3><p className="text-sm">Click the button. Our AI will analyze the image's style, subject, and composition to create a detailed text prompt.</p></div><div className="bg-black/20 p-6 rounded-lg"><p className="text-4xl font-bold text-blue-400 mb-2">3</p><h3 className="font-bold text-lg text-white mb-2">Copy & Create</h3><p className="text-sm">Copy the generated prompt and use it in our AI Image Generator (or any other) to create new, similar artwork.</p></div></div></section>
                    <section><h2 className="text-3xl font-bold text-center mb-8 text-white">Frequently Asked Questions</h2><div className="space-y-4 max-w-3xl mx-auto"><div className="bg-black/20 p-4 rounded-lg"><strong className="text-white block mb-1">What is a 'prompt'?</strong>A prompt is a text description that you give to an AI image generator to tell it what to create. A good prompt is key to getting a great result.</div><div className="bg-black/20 p-4 rounded-lg"><strong className="text-white block mb-1">Why would I use this tool?</strong>It's a great way to learn how to write effective prompts. By seeing how an AI describes an image you like, you can understand what keywords and phrases are important for achieving a certain style. It's also perfect for when you find an image you love and want to create something similar but unique.</div><div className="bg-black/20 p-4 rounded-lg"><strong className="text-white block mb-1">Can I edit the generated prompt?</strong>Absolutely! The generated prompt is a great starting point. Feel free to copy it, then modify or add details to customize your next creation even further.</div></div></section>
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

export default ImageToPromptGeneratorPage;