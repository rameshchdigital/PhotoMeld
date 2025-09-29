/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState, useEffect, useCallback } from 'react';
import { generateBabyImage } from '../services/geminiService';
import { UploadIcon, SparkleIcon, DownloadIcon, BabyIcon } from './icons';
import Spinner from './Spinner';
import { Page } from '../App';
import { ToolCategory } from '../services/toolData';
import RelatedTools from './RelatedTools';

interface BabyGeneratorPageProps {
    onNavigate: (page: Page) => void;
    currentPage: Page;
    allTools: ToolCategory[];
}

const BabyGeneratorPage: React.FC<BabyGeneratorPageProps> = ({ onNavigate, currentPage, allTools }) => {
    const [parent1File, setParent1File] = useState<File | null>(null);
    const [parent1Preview, setParent1Preview] = useState<string | null>(null);
    const [parent2File, setParent2File] = useState<File | null>(null);
    const [parent2Preview, setParent2Preview] = useState<string | null>(null);
    const [babyUrl, setBabyUrl] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const currentCategory = allTools.find(cat => cat.tools.some(tool => tool.page === currentPage));

    const resetState = () => {
        setParent1File(null);
        setParent1Preview(null);
        setParent2File(null);
        setParent2Preview(null);
        setBabyUrl(null);
        setIsLoading(false);
        setError(null);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, parent: 'parent1' | 'parent2') => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const setFile = parent === 'parent1' ? setParent1File : setParent2File;
            const setPreview = parent === 'parent1' ? setParent1Preview : setParent2Preview;
            setFile(file);
            setPreview(URL.createObjectURL(file));
        }
    };
    
    useEffect(() => {
      return () => {
        if (parent1Preview) URL.revokeObjectURL(parent1Preview);
        if (parent2Preview) URL.revokeObjectURL(parent2Preview);
        if (babyUrl) URL.revokeObjectURL(babyUrl);
      };
    }, [parent1Preview, parent2Preview, babyUrl]);

    const handleGenerate = async () => {
        if (!parent1File || !parent2File) {
            setError('Please upload photos for both parents.');
            return;
        }
        setIsLoading(true);
        setError(null);
        try {
            const resultUrl = await generateBabyImage(parent1File, parent2File);
            setBabyUrl(resultUrl);
        } catch (e: any) {
            console.error(e);
            setError(e.message || 'An unknown error occurred while generating the image.');
        } finally {
            setIsLoading(false);
        }
    };

    const Uploader: React.FC<{ parent: 'parent1' | 'parent2', file: File | null, preview: string | null }> = ({ parent, file, preview }) => (
      <label className="w-full aspect-square flex flex-col items-center justify-center p-4 border-2 border-dashed border-gray-600 rounded-lg cursor-pointer bg-gray-800/50 hover:bg-gray-700/50 transition-colors">
        {preview ? (
            <img src={preview} alt={`Parent ${parent === 'parent1' ? 1 : 2} preview`} className="w-full h-full object-cover rounded-md"/>
        ) : (
            <>
                <UploadIcon className="w-10 h-10 mb-2 text-gray-400" />
                <p className="font-semibold text-gray-300">Upload Parent {parent === 'parent1' ? 1 : 2} Photo</p>
            </>
        )}
        <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileChange(e, parent)} />
      </label>
    );

    return (
        <main className="flex-1 overflow-y-auto p-4 sm:p-8 animate-fade-in">
            <div className="container mx-auto">
                <div className="text-center mb-8 sm:mb-12">
                    <div className="inline-flex items-center justify-center gap-3 bg-gray-800/50 border border-gray-700 rounded-full py-2 px-6 mb-4">
                        <BabyIcon className="w-6 h-6 text-blue-400" />
                        <h2 className="text-sm font-bold uppercase tracking-wider text-blue-300">AI Tool</h2>
                    </div>
                    <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-gray-100">
                        AI Baby Generator
                    </h1>
                    <p className="max-w-3xl mx-auto mt-4 text-lg text-gray-400">
                        Ever wondered what your future baby might look like? Upload photos of you and your partner, and our AI will create a fun, photorealistic prediction by blending your features.
                    </p>
                </div>
                
                <div className="w-full max-w-5xl mx-auto bg-gray-800/50 border border-gray-700/50 rounded-2xl shadow-2xl p-4 sm:p-8">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
                        <Uploader parent="parent1" file={parent1File} preview={parent1Preview} />
                        
                        <div className="flex flex-col items-center gap-4 text-center">
                            {isLoading ? (
                                <>
                                    <Spinner />
                                    <p className="font-semibold text-gray-300">AI is working its magic...</p>
                                </>
                            ) : babyUrl ? (
                                <div className="flex flex-col items-center gap-4">
                                    <h3 className="text-xl font-bold text-white">Here is Your Future Baby!</h3>
                                    <img src={babyUrl} alt="Generated baby" className="w-full max-w-[250px] aspect-square object-cover rounded-lg shadow-lg"/>
                                    <a href={babyUrl} download="ai-baby.png" className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-500 text-white font-bold py-3 px-6 rounded-lg transition-colors">
                                        <DownloadIcon className="w-5 h-5"/> Download
                                    </a>
                                </div>
                            ) : (
                                <>
                                    <p className="text-5xl font-bold text-gray-500">+</p>
                                    <button onClick={handleGenerate} disabled={!parent1File || !parent2File || isLoading} className="w-full bg-gradient-to-br from-purple-600 to-indigo-500 text-white font-bold py-4 px-6 rounded-lg transition-all duration-300 ease-in-out shadow-lg shadow-purple-500/20 hover:shadow-xl hover:shadow-purple-500/40 hover:-translate-y-px active:scale-95 active:shadow-inner text-lg disabled:opacity-50">
                                        <div className="flex items-center justify-center gap-2">
                                            <SparkleIcon className="w-6 h-6"/>
                                            <span>Generate Baby Photo</span>
                                        </div>
                                    </button>
                                </>
                            )}
                             {error && <p className="text-sm text-red-400 text-center">{error}</p>}
                             {babyUrl && <button onClick={resetState} className="w-full bg-red-600 hover:bg-red-500 text-white font-bold py-3 px-6 rounded-lg">Start Over</button>}
                        </div>

                        <Uploader parent="parent2" file={parent2File} preview={parent2Preview} />
                    </div>
                </div>

                 <div className="max-w-5xl mx-auto mt-16 text-gray-300 space-y-12">
                    <section>
                        <h2 className="text-3xl font-bold text-center mb-8 text-white">How It Works</h2>
                        <div className="grid md:grid-cols-3 gap-8 text-center">
                            <div className="bg-black/20 p-6 rounded-lg"><p className="text-4xl font-bold text-blue-400 mb-2">1</p><h3 className="font-bold text-lg text-white mb-2">Upload Photos</h3><p className="text-sm">Select clear, front-facing photos for both parents to provide the AI with the best references.</p></div>
                            <div className="bg-black/20 p-6 rounded-lg"><p className="text-4xl font-bold text-blue-400 mb-2">2</p><h3 className="font-bold text-lg text-white mb-2">Generate Image</h3><p className="text-sm">Click the generate button. Our AI will analyze the key facial features of both parents.</p></div>
                            <div className="bg-black/20 p-6 rounded-lg"><p className="text-4xl font-bold text-blue-400 mb-2">3</p><h3 className="font-bold text-lg text-white mb-2">See the Result</h3><p className="text-sm">In just a few moments, you'll see a photorealistic portrait of what your future child could look like.</p></div>
                        </div>
                    </section>
                    <section>
                        <h2 className="text-3xl font-bold text-center mb-8 text-white">Frequently Asked Questions</h2>
                        <div className="space-y-4 max-w-3xl mx-auto">
                            <div className="bg-black/20 p-4 rounded-lg"><strong className="text-white block mb-1">How accurate is the baby generator?</strong>This tool is for entertainment purposes only. It creates a fun, artistic impression by blending the parents' features, but it is not a scientific prediction of your future child's appearance.</div>
                            <div className="bg-black/20 p-4 rounded-lg"><strong className="text-white block mb-1">What kind of photos should I use for best results?</strong>Clear, well-lit photos where the face is clearly visible and looking towards the camera work best. Avoid photos with sunglasses, hats, or heavy shadows.</div>
                            <div className="bg-black/20 p-4 rounded-lg"><strong className="text-white block mb-1">Are my uploaded photos stored or kept private?</strong>Yes, your privacy is important. Images are sent securely for processing and are not stored on our servers or used for any other purpose.</div>
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

export default BabyGeneratorPage;