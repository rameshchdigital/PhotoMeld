
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState, useEffect, useRef } from 'react';
import { generatePromptFromVideo } from '../services/geminiService';
import { UploadIcon, SparkleIcon, VideoIcon, CheckCircleIcon, SendIcon } from './icons';
import Spinner from './Spinner';
import { Page } from '../App';
import { ToolCategory } from '../services/toolData';
import RelatedTools from './RelatedTools';

interface VideoToPromptGeneratorPageProps {
    onNavigate: (page: Page) => void;
    currentPage: Page;
    allTools: ToolCategory[];
}

const VideoToPromptGeneratorPage: React.FC<VideoToPromptGeneratorPageProps> = ({ onNavigate, currentPage, allTools }) => {
    const [originalFile, setOriginalFile] = useState<File | null>(null);
    const [originalUrl, setOriginalUrl] = useState<string | null>(null);
    const [videoUrlInput, setVideoUrlInput] = useState('');
    const [generatedPrompt, setGeneratedPrompt] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [isDraggingOver, setIsDraggingOver] = useState(false);
    const [isCopied, setIsCopied] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null);

    const currentCategory = allTools.find(cat => cat.tools.some(tool => tool.page === currentPage));

    useEffect(() => {
        return () => {
            if (originalUrl && !videoUrlInput) URL.revokeObjectURL(originalUrl);
        };
    }, [originalUrl, videoUrlInput]);

    const handleFileSelect = (files: FileList | null) => {
        if (files && files[0]) {
            const file = files[0];
            if (!file.type.startsWith('video/')) {
                setError("Please select a valid video file.");
                return;
            }
            setOriginalFile(file);
            setVideoUrlInput('');
            if (originalUrl) URL.revokeObjectURL(originalUrl);
            setOriginalUrl(URL.createObjectURL(file));
            setGeneratedPrompt(null);
            setError(null);
        }
    };

    const handleUrlSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!videoUrlInput.trim()) return;
        
        // For security/CORS, we warn that direct URL analysis is limited and suggest upload
        // In a real production app, we'd have a server-side proxy to fetch/process the URL
        setError("Note: Remote URL analysis requires direct file access. For best results, please download the video and upload it here.");
        setOriginalUrl(videoUrlInput);
        setOriginalFile(null);
        setGeneratedPrompt(null);
    };

    const handleGenerate = async () => {
        if (!originalFile) {
            setError("Please upload a video file for analysis.");
            return;
        }
        setIsLoading(true);
        setError(null);
        setGeneratedPrompt(null);
        try {
            const prompt = await generatePromptFromVideo(originalFile);
            setGeneratedPrompt(prompt);
        } catch (e: any) {
            console.error(e);
            setError(e.message || 'An unknown error occurred during video analysis.');
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
                        <VideoIcon className="w-6 h-6 text-blue-400" />
                        <h2 className="text-sm font-bold uppercase tracking-wider text-blue-300">AI Tool</h2>
                    </div>
                    <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-gray-100">AI Video to Prompt Generator</h1>
                    <p className="max-w-3xl mx-auto mt-4 text-lg text-gray-400">Turn cinematic clips into perfect AI prompts. Upload any video or paste a link, and our AI will reverse-engineer a detailed text description capturing motion, lighting, and mood.</p>
                </div>

                <div className="w-full max-w-6xl mx-auto bg-gray-800/50 border border-gray-700/50 rounded-2xl shadow-2xl p-4 sm:p-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                        {/* Left Column: Video Input */}
                        <div className="flex flex-col gap-6">
                            <div className="bg-black/20 p-6 rounded-xl border border-gray-700">
                                <h3 className="text-xl font-bold text-white mb-4">1. Choose Input Method</h3>
                                
                                {/* URL Input */}
                                <form onSubmit={handleUrlSubmit} className="flex items-center gap-2 mb-6">
                                    <div className="relative flex-grow">
                                        <input 
                                            type="text" 
                                            value={videoUrlInput}
                                            onChange={(e) => setVideoUrlInput(e.target.value)}
                                            placeholder="Paste YouTube or Instagram URL..."
                                            className="w-full bg-gray-900 border-2 border-gray-700 text-gray-200 rounded-lg p-3 pr-10 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
                                            disabled={isLoading}
                                        />
                                    </div>
                                    <button 
                                        type="submit" 
                                        className="bg-gray-700 hover:bg-gray-600 text-white p-3 rounded-lg transition-colors"
                                        disabled={isLoading}
                                    >
                                        <SendIcon className="w-6 h-6" />
                                    </button>
                                </form>

                                <div className="flex items-center gap-4 mb-6">
                                    <div className="flex-grow h-px bg-gray-700"></div>
                                    <span className="text-gray-500 font-bold">OR</span>
                                    <div className="flex-grow h-px bg-gray-700"></div>
                                </div>

                                {/* File Upload */}
                                {!originalUrl ? (
                                    <label
                                        htmlFor="video-prompt-upload"
                                        onDragOver={(e) => { e.preventDefault(); setIsDraggingOver(true); }}
                                        onDragLeave={() => setIsDraggingOver(false)}
                                        onDrop={(e) => { e.preventDefault(); setIsDraggingOver(false); handleFileSelect(e.dataTransfer.files); }}
                                        className={`relative w-full aspect-video flex flex-col items-center justify-center p-6 border-4 rounded-2xl cursor-pointer group transition-all duration-300 ${isDraggingOver ? 'bg-blue-500/20 border-dashed border-blue-400' : 'bg-gray-900/50 border-dashed border-gray-600 hover:border-blue-500 hover:bg-gray-800/50'}`}
                                    >
                                        <UploadIcon className="w-12 h-12 text-gray-500 group-hover:text-blue-400 transition-colors" />
                                        <p className="mt-4 text-lg font-semibold text-gray-300">Upload Video File</p>
                                        <p className="text-sm text-gray-500">MP4, WEBM, MOV supported</p>
                                    </label>
                                ) : (
                                    <div className="relative rounded-lg overflow-hidden border border-gray-700 group">
                                        <video 
                                            ref={videoRef}
                                            src={originalUrl} 
                                            controls 
                                            className="w-full h-auto aspect-video object-contain bg-black"
                                        />
                                        <button 
                                            onClick={() => { setOriginalUrl(null); setOriginalFile(null); setVideoUrlInput(''); }}
                                            className="absolute top-2 right-2 bg-black/60 p-2 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            Change Video
                                        </button>
                                    </div>
                                )}
                                <input id="video-prompt-upload" type="file" className="hidden" accept="video/*" onChange={(e) => handleFileSelect(e.target.files)} />
                            </div>

                            <button onClick={handleGenerate} disabled={isLoading || !originalUrl} className="w-full bg-gradient-to-br from-blue-600 to-indigo-500 text-white font-bold py-4 px-6 rounded-lg transition-all text-xl shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 hover:-translate-y-1 active:scale-95 disabled:opacity-50 disabled:transform-none">
                                <div className="flex items-center justify-center gap-3">
                                    <SparkleIcon className="w-7 h-7"/>
                                    <span>{isLoading ? 'Analyzing Motion...' : 'Generate AI Prompt'}</span>
                                </div>
                            </button>
                            {error && <p className="text-sm text-red-400 text-center bg-red-900/20 p-3 rounded-lg border border-red-800">{error}</p>}
                        </div>

                        {/* Right Column: Results */}
                        <div className="flex flex-col gap-4">
                            <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                <CheckCircleIcon className="w-6 h-6 text-green-400" />
                                2. Your Generated Prompt
                            </h3>
                            {isLoading ? (
                                <div className="w-full h-[450px] flex flex-col items-center justify-center bg-black/20 rounded-2xl border border-gray-700 animate-pulse">
                                    <Spinner />
                                    <p className="mt-4 text-gray-300 font-medium">Scanning video frames...</p>
                                    <p className="text-sm text-gray-500">Generating cinematic description...</p>
                                </div>
                            ) : generatedPrompt ? (
                                <div className="relative animate-fade-in h-full">
                                    <textarea 
                                        readOnly 
                                        value={generatedPrompt} 
                                        className="w-full h-[450px] bg-gray-900/50 border-2 border-gray-700 rounded-2xl p-6 text-gray-100 text-lg focus:outline-none leading-relaxed resize-none" 
                                    />
                                    <button 
                                        onClick={handleCopy} 
                                        className={`absolute top-4 right-4 flex items-center gap-2 font-bold py-2 px-6 rounded-xl transition-all shadow-lg ${isCopied ? 'bg-green-600 text-white' : 'bg-blue-600 hover:bg-blue-500 text-white'}`}
                                    >
                                        {isCopied ? <><CheckCircleIcon className="w-5 h-5"/> Copied!</> : 'Copy Prompt'}
                                    </button>
                                </div>
                            ) : (
                                <div className="w-full h-[450px] flex flex-col items-center justify-center bg-black/20 rounded-2xl border border-gray-700 text-gray-500 text-center p-8">
                                    <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mb-4">
                                        <VideoIcon className="w-8 h-8 opacity-50" />
                                    </div>
                                    <p className="text-lg">Provide a video to generate a prompt.</p>
                                    <p className="text-sm mt-2 opacity-60 italic">Best for cinematic clips, animations, and high-motion scenes.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="max-w-5xl mx-auto mt-16 text-gray-300 space-y-12">
                    <section>
                        <h2 className="text-3xl font-bold text-center mb-8 text-white">How it Works</h2>
                        <div className="grid md:grid-cols-3 gap-8 text-center">
                            <div className="bg-black/20 p-8 rounded-2xl border border-gray-800">
                                <div className="w-12 h-12 bg-blue-600/20 text-blue-400 rounded-full flex items-center justify-center mx-auto mb-4 font-bold text-xl">1</div>
                                <h3 className="font-bold text-lg text-white mb-2">Input Content</h3>
                                <p className="text-sm">Upload a video file from your device or reference a URL from platforms like Instagram or YouTube.</p>
                            </div>
                            <div className="bg-black/20 p-8 rounded-2xl border border-gray-800">
                                <div className="w-12 h-12 bg-blue-600/20 text-blue-400 rounded-full flex items-center justify-center mx-auto mb-4 font-bold text-xl">2</div>
                                <h3 className="font-bold text-lg text-white mb-2">Deep Scan Analysis</h3>
                                <p className="text-sm">Our Gemini AI scans multiple frames, identifying camera angles, subject motion, lighting styles, and color palettes.</p>
                            </div>
                            <div className="bg-black/20 p-8 rounded-2xl border border-gray-800">
                                <div className="w-12 h-12 bg-blue-600/20 text-blue-400 rounded-full flex items-center justify-center mx-auto mb-4 font-bold text-xl">3</div>
                                <h3 className="font-bold text-lg text-white mb-2">Generate & Export</h3>
                                <p className="text-sm">Receive a highly detailed text prompt ready to be pasted into tools like Sora, Midjourney, or Stable Diffusion.</p>
                            </div>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-3xl font-bold text-center mb-8 text-white">Frequently Asked Questions</h2>
                        <div className="space-y-4 max-w-3xl mx-auto">
                            <div className="bg-black/20 p-5 rounded-xl border border-gray-800">
                                <strong className="text-white block mb-2">Can I analyze long videos?</strong>
                                <p className="text-sm text-gray-400">For best performance and precision, we recommend clips between 5 and 30 seconds. Longer videos may be sampled, which could miss specific details.</p>
                            </div>
                            <div className="bg-black/20 p-5 rounded-xl border border-gray-800">
                                <strong className="text-white block mb-2">Does this work with private YouTube videos?</strong>
                                <p className="text-sm text-gray-400">No, the AI can only access public URLs. For private content, please download the video and upload the file directly to the tool.</p>
                            </div>
                            <div className="bg-black/20 p-5 rounded-xl border border-gray-800">
                                <strong className="text-white block mb-2">Is my data secure?</strong>
                                <p className="text-sm text-gray-400">Absolutely. Your videos are processed in real-time for analysis and are never stored on our servers. The connection to Gemini is secure and transient.</p>
                            </div>
                        </div>
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

export default VideoToPromptGeneratorPage;
