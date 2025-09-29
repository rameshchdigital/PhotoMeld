/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState } from 'react';
import { generateLogo } from '../services/geminiService';
import { SparkleIcon, DownloadIcon, LogoIcon } from './icons';
import Spinner from './Spinner';
import { Page } from '../App';
import { ToolCategory } from '../services/toolData';
import RelatedTools from './RelatedTools';

interface LogoGeneratorPageProps {
    onNavigate: (page: Page) => void;
    currentPage: Page;
    allTools: ToolCategory[];
}

const LogoGeneratorPage: React.FC<LogoGeneratorPageProps> = ({ onNavigate, currentPage, allTools }) => {
    const [companyName, setCompanyName] = useState('');
    const [slogan, setSlogan] = useState('');
    const [style, setStyle] = useState('');
    const [generatedLogos, setGeneratedLogos] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const currentCategory = allTools.find(cat => cat.tools.some(tool => tool.page === currentPage));

    const handleGenerate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!companyName.trim() || !style.trim()) return;
        setIsLoading(true);
        setError(null);
        setGeneratedLogos([]);
        try {
            const logoUrls = await generateLogo(companyName, slogan, style);
            setGeneratedLogos(logoUrls);
        } catch (e: any) {
            console.error(e);
            setError(e.message || "An unknown error occurred while generating logos.");
        } finally {
            setIsLoading(false);
        }
    };
    
    return (
        <main className="flex-1 overflow-y-auto p-4 sm:p-8 animate-fade-in">
            <div className="container mx-auto">
                <div className="text-center mb-8 sm:mb-12">
                     <div className="inline-flex items-center justify-center gap-3 bg-gray-800/50 border border-gray-700 rounded-full py-2 px-6 mb-4">
                        <LogoIcon className="w-6 h-6 text-blue-400" />
                        <h2 className="text-sm font-bold uppercase tracking-wider text-blue-300">AI Tool</h2>
                    </div>
                    <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-gray-100">Free AI Logo Generator</h1>
                    <p className="max-w-3xl mx-auto mt-4 text-lg text-gray-400">Design a unique, professional logo for your business, brand, or project in seconds. Describe your vision and let our AI create multiple high-quality logo concepts for you to choose from.</p>
                </div>

                <div className="w-full max-w-5xl mx-auto bg-gray-800/50 border border-gray-700/50 rounded-2xl shadow-2xl p-4 sm:p-8">
                    <form onSubmit={handleGenerate} className="flex flex-col gap-4 max-w-2xl mx-auto">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <input type="text" value={companyName} onChange={(e) => setCompanyName(e.target.value)} placeholder="Company Name*" className="bg-gray-800 border-2 border-gray-700 text-gray-200 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none transition w-full" disabled={isLoading} required />
                            <input type="text" value={slogan} onChange={(e) => setSlogan(e.target.value)} placeholder="Slogan (Optional)" className="bg-gray-800 border-2 border-gray-700 text-gray-200 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none transition w-full" disabled={isLoading} />
                        </div>
                        <textarea value={style} onChange={(e) => setStyle(e.target.value)} placeholder="Describe the logo style, colors, and icon... e.g., 'A blue lion icon, geometric, minimalist'* " className="bg-gray-800 border-2 border-gray-700 text-gray-200 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none transition w-full min-h-[80px]" disabled={isLoading} rows={3} required />
                        <button type="submit" className="w-full bg-gradient-to-br from-purple-600 to-indigo-500 text-white font-bold py-4 px-6 rounded-lg transition-all text-lg disabled:opacity-50" disabled={isLoading || !companyName.trim() || !style.trim()}>
                            <div className="flex items-center justify-center gap-2"><SparkleIcon className="w-6 h-6"/><span>{isLoading ? 'Generating...' : 'Generate Logos'}</span></div>
                        </button>
                         {error && <p className="text-sm text-red-400 text-center">{error}</p>}
                    </form>

                    <div className="mt-8">
                        {isLoading ? (
                             <div className="flex flex-col items-center justify-center gap-4 p-8"><Spinner /><p className="text-gray-300">Generating your logos...</p></div>
                        ) : generatedLogos.length > 0 && (
                            <div className="pt-4 border-t border-gray-700 mt-4">
                                <h4 className="text-lg font-semibold text-center text-gray-200 mb-4">Your Logo Concepts</h4>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    {generatedLogos.map((logoUrl, index) => (
                                         <div key={index} className="flex flex-col gap-2 group">
                                            <div className="aspect-square bg-white rounded-lg overflow-hidden p-2">
                                                <img src={logoUrl} alt={`Generated Logo ${index + 1}`} className="w-full h-full object-contain" />
                                            </div>
                                             <a href={logoUrl} download={`logo-design-${index+1}.png`} className="flex items-center justify-center gap-2 w-full bg-green-600 hover:bg-green-500 text-white font-bold py-2 rounded-lg transition-colors text-sm"><DownloadIcon className="w-5 h-5"/> Download</a>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
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

export default LogoGeneratorPage;