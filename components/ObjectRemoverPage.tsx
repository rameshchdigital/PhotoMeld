/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState, useRef } from 'react';
import { generateEditedImage } from '../services/geminiService';
import EditorCanvas, { EditorCanvasRef, Selection } from './EditorCanvas';
import { ReactCompareSlider, ReactCompareSliderImage } from 'react-compare-slider';
import { UploadIcon, SparkleIcon, EraseIcon, RectangleIcon, LassoIcon, WandIcon, ClearSelectionIcon } from './icons';
import Spinner from './Spinner';
import RelatedTools from './RelatedTools';
import { Page } from '../App';
import { ToolCategory } from '../services/toolData';

type SelectionTool = 'rectangle' | 'lasso' | 'magicWand';

interface ObjectRemoverPageProps {
    onNavigate: (page: Page) => void;
    currentPage: Page;
    allTools: ToolCategory[];
}

const ObjectRemoverPage: React.FC<ObjectRemoverPageProps> = ({ onNavigate, currentPage, allTools }) => {
    const [originalFile, setOriginalFile] = useState<File | null>(null);
    const [originalUrl, setOriginalUrl] = useState<string | null>(null);
    const [resultUrl, setResultUrl] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [isDraggingOver, setIsDraggingOver] = useState(false);
    
    const [activeTool, setActiveTool] = useState<SelectionTool>('lasso');
    const [selection, setSelection] = useState<Selection | null>(null);
    const [tolerance, setTolerance] = useState(30);

    const imageRef = useRef<HTMLImageElement>(null);
    const canvasRef = useRef<EditorCanvasRef>(null);

    const currentCategory = allTools.find(cat => cat.tools.some(tool => tool.page === currentPage));

    const resetState = () => {
        setOriginalFile(null);
        if (originalUrl) URL.revokeObjectURL(originalUrl);
        setOriginalUrl(null);
        if (resultUrl) URL.revokeObjectURL(resultUrl);
        setResultUrl(null);
        setIsLoading(false);
        setError(null);
        setSelection(null);
    };

    const handleFileSelect = (files: FileList | null) => {
        if (files && files[0]) {
            resetState();
            const file = files[0];
            setOriginalFile(file);
            setOriginalUrl(URL.createObjectURL(file));
        }
    };

    const handleGenerate = async () => {
        if (!originalFile || !selection || !canvasRef.current) return;
        setIsLoading(true);
        setError(null);
        setResultUrl(null);
        try {
            const maskFile = await canvasRef.current.generateMask();
            if (!maskFile) throw new Error("Could not create mask.");
            const generatedUrl = await generateEditedImage(originalFile, maskFile, 'Remove the selected object and realistically reconstruct the background behind it.');
            setResultUrl(generatedUrl);
            setSelection(null);
        } catch (e: any) {
            console.error(e);
            setError(e.message || 'An unknown error occurred.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <main className="flex-1 overflow-y-auto p-4 sm:p-8 animate-fade-in">
            <div className="container mx-auto">
                 <div className="text-center mb-8 sm:mb-12">
                    <div className="inline-flex items-center justify-center gap-3 bg-gray-800/50 border border-gray-700 rounded-full py-2 px-6 mb-4"><EraseIcon className="w-6 h-6 text-blue-400" /><h2 className="text-sm font-bold uppercase tracking-wider text-blue-300">AI Tool</h2></div>
                    <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-gray-100">AI Object Remover</h1>
                    <p className="max-w-3xl mx-auto mt-4 text-lg text-gray-400">Clean up your photos perfectly. Erase unwanted objects, people, text, or blemishes from your images in seconds. Simply select what you want to remove and let our AI magically fill in the background.</p>
                </div>

                <div className="w-full max-w-5xl mx-auto bg-gray-800/50 border border-gray-700/50 rounded-2xl shadow-2xl p-4 sm:p-8">
                    {!originalUrl ? (
                         <div className="flex flex-col items-center justify-center gap-6 py-12">
                            <label htmlFor="remover-upload" onDragOver={(e) => { e.preventDefault(); setIsDraggingOver(true); }} onDragLeave={() => setIsDraggingOver(false)} onDrop={(e) => { e.preventDefault(); setIsDraggingOver(false); handleFileSelect(e.dataTransfer.files); }} className={`relative w-full max-w-lg flex flex-col items-center justify-center p-10 border-4 rounded-2xl cursor-pointer group transition-all duration-300 ${isDraggingOver ? 'bg-blue-500/20 border-dashed border-blue-400' : 'bg-gray-900/50 border-dashed border-gray-600 hover:border-blue-500 hover:bg-gray-800/50'}`}><UploadIcon className="w-16 h-16 text-gray-500 group-hover:text-blue-400 transition-colors" /><p className="mt-4 text-xl font-semibold text-gray-300">Drag & Drop or Click to Upload</p></label>
                            <input id="remover-upload" type="file" className="hidden" accept="image/*" onChange={(e) => handleFileSelect(e.target.files)} />
                        </div>
                    ) : (
                        <div className="flex flex-col lg:flex-row gap-8">
                            <div className="w-full lg:w-2/3 relative bg-black/30 rounded-lg overflow-hidden">
                                {isLoading && <div className="absolute inset-0 bg-black/70 backdrop-blur-sm flex flex-col items-center justify-center z-20"><Spinner /><p className="text-lg font-semibold mt-4 text-gray-200">Removing Object...</p></div>}
                                 <ReactCompareSlider itemOne={<ReactCompareSliderImage src={originalUrl} alt="Original" />} itemTwo={<ReactCompareSliderImage src={resultUrl || originalUrl} alt="Result" style={{ filter: resultUrl ? 'none' : 'blur(5px)' }} />} className="w-full h-full" style={{display: resultUrl ? 'block' : 'none'}} />
                                 <div style={{display: resultUrl ? 'none' : 'block'}}>
                                    <EditorCanvas ref={canvasRef} imageRef={imageRef} imageUrl={originalUrl} activeTool={activeTool} selection={selection} onSelectionChange={setSelection} isCropping={false} onCropChange={() => {}} magicWandTolerance={tolerance}/>
                                 </div>
                            </div>
                            <div className="w-full lg:w-1/3 flex flex-col gap-6">
                                <h3 className="text-xl font-bold text-white">1. Select Object to Remove</h3>
                                <div className="grid grid-cols-4 items-center gap-2 bg-black/20 p-1 rounded-md">
                                    {[{id: 'rectangle', Icon: RectangleIcon},{id: 'lasso', Icon: LassoIcon},{id: 'magicWand', Icon: WandIcon}].map(t => (
                                        <button key={t.id} onClick={() => setActiveTool(t.id as SelectionTool)} className={`flex flex-col items-center justify-center gap-1 w-full font-semibold py-2 px-3 rounded-md transition-all duration-200 text-xs ${activeTool === t.id ? 'bg-gray-600 text-white' : 'text-gray-400 hover:bg-white/10'}`}><t.Icon className="w-6 h-6"/></button>
                                    ))}
                                    <button onClick={() => setSelection(null)} disabled={!selection || isLoading} className="flex flex-col items-center justify-center gap-1 w-full font-semibold py-2 px-3 rounded-md transition-all text-xs text-gray-400 hover:bg-white/10 disabled:opacity-50"><ClearSelectionIcon className="w-6 h-6"/></button>
                                </div>
                                <h3 className="text-xl font-bold text-white">2. Click Remove</h3>
                                <button onClick={handleGenerate} disabled={isLoading || !selection} className="w-full bg-gradient-to-br from-purple-600 to-indigo-500 text-white font-bold py-4 px-6 rounded-lg transition-all text-lg disabled:opacity-50">
                                    <div className="flex items-center justify-center gap-2"><SparkleIcon className="w-6 h-6"/><span>Remove Object</span></div>
                                </button>
                                {error && <p className="text-sm text-red-400 text-center">{error}</p>}
                                <div className="flex-grow"></div>
                                <div className="flex items-center gap-3">
                                    <a href={resultUrl!} download="photofix-removed.png" className={`w-full flex items-center justify-center gap-3 bg-green-600 text-white font-bold py-4 px-6 rounded-lg transition-opacity ${resultUrl ? 'opacity-100 hover:bg-green-500' : 'opacity-50 cursor-not-allowed'}`}> Download</a>
                                    <button onClick={resetState} className="w-full bg-red-600 hover:bg-red-500 text-white font-bold py-4 px-6 rounded-lg">Start Over</button>
                                </div>
                            </div>
                        </div>
                    )}
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

export default ObjectRemoverPage;
