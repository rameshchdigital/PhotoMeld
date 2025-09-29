/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState, useEffect, useRef } from 'react';
import { generateExtendedImage } from '../services/geminiService';
import { UploadIcon, SparkleIcon, DownloadIcon, ExpandIcon } from './icons';
import Spinner from './Spinner';
import { Page } from '../App';
import { ToolCategory } from '../services/toolData';
import RelatedTools from './RelatedTools';

interface ImageExtenderPageProps {
    onNavigate: (page: Page) => void;
    currentPage: Page;
    allTools: ToolCategory[];
}

type ExtendDirection = 'top' | 'bottom' | 'left' | 'right';

const ImageExtenderPage: React.FC<ImageExtenderPageProps> = ({ onNavigate, currentPage, allTools }) => {
    const [originalFile, setOriginalFile] = useState<File | null>(null);
    const [originalUrl, setOriginalUrl] = useState<string | null>(null);
    const [extendedUrl, setExtendedUrl] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [isDraggingOver, setIsDraggingOver] = useState(false);
    const imageRef = useRef<HTMLImageElement>(null);

    const currentCategory = allTools.find(cat => cat.tools.some(tool => tool.page === currentPage));

    const resetState = () => {
        setOriginalFile(null);
        if (originalUrl) URL.revokeObjectURL(originalUrl);
        setOriginalUrl(null);
        if (extendedUrl) URL.revokeObjectURL(extendedUrl);
        setExtendedUrl(null);
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
    
    useEffect(() => {
        return () => {
            if (originalUrl) URL.revokeObjectURL(originalUrl);
            if (extendedUrl) URL.revokeObjectURL(extendedUrl);
        };
    }, [originalUrl, extendedUrl]);

    const handleExtend = async (direction: ExtendDirection) => {
        const imageToExtendUrl = extendedUrl || originalUrl;
        if (!imageToExtendUrl) {
            setError("No image available to extend.");
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const img = new Image();
            img.crossOrigin = "anonymous";
            img.src = imageToExtendUrl;
            await new Promise((resolve, reject) => {
                img.onload = resolve;
                img.onerror = reject;
            });
            
            const { naturalWidth: w, naturalHeight: h } = img;
            let newW = w, newH = h, x = 0, y = 0;

            switch (direction) {
                case 'top': newH = h * 2; y = h; break;
                case 'bottom': newH = h * 2; y = 0; break;
                case 'left': newW = w * 2; x = w; break;
                case 'right': newW = w * 2; x = 0; break;
            }

            const canvas = document.createElement('canvas');
            canvas.width = newW;
            canvas.height = newH;
            const ctx = canvas.getContext('2d');
            if (!ctx) throw new Error("Could not create canvas context");
            
            ctx.drawImage(img, x, y);
            const extendedImageBlob = await new Promise<Blob | null>(res => canvas.toBlob(res, 'image/png'));
            if (!extendedImageBlob) throw new Error("Could not create blob from canvas");

            const maskCanvas = document.createElement('canvas');
            maskCanvas.width = newW;
            maskCanvas.height = newH;
            const maskCtx = maskCanvas.getContext('2d');
            if (!maskCtx) throw new Error("Could not create mask context");

            maskCtx.fillStyle = 'black';
            maskCtx.fillRect(0, 0, newW, newH);
            maskCtx.fillStyle = 'white';
            maskCtx.fillRect(x, y, w, h);
            maskCtx.globalCompositeOperation = 'xor';
            maskCtx.fillRect(0, 0, newW, newH);
            
            const maskBlob = await new Promise<Blob | null>(res => maskCanvas.toBlob(res, 'image/png'));
            if (!maskBlob) throw new Error("Could not create mask blob");
            
            const extendedImageFile = new File([extendedImageBlob], 'extended.png', { type: 'image/png' });
            const maskFile = new File([maskBlob], 'mask.png', { type: 'image/png' });

            const resultUrl = await generateExtendedImage(extendedImageFile, maskFile);
            setExtendedUrl(resultUrl);

            const res = await fetch(resultUrl);
            const blob = await res.blob();
            const newFile = new File([blob], originalFile?.name || 'extended.png', { type: blob.type });
            setOriginalFile(newFile);

        } catch (e: any) {
            console.error(e);
            setError(e.message || 'An unknown error occurred while extending the image.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <main className="flex-1 overflow-y-auto p-4 sm:p-8 animate-fade-in">
            <div className="container mx-auto">
                <div className="text-center mb-8 sm:mb-12">
                     <div className="inline-flex items-center justify-center gap-3 bg-gray-800/50 border border-gray-700 rounded-full py-2 px-6 mb-4">
                        <ExpandIcon className="w-6 h-6 text-blue-400" />
                        <h2 className="text-sm font-bold uppercase tracking-wider text-blue-300">AI Tool</h2>
                    </div>
                    <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-gray-100">
                        AI Image Extender & Outpainting
                    </h1>
                    <p className="max-w-3xl mx-auto mt-4 text-lg text-gray-400">
                        Expand the boundaries of your photos with generative fill. Uncrop images, change aspect ratios, and create larger compositions as the AI intelligently fills in the missing parts of your scene.
                    </p>
                </div>
                
                 <div className="w-full max-w-5xl mx-auto bg-gray-800/50 border border-gray-700/50 rounded-2xl shadow-2xl p-4 sm:p-8">
                    {!originalUrl ? (
                         <div className="flex flex-col items-center justify-center gap-6 py-12">
                            <label htmlFor="extender-upload" onDragOver={(e) => { e.preventDefault(); setIsDraggingOver(true); }} onDragLeave={() => setIsDraggingOver(false)} onDrop={(e) => { e.preventDefault(); setIsDraggingOver(false); handleFileSelect(e.dataTransfer.files); }} className={`relative w-full max-w-lg flex flex-col items-center justify-center p-10 border-4 rounded-2xl cursor-pointer group transition-all duration-300 ${isDraggingOver ? 'bg-blue-500/20 border-dashed border-blue-400' : 'bg-gray-900/50 border-dashed border-gray-600 hover:border-blue-500 hover:bg-gray-800/50'}`}><UploadIcon className="w-16 h-16 text-gray-500 group-hover:text-blue-400 transition-colors" /><p className="mt-4 text-xl font-semibold text-gray-300">Drag & Drop or Click to Upload</p></label>
                            <input id="extender-upload" type="file" className="hidden" accept="image/*" onChange={(e) => handleFileSelect(e.target.files)} />
                        </div>
                    ) : (
                        <div className="flex flex-col items-center gap-6">
                            <div className="w-full max-w-3xl relative bg-black/30 rounded-lg overflow-hidden border border-gray-700">
                                {isLoading && (<div className="absolute inset-0 bg-black/70 backdrop-blur-sm flex flex-col items-center justify-center z-20"><Spinner /><p className="text-lg font-semibold mt-4 text-gray-200">Extending Scene...</p></div>)}
                                <img ref={imageRef} src={extendedUrl || originalUrl} alt="Image to extend" className="w-full h-auto object-contain"/>
                            </div>
                            <div className="flex flex-col sm:flex-row items-center gap-4">
                                <div className="flex items-center gap-2">
                                    <button onClick={() => handleExtend('left')} disabled={isLoading} className="font-bold py-3 px-5 rounded-lg bg-white/10 hover:bg-white/20 disabled:opacity-50">Extend Left</button>
                                    <div className="flex flex-col gap-2">
                                        <button onClick={() => handleExtend('top')} disabled={isLoading} className="font-bold py-3 px-5 rounded-lg bg-white/10 hover:bg-white/20 disabled:opacity-50">Extend Top</button>
                                        <button onClick={() => handleExtend('bottom')} disabled={isLoading} className="font-bold py-3 px-5 rounded-lg bg-white/10 hover:bg-white/20 disabled:opacity-50">Extend Bottom</button>
                                    </div>
                                    <button onClick={() => handleExtend('right')} disabled={isLoading} className="font-bold py-3 px-5 rounded-lg bg-white/10 hover:bg-white/20 disabled:opacity-50">Extend Right</button>
                                </div>
                                <div className="flex items-center gap-3">
                                     <a href={extendedUrl || originalUrl} download="extended-image.png" className={`flex items-center justify-center gap-2 bg-green-600 text-white font-bold py-3 px-5 rounded-lg transition-opacity ${extendedUrl || originalUrl ? 'opacity-100 hover:bg-green-500' : 'opacity-50 cursor-not-allowed'}`}><DownloadIcon className="w-5 h-5"/> Download</a>
                                     <button onClick={resetState} className="bg-red-600 hover:bg-red-500 text-white font-bold py-3 px-5 rounded-lg">Start Over</button>
                                </div>
                            </div>
                             {error && <p className="text-sm text-red-400 text-center">{error}</p>}
                        </div>
                    )}
                </div>

                <div className="max-w-5xl mx-auto mt-16 text-gray-300 space-y-12">
                    <section><h2 className="text-3xl font-bold text-center mb-8 text-white">Features of AI Image Extender</h2><ul className="grid md:grid-cols-2 gap-6 text-base"><li className="bg-black/20 p-6 rounded-lg flex items-start gap-4"><SparkleIcon className="w-6 h-6 text-blue-400 mt-1 flex-shrink-0" /><div><strong className="text-white">Content-Aware Fill:</strong> The AI understands the context of your image—lighting, shadows, textures, and objects—to create seamless, logical extensions that look completely natural.</div></li><li className="bg-black/20 p-6 rounded-lg flex items-start gap-4"><SparkleIcon className="w-6 h-6 text-blue-400 mt-1 flex-shrink-0" /><div><strong className="text-white">Change Aspect Ratios:</strong> Effortlessly turn a vertical portrait photo into a horizontal landscape masterpiece for a desktop wallpaper, or a square image into a vertical banner for social media stories.</div></li><li className="bg-black/20 p-6 rounded-lg flex items-start gap-4"><SparkleIcon className="w-6 h-6 text-blue-400 mt-1 flex-shrink-0" /><div><strong className="text-white">Uncrop Photos Magically:</strong> Magically recover parts of a photo that were cropped out or never captured in the first place. Fix poorly framed shots and center your subjects perfectly.</div></li><li className="bg-black/20 p-6 rounded-lg flex items-start gap-4"><SparkleIcon className="w-6 h-6 text-blue-400 mt-1 flex-shrink-0" /><div><strong className="text-white">Creative Exploration:</strong> Go beyond simple fixes. Generate new creative compositions by expanding your original image in any direction, creating vast landscapes or adding more context to your scene.</div></li></ul></section>
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

export default ImageExtenderPage;