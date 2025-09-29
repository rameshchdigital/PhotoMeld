/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState, useEffect, useCallback } from 'react';
import { ReactCompareSlider, ReactCompareSliderImage } from 'react-compare-slider';
import { generateMagicEditImage } from '../services/geminiService';
import { UploadIcon, SparkleIcon, DownloadIcon, MagicPencilIcon } from './icons';
import Spinner from './Spinner';
import { Page } from '../App';
import { ToolCategory } from '../services/toolData';
import RelatedTools from './RelatedTools';

interface MagicEditorPageProps {
    onNavigate: (page: Page) => void;
    currentPage: Page;
    allTools: ToolCategory[];
}

const MagicEditorPage: React.FC<MagicEditorPageProps> = ({ onNavigate, currentPage, allTools }) => {
    const [baseFile, setBaseFile] = useState<File | null>(null);
    const [baseFileUrl, setBaseFileUrl] = useState<string | null>(null);
    const [styleFile, setStyleFile] = useState<File | null>(null);
    const [styleFileUrl, setStyleFileUrl] = useState<string | null>(null);
    const [resultUrl, setResultUrl] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [prompt, setPrompt] = useState('');
    const [preserveCharacter, setPreserveCharacter] = useState(false);
    const [preserveScene, setPreserveScene] = useState(false);

    const currentCategory = allTools.find(cat => cat.tools.some(tool => tool.page === currentPage));

    const resetState = () => {
        setBaseFile(null);
        if (baseFileUrl) URL.revokeObjectURL(baseFileUrl);
        setBaseFileUrl(null);
        setStyleFile(null);
        if (styleFileUrl) URL.revokeObjectURL(styleFileUrl);
        setStyleFileUrl(null);
        if (resultUrl) URL.revokeObjectURL(resultUrl);
        setResultUrl(null);
        setIsLoading(false);
        setError(null);
        setPrompt('');
        setPreserveCharacter(false);
        setPreserveScene(false);
    };
    
    useEffect(() => {
        return () => { // Cleanup function
            if (baseFileUrl) URL.revokeObjectURL(baseFileUrl);
            if (styleFileUrl) URL.revokeObjectURL(styleFileUrl);
            if (resultUrl) URL.revokeObjectURL(resultUrl);
        };
    }, [baseFileUrl, styleFileUrl, resultUrl]);

    const handleFileSelect = (files: FileList | null, type: 'base' | 'style') => {
        if (files && files[0]) {
            const file = files[0];
            const url = URL.createObjectURL(file);
            if (type === 'base') {
                setBaseFile(file);
                setBaseFileUrl(url);
                setResultUrl(null); // Reset result when base image changes
            } else {
                setStyleFile(file);
                setStyleFileUrl(url);
            }
        }
    };
    
    const handleGenerate = useCallback(async () => {
        if (!baseFile || !prompt.trim()) {
            setError("Please upload a base image and describe your edit.");
            return;
        }
        setIsLoading(true);
        setError(null);
        setResultUrl(null);
        try {
            const newUrl = await generateMagicEditImage({
                baseImage: baseFile,
                styleImage: styleFile,
                prompt,
                preserveCharacter,
                preserveScene
            });
            setResultUrl(newUrl);
        } catch (e: any) {
            console.error(e);
            setError(e.message || 'An unknown error occurred.');
        } finally {
            setIsLoading(false);
        }
    }, [baseFile, styleFile, prompt, preserveCharacter, preserveScene]);

    return (
        <main className="flex-1 overflow-y-auto p-4 sm:p-8 animate-fade-in">
            <div className="container mx-auto">
                 <div className="text-center mb-8 sm:mb-12">
                    <div className="inline-flex items-center justify-center gap-3 bg-gray-800/50 border border-gray-700 rounded-full py-2 px-6 mb-4">
                        <MagicPencilIcon className="w-6 h-6 text-blue-400" />
                        <h2 className="text-sm font-bold uppercase tracking-wider text-blue-300">Advanced AI Editor</h2>
                    </div>
                    <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-gray-100">
                        AI Magic Editor
                    </h1>
                    <p className="max-w-3xl mx-auto mt-4 text-lg text-gray-400">
                        The ultimate tool for generative photo editing. Use conversational prompts, blend images, and preserve key elements to perform complex, multi-step edits with unparalleled control.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                    {/* Controls Column */}
                    <div className="w-full bg-gray-800/50 border border-gray-700/50 rounded-2xl shadow-2xl p-6 flex flex-col gap-6 sticky top-24">
                        <div className="grid grid-cols-2 gap-4">
                             <label htmlFor="base-upload" className="w-full aspect-square flex flex-col items-center justify-center p-4 border-2 border-dashed border-gray-600 rounded-lg cursor-pointer bg-gray-800/50 hover:bg-gray-700/50 transition-colors">
                                {baseFileUrl ? <img src={baseFileUrl} alt="Base" className="w-full h-full object-cover rounded-md"/> : <><UploadIcon className="w-10 h-10 text-gray-400"/><p className="mt-2 text-sm text-center font-semibold">Upload Base Image*</p></>}
                                <input id="base-upload" type="file" className="hidden" accept="image/*" onChange={(e) => handleFileSelect(e.target.files, 'base')} />
                            </label>
                             <label htmlFor="style-upload" className="w-full aspect-square flex flex-col items-center justify-center p-4 border-2 border-dashed border-gray-600 rounded-lg cursor-pointer bg-gray-800/50 hover:bg-gray-700/50 transition-colors">
                                {styleFileUrl ? <img src={styleFileUrl} alt="Style" className="w-full h-full object-cover rounded-md"/> : <><SparkleIcon className="w-10 h-10 text-gray-400"/><p className="mt-2 text-sm text-center font-semibold">Upload Style Image (Optional)</p></>}
                                <input id="style-upload" type="file" className="hidden" accept="image/*" onChange={(e) => handleFileSelect(e.target.files, 'style')} />
                            </label>
                        </div>
                        <div>
                            <label className="block text-lg font-semibold text-gray-200 mb-2">Describe Your Edit</label>
                            <textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder="e.g., 'Change my shirt to red and make the background a cyberpunk city at night.'" className="w-full h-32 bg-gray-900/50 border-2 border-gray-700 rounded-lg p-4 text-gray-200 focus:ring-2 focus:ring-blue-500 focus:outline-none transition" disabled={isLoading} />
                        </div>
                        <div className="space-y-3">
                            <h3 className="text-lg font-semibold text-gray-200">Preservation Controls</h3>
                             <label className="flex items-center gap-3 p-3 bg-black/20 rounded-lg cursor-pointer"><input type="checkbox" checked={preserveCharacter} onChange={(e) => setPreserveCharacter(e.target.checked)} className="h-5 w-5 rounded text-blue-500 bg-gray-700 border-gray-600 focus:ring-blue-600"/><div><p className="font-semibold text-white">Preserve Character</p><p className="text-xs text-gray-400">Keep the main person/subject unchanged and only edit the background.</p></div></label>
                             <label className="flex items-center gap-3 p-3 bg-black/20 rounded-lg cursor-pointer"><input type="checkbox" checked={preserveScene} onChange={(e) => setPreserveScene(e.target.checked)} className="h-5 w-5 rounded text-blue-500 bg-gray-700 border-gray-600 focus:ring-blue-600"/><div><p className="font-semibold text-white">Preserve Scene</p><p className="text-xs text-gray-400">Keep the background unchanged and only edit the main person/subject.</p></div></label>
                        </div>
                        <button onClick={handleGenerate} disabled={isLoading || !baseFile || !prompt.trim()} className="w-full bg-gradient-to-br from-purple-600 to-indigo-500 text-white font-bold py-4 px-6 rounded-lg transition-all text-lg disabled:opacity-50"><div className="flex items-center justify-center gap-2"><SparkleIcon className="w-6 h-6"/><span>{isLoading ? 'Generating...' : 'Generate Magic Edit'}</span></div></button>
                        {error && <p className="text-sm text-red-400 text-center">{error}</p>}
                        {(baseFileUrl || resultUrl) && <button onClick={resetState} className="w-full bg-red-600 hover:bg-red-500 text-white font-bold py-3 px-5 rounded-lg">Start Over</button>}
                    </div>
                    {/* Image Column */}
                    <div className="w-full relative aspect-square bg-black/30 rounded-2xl overflow-hidden flex items-center justify-center border border-gray-700">
                        {isLoading ? <Spinner /> : baseFileUrl ? (
                            <ReactCompareSlider itemOne={<ReactCompareSliderImage src={baseFileUrl} alt="Original" />} itemTwo={<ReactCompareSliderImage src={resultUrl || baseFileUrl} alt="Result" style={{ filter: resultUrl ? 'none' : 'blur(8px) brightness(0.8)' }} />} className="w-full h-full" />
                        ) : <p className="text-gray-500 text-center">Your image will appear here.</p>}
                        {resultUrl && <a href={resultUrl} download="magic-edit.png" className="absolute bottom-4 right-4 flex items-center justify-center gap-2 bg-green-600/80 backdrop-blur-sm text-white font-bold py-2 px-4 rounded-lg transition-all hover:bg-green-500"><DownloadIcon className="w-5 h-5"/> Download</a>}
                    </div>
                </div>
                 {currentCategory && (
                    <div className="container mx-auto mt-16">
                         <RelatedTools category={currentCategory} currentPage={currentPage} onNavigate={onNavigate} />
                    </div>
                )}
            </div>
        </main>
    );
};

export default MagicEditorPage;