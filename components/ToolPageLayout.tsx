/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState, useEffect } from 'react';
import { ReactCompareSlider, ReactCompareSliderImage } from 'react-compare-slider';
import { UploadIcon, DownloadIcon, SparkleIcon } from './icons';
import Spinner from './Spinner';
import RelatedTools from './RelatedTools';
import { ToolCategory } from '../services/toolData';
import { Page } from '../App';

interface HowToStep {
    title: string;
    text: string;
}

interface FAQ {
    question: string;
    answer: string;
}

interface ToolPageLayoutProps {
    title: string;
    description: string;
    Icon: React.FC<{ className?: string }>;
    // FIX: Changed type from React.ReactNode to React.ReactElement to be more specific and allow for prop cloning.
    controls: React.ReactElement;
    onGenerate: (file: File) => Promise<string>;
    generateButtonText?: string;
    howToTitle: string;
    howToSteps: HowToStep[];
    faqTitle: string;
    faqs: FAQ[];
    allTools: ToolCategory[];
    currentPage: Page;
    onNavigate: (page: Page) => void;
}

const ToolPageLayout: React.FC<ToolPageLayoutProps> = ({
    title,
    description,
    Icon,
    controls,
    onGenerate,
    generateButtonText = 'Generate',
    howToTitle,
    howToSteps,
    faqTitle,
    faqs,
    allTools,
    currentPage,
    onNavigate,
}) => {
    const [originalFile, setOriginalFile] = useState<File | null>(null);
    const [originalUrl, setOriginalUrl] = useState<string | null>(null);
    const [resultUrl, setResultUrl] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [isDraggingOver, setIsDraggingOver] = useState(false);

    useEffect(() => {
        return () => {
            if (originalUrl) URL.revokeObjectURL(originalUrl);
            if (resultUrl) URL.revokeObjectURL(resultUrl);
        };
    }, [originalUrl, resultUrl]);

    const resetState = () => {
        setOriginalFile(null);
        if (originalUrl) URL.revokeObjectURL(originalUrl);
        setOriginalUrl(null);
        if (resultUrl) URL.revokeObjectURL(resultUrl);
        setResultUrl(null);
        setIsLoading(false);
        setError(null);
    };

    const handleFileSelect = (files: FileList | null) => {
        if (files && files[0]) {
            resetState();
            const file = files[0];
            setOriginalFile(file);
            setOriginalUrl(URL.createObjectURL(file));
        }
    };

    const handleGenerateClick = async () => {
        if (!originalFile) return;
        setIsLoading(true);
        setError(null);
        setResultUrl(null);
        try {
            const generatedUrl = await onGenerate(originalFile);
            setResultUrl(generatedUrl);
        } catch (e: any) {
            console.error(e);
            setError(e.message || 'An unknown error occurred.');
        } finally {
            setIsLoading(false);
        }
    };
    
    const currentCategory = allTools.find(cat => cat.tools.some(tool => tool.page === currentPage));

    const Uploader = () => (
        <div className="flex flex-col items-center justify-center gap-6 py-12">
            <label
                htmlFor="tool-page-upload"
                onDragOver={(e) => { e.preventDefault(); setIsDraggingOver(true); }}
                onDragLeave={() => setIsDraggingOver(false)}
                onDrop={(e) => {
                    e.preventDefault();
                    setIsDraggingOver(false);
                    handleFileSelect(e.dataTransfer.files);
                }}
                className={`relative w-full max-w-lg flex flex-col items-center justify-center p-10 border-4 rounded-2xl cursor-pointer group transition-all duration-300 ${isDraggingOver ? 'bg-blue-500/20 border-dashed border-blue-400' : 'bg-gray-900/50 border-dashed border-gray-600 hover:border-blue-500 hover:bg-gray-800/50'}`}
                title="Select an image"
            >
                <UploadIcon className="w-16 h-16 text-gray-500 group-hover:text-blue-400 transition-colors" />
                <p className="mt-4 text-xl font-semibold text-gray-300">Drag & Drop or Click to Upload</p>
                <p className="mt-1 text-gray-400">Start by selecting an image to edit.</p>
            </label>
            <input id="tool-page-upload" type="file" className="hidden" accept="image/*" onChange={(e) => handleFileSelect(e.target.files)} />
        </div>
    );

    return (
        <main className="flex-1 overflow-y-auto p-4 sm:p-8 animate-fade-in">
            <div className="container mx-auto">
                <div className="text-center mb-8 sm:mb-12">
                    <div className="inline-flex items-center justify-center gap-3 bg-gray-800/50 border border-gray-700 rounded-full py-2 px-6 mb-4">
                        <Icon className="w-6 h-6 text-blue-400" />
                        <h2 className="text-sm font-bold uppercase tracking-wider text-blue-300">AI Tool</h2>
                    </div>
                    <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-gray-100">{title}</h1>
                    <p className="max-w-3xl mx-auto mt-4 text-lg text-gray-400">{description}</p>
                </div>

                <div className="w-full max-w-5xl mx-auto bg-gray-800/50 border border-gray-700/50 rounded-2xl shadow-2xl p-4 sm:p-8">
                    {!originalUrl ? <Uploader /> : (
                        <div className="flex flex-col lg:flex-row gap-8">
                            <div className="w-full lg:w-2/3 relative aspect-square bg-black/30 rounded-lg overflow-hidden">
                                {isLoading && (
                                    <div className="absolute inset-0 bg-black/70 backdrop-blur-sm flex flex-col items-center justify-center z-20">
                                        <Spinner />
                                        <p className="text-lg font-semibold mt-4 text-gray-200">Processing...</p>
                                    </div>
                                )}
                                <ReactCompareSlider
                                    itemOne={<ReactCompareSliderImage src={originalUrl} alt="Original" />}
                                    itemTwo={<ReactCompareSliderImage src={resultUrl || originalUrl} alt="Result" style={{ filter: resultUrl ? 'none' : 'blur(5px)' }} />}
                                    className="w-full h-full"
                                />
                            </div>
                            <div className="w-full lg:w-1/3 flex flex-col gap-6">
                                {/* FIX: Pass isLoading prop to the cloned controls element to manage disabled states correctly. */}
                                {React.cloneElement(controls, { isLoading })}
                                <button onClick={handleGenerateClick} disabled={isLoading} className="w-full bg-gradient-to-br from-purple-600 to-indigo-500 text-white font-bold py-4 px-6 rounded-lg transition-all duration-300 ease-in-out shadow-lg shadow-purple-500/20 hover:shadow-xl hover:shadow-purple-500/40 hover:-translate-y-px active:scale-95 active:shadow-inner text-lg disabled:opacity-50">
                                    <div className="flex items-center justify-center gap-2">
                                        <SparkleIcon className="w-6 h-6"/>
                                        <span>{isLoading ? 'Processing...' : generateButtonText}</span>
                                    </div>
                                </button>
                                {error && <p className="text-sm text-red-400 text-center">{error}</p>}
                                <div className="flex-grow"></div>
                                <div className="flex items-center gap-3">
                                    <a href={resultUrl!} download="photofix-result.png" className={`w-full flex items-center justify-center gap-3 bg-green-600 text-white font-bold py-4 px-6 rounded-lg transition-opacity ${resultUrl ? 'opacity-100 hover:bg-green-500' : 'opacity-50 cursor-not-allowed'}`}>
                                        <DownloadIcon className="w-6 h-6"/> Download
                                    </a>
                                    <button onClick={resetState} className="w-full bg-red-600 hover:bg-red-500 text-white font-bold py-4 px-6 rounded-lg">Start Over</button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <div className="max-w-5xl mx-auto mt-16 text-gray-300 space-y-12">
                    <section>
                        <h2 className="text-3xl font-bold text-center mb-8 text-white">{howToTitle}</h2>
                        <div className={`grid md:grid-cols-${Math.min(howToSteps.length, 4)} gap-8 text-center`}>
                            {howToSteps.map((step, index) => (
                                <div className="bg-black/20 p-6 rounded-lg" key={index}>
                                    <p className="text-4xl font-bold text-blue-400 mb-2">{index + 1}</p>
                                    <h3 className="font-bold text-lg text-white mb-2">{step.title}</h3>
                                    <p className="text-sm">{step.text}</p>
                                </div>
                            ))}
                        </div>
                    </section>
                    
                    <section>
                        <h2 className="text-3xl font-bold text-center mb-8 text-white">{faqTitle}</h2>
                        <div className="space-y-4 max-w-3xl mx-auto">
                            {faqs.map((faq, index) => (
                                <div className="bg-black/20 p-4 rounded-lg" key={index}>
                                    <strong className="text-white block mb-1">{faq.question}</strong>
                                    {faq.answer}
                                </div>
                            ))}
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

export default ToolPageLayout;