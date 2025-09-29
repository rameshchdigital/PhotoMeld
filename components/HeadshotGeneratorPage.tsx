/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState, useEffect, useCallback } from 'react';
import { generateHeadshot } from '../services/geminiService';
import { UploadIcon, SparkleIcon, DownloadIcon, XCircleIcon, HeadshotIcon } from './icons';
import Spinner from './Spinner';
import { Page } from '../App';
import { ToolCategory } from '../services/toolData';
import RelatedTools from './RelatedTools';

interface HeadshotGeneratorPageProps {
    onNavigate: (page: Page) => void;
    currentPage: Page;
    allTools: ToolCategory[];
}

const MIN_FILES = 4;
const MAX_FILES = 10;

const HeadshotGeneratorPage: React.FC<HeadshotGeneratorPageProps> = ({ onNavigate, currentPage, allTools }) => {
    const [selfies, setSelfies] = useState<File[]>([]);
    const [selfiePreviews, setSelfiePreviews] = useState<string[]>([]);
    const [generatedHeadshots, setGeneratedHeadshots] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [isDraggingOver, setIsDraggingOver] = useState(false);

    const currentCategory = allTools.find(cat => cat.tools.some(tool => tool.page === currentPage));

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            handleFiles(e.target.files);
        }
    };

    const handleFiles = (files: FileList) => {
        setError(null);
        const newFiles = Array.from(files);
        if (selfies.length + newFiles.length > MAX_FILES) {
            setError(`You can upload a maximum of ${MAX_FILES} images.`);
            return;
        }
        setSelfies(prev => [...prev, ...newFiles]);
    };

    const removeSelfie = (indexToRemove: number) => {
        setSelfies(prev => prev.filter((_, index) => index !== indexToRemove));
        setSelfiePreviews(prev => prev.filter((_, index) => index !== indexToRemove));
    };

    useEffect(() => {
        const newUrls = selfies.map(file => URL.createObjectURL(file));
        setSelfiePreviews(newUrls);

        return () => {
            newUrls.forEach(url => URL.revokeObjectURL(url));
        };
    }, [selfies]);

    const handleGenerate = async () => {
        if (selfies.length < MIN_FILES) {
            setError(`Please upload at least ${MIN_FILES} selfies for the best results.`);
            return;
        }
        setError(null);
        setIsLoading(true);
        setGeneratedHeadshots([]);

        const headshotStyles = [
            "Corporate look, wearing a dark business suit, in a modern office background with soft, blurred lights.",
            "Casual business look, wearing a smart blazer, against a neutral grey studio backdrop.",
            "Creative professional look, wearing a stylish sweater, in a bright, minimalist indoor setting.",
            "Outdoor business portrait, natural lighting, with a slightly blurred urban or park background."
        ];

        try {
            const results = await Promise.all(
                headshotStyles.map(style => generateHeadshot(selfies, style))
            );
            setGeneratedHeadshots(results);
        } catch (e: any) {
            console.error(e);
            setError(e.message || "An unknown error occurred while generating headshots.");
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleDrop = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDraggingOver(false);
        handleFiles(e.dataTransfer.files);
    }, [selfies]);

    const handleDragOver = (e: React.DragEvent<HTMLLabelElement>) => {
        e.preventDefault();
        e.stopPropagation();
    };
    
    const handleDragLeave = () => setIsDraggingOver(false);
    
    const canGenerate = !isLoading && selfies.length >= MIN_FILES && selfies.length <= MAX_FILES;

    const resetState = () => {
        setSelfies([]);
        setSelfiePreviews([]);
        setGeneratedHeadshots([]);
        setIsLoading(false);
        setError(null);
    }
    
    // This component has a custom layout, so we don't use ToolPageLayout
    return (
        <main className="flex-1 overflow-y-auto p-4 sm:p-8 animate-fade-in">
            <div className="container mx-auto">
                <div className="text-center mb-8 sm:mb-12">
                     <div className="inline-flex items-center justify-center gap-3 bg-gray-800/50 border border-gray-700 rounded-full py-2 px-6 mb-4">
                        <HeadshotIcon className="w-6 h-6 text-blue-400" />
                        <h2 className="text-sm font-bold uppercase tracking-wider text-blue-300">AI Portrait Tool</h2>
                    </div>
                    <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-gray-100">
                        AI Headshot Generator
                    </h1>
                    <p className="max-w-3xl mx-auto mt-4 text-lg text-gray-400">
                        Create photorealistic, professional headshots online in minutes for free. Turn your casual selfies into corporate-quality photos for LinkedIn, resumes, and business profiles without the need for a photo studio.
                    </p>
                </div>

                <div className="w-full max-w-5xl mx-auto bg-gray-800/50 border border-gray-700/50 rounded-2xl shadow-2xl p-4 sm:p-8">
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center gap-4 p-8 min-h-[400px]">
                            <Spinner />
                            <p className="text-lg font-semibold text-gray-300">Generating your headshots...</p>
                            <p className="text-sm text-gray-400">This may take a few moments. The AI is creating multiple professional options for you.</p>
                        </div>
                    ) : generatedHeadshots.length > 0 ? (
                         <div className="text-center">
                            <h3 className="text-2xl font-bold text-white mb-2">Your Professional Headshots are Ready!</h3>
                            <p className="text-gray-400 mb-6">Download your favorite high-resolution images or start over to generate new styles.</p>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {generatedHeadshots.map((url, i) => (
                                    <div key={i} className="flex flex-col gap-2 group">
                                        <img src={url} alt={`Generated Headshot ${i + 1}`} className="w-full aspect-[4/5] object-cover rounded-lg"/>
                                        <a href={url} download={`headshot-${i+1}.png`} className="flex items-center justify-center gap-2 w-full bg-green-600 hover:bg-green-500 text-white font-bold py-2 rounded-lg transition-colors text-sm">
                                            <DownloadIcon className="w-5 h-5"/> Download
                                        </a>
                                    </div>
                                ))}
                            </div>
                            <button onClick={resetState} className="mt-8 bg-red-600 hover:bg-red-500 text-white font-bold py-3 px-8 rounded-lg transition-colors">Start Over</button>
                        </div>
                    ) : (
                        <div className="flex flex-col lg:flex-row gap-8">
                            <div className="w-full lg:w-1/2 flex flex-col gap-4">
                                <h3 className="text-xl font-bold text-white">Upload Your Selfies ({selfies.length}/{MAX_FILES})</h3>
                                <div className="bg-black/20 p-4 rounded-lg">
                                    <ul className="list-disc list-inside text-sm text-gray-400 space-y-1">
                                        <li>Upload <strong>{MIN_FILES}-{MAX_FILES} clear selfies</strong> of your face.</li>
                                        <li>Use varied angles, expressions, and backgrounds.</li>
                                        <li>Ensure good, consistent lighting. Avoid sunglasses, hats, and heavy makeup.</li>
                                    </ul>
                                </div>
                                <label 
                                  htmlFor="headshot-upload" 
                                  onDrop={handleDrop}
                                  onDragOver={handleDragOver}
                                  onDragLeave={handleDragLeave}
                                  className={`relative flex flex-col items-center justify-center w-full flex-grow border-2 border-dashed rounded-lg cursor-pointer transition-colors ${isDraggingOver ? 'bg-blue-500/20 border-blue-400' : 'bg-gray-800/50 border-gray-600 hover:bg-gray-700/50'}`}
                                >
                                    <UploadIcon className="w-10 h-10 mb-2 text-gray-400" />
                                    <p className="mb-1 font-semibold text-gray-300">Click to upload or drag & drop</p>
                                    <p className="text-xs text-gray-500">{selfies.length} / {MAX_FILES} images selected</p>
                                    <input id="headshot-upload" type="file" multiple className="hidden" accept="image/*" onChange={handleFileChange} disabled={selfies.length >= MAX_FILES}/>
                                </label>
                            </div>
                            <div className="w-full lg:w-1/2 flex flex-col gap-4">
                                <div className="min-h-[200px] bg-black/20 rounded-lg p-3">
                                    {selfiePreviews.length > 0 ? (
                                        <div className="grid grid-cols-4 gap-3">
                                            {selfiePreviews.map((preview, index) => (
                                                <div key={index} className="relative aspect-square">
                                                    <img src={preview} alt={`Selfie ${index + 1}`} className="w-full h-full object-cover rounded-md" />
                                                    <button onClick={() => removeSelfie(index)} className="absolute -top-1.5 -right-1.5 bg-red-600 rounded-full text-white p-0.5 shadow-md">
                                                        <XCircleIcon className="w-5 h-5"/>
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="flex items-center justify-center h-full text-gray-500">Your uploaded photos will appear here.</div>
                                    )}
                                </div>
                                {error && <p className="text-sm text-red-400 text-center">{error}</p>}
                                <button onClick={handleGenerate} disabled={!canGenerate} className="w-full bg-gradient-to-br from-purple-600 to-indigo-500 text-white font-bold py-4 px-6 rounded-lg transition-all duration-300 ease-in-out shadow-lg shadow-purple-500/20 hover:shadow-xl hover:shadow-purple-500/40 hover:-translate-y-px active:scale-95 active:shadow-inner text-lg disabled:opacity-50 disabled:cursor-not-allowed">
                                    <div className="flex items-center justify-center gap-2">
                                        <SparkleIcon className="w-6 h-6"/> Generate Headshots
                                    </div>
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                <div className="max-w-5xl mx-auto mt-16 text-gray-300 space-y-12">
                    <section>
                        <h2 className="text-3xl font-bold text-center mb-8 text-white">How Our AI Headshot Generator Works</h2>
                        <div className="grid md:grid-cols-4 gap-8 text-center">
                            <div className="bg-black/20 p-6 rounded-lg">
                                <p className="text-4xl font-bold text-blue-400 mb-2">1</p>
                                <h3 className="font-bold text-lg text-white mb-2">Upload Your Selfies</h3>
                                <p className="text-sm">Provide {MIN_FILES}-{MAX_FILES} clear photos of yourself so our AI can accurately learn your unique facial features.</p>
                            </div>
                            <div className="bg-black/20 p-6 rounded-lg">
                                <p className="text-4xl font-bold text-blue-400 mb-2">2</p>
                                <h3 className="font-bold text-lg text-white mb-2">AI Learns Your Face</h3>
                                <p className="text-sm">The AI model analyzes your photos to create a digital likeness that it can then place in new, professional scenarios.</p>
                            </div>
                             <div className="bg-black/20 p-6 rounded-lg">
                                <p className="text-4xl font-bold text-blue-400 mb-2">3</p>
                                <h3 className="font-bold text-lg text-white mb-2">Generate Headshots</h3>
                                <p className="text-sm">Click generate! The AI creates multiple, brand-new, photorealistic images of you in professional attire and settings.</p>
                            </div>
                             <div className="bg-black/20 p-6 rounded-lg">
                                <p className="text-4xl font-bold text-blue-400 mb-2">4</p>
                                <h3 className="font-bold text-lg text-white mb-2">Download & Use</h3>
                                <p className="text-sm">Receive a variety of headshot options. Download your high-resolution favorites for your resume, LinkedIn, or portfolio.</p>
                            </div>
                        </div>
                    </section>
                    
                    <section>
                        <h2 className="text-3xl font-bold text-center mb-8 text-white">Frequently Asked Questions</h2>
                        <div className="space-y-4 max-w-3xl mx-auto">
                            <div className="bg-black/20 p-4 rounded-lg"><strong className="text-white block mb-1">How many photos should I upload for the best results?</strong>For the highest quality and most accurate headshots, upload between 4 and 10 clear photos of your face. Be sure to include different angles and expressions.</div>
                            <div className="bg-black/20 p-4 rounded-lg"><strong className="text-white block mb-1">What happens to my uploaded photos? Are they secure?</strong>Your photos are sent securely to the AI model for the sole purpose of generating your headshots. They are not stored on our servers or used for any other purpose. Your privacy is our top priority.</div>
                            <div className="bg-black/20 p-4 rounded-lg"><strong className="text-white block mb-1">Can I use these headshots for professional purposes like LinkedIn?</strong>Yes! The headshots are high-resolution and designed to be perfect for professional profiles on platforms like LinkedIn, as well as for resumes, company websites, and more.</div>
                            <div className="bg-black/20 p-4 rounded-lg"><strong className="text-white block mb-1">Will the generated headshot look exactly like me?</strong>The AI is trained to maintain your core facial features and identity. The more high-quality and varied photos you provide, the more accurate the generated headshot will be. The tool will not change your fundamental appearance.</div>
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

export default HeadshotGeneratorPage;