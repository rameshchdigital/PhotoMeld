/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState, useCallback, useEffect } from 'react';
import JSZip from 'jszip';
import { UploadIcon, FileSwapIcon, DownloadIcon } from './icons';
import Spinner from './Spinner';

type TargetFormat = 'png' | 'jpeg' | 'webp' | 'gif';

interface ConversionFile {
  originalFile: File;
  status: 'pending' | 'converting' | 'done' | 'error';
  resultUrl?: string;
  resultFileName?: string;
}

const convertFile = (file: File, format: TargetFormat, quality: number): Promise<{ url: string, fileName: string }> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (e) => {
            const img = new Image();
            if (!e.target?.result) return reject(new Error("Failed to read file"));
            img.src = e.target.result as string;
            img.onload = () => {
                const canvas = document.createElement('canvas');
                canvas.width = img.naturalWidth;
                canvas.height = img.naturalHeight;
                const ctx = canvas.getContext('2d');
                if (!ctx) return reject(new Error('Could not get canvas context'));
                ctx.drawImage(img, 0, 0);
                const mimeType = `image/${format}`;
                canvas.toBlob(
                    (blob) => {
                        if (!blob) return reject(new Error('Canvas toBlob failed'));
                        const url = URL.createObjectURL(blob);
                        const originalName = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
                        const fileName = `${originalName}.${format}`;
                        resolve({ url, fileName });
                    },
                    mimeType,
                    format === 'jpeg' ? quality : undefined
                );
            };
            img.onerror = (err) => reject(err);
        };
        reader.onerror = (err) => reject(err);
    });
};


const FileConverterPage: React.FC = () => {
    const [files, setFiles] = useState<ConversionFile[]>([]);
    const [targetFormat, setTargetFormat] = useState<TargetFormat>('png');
    const [jpegQuality, setJpegQuality] = useState<number>(90);
    const [isConverting, setIsConverting] = useState<boolean>(false);
    const [isDraggingOver, setIsDraggingOver] = useState(false);

    useEffect(() => {
        // Cleanup blob URLs on unmount
        return () => {
            files.forEach(f => {
                if (f.resultUrl) URL.revokeObjectURL(f.resultUrl);
            });
        };
    }, [files]);

    const handleFileSelect = (fileList: FileList | null) => {
        if (!fileList) return;
        const newFiles: ConversionFile[] = Array.from(fileList).map(f => ({
            originalFile: f,
            status: 'pending'
        }));
        setFiles(prev => [...prev, ...newFiles]);
    };

    const handleConvert = async () => {
        setIsConverting(true);
        
        const conversionPromises = files.map(async (fileWrapper, index): Promise<ConversionFile> => {
            if (fileWrapper.status === 'done') return fileWrapper;

            setFiles(currentFiles => {
                const updated = [...currentFiles];
                updated[index] = { ...updated[index], status: 'converting' };
                return updated;
            });

            try {
                const { url, fileName } = await convertFile(fileWrapper.originalFile, targetFormat, jpegQuality / 100);
                return { ...fileWrapper, status: 'done', resultUrl: url, resultFileName: fileName };
            } catch (error) {
                console.error('Conversion failed for', fileWrapper.originalFile.name, error);
                return { ...fileWrapper, status: 'error' };
            }
        });

        const updatedFiles = await Promise.all(conversionPromises);
        setFiles(updatedFiles);
        setIsConverting(false);
    };

    const handleDownloadAll = async () => {
        const zip = new JSZip();
        for (const file of files) {
            if (file.status === 'done' && file.resultUrl && file.resultFileName) {
                const response = await fetch(file.resultUrl);
                const blob = await response.blob();
                zip.file(file.resultFileName, blob);
            }
        }
        zip.generateAsync({ type: 'blob' }).then(content => {
            const link = document.createElement('a');
            link.href = URL.createObjectURL(content);
            link.download = 'PhotoMeld_Converted_Files.zip';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(link.href);
        });
    };

    const clearAll = () => {
        files.forEach(f => {
            if (f.resultUrl) URL.revokeObjectURL(f.resultUrl);
        });
        setFiles([]);
    };

    const Uploader = () => (
        <div className="flex flex-col items-center justify-center gap-6 py-12">
            <label
                htmlFor="converter-upload"
                onDragOver={(e) => { e.preventDefault(); setIsDraggingOver(true); }}
                onDragLeave={() => setIsDraggingOver(false)}
                onDrop={(e) => {
                    e.preventDefault();
                    setIsDraggingOver(false);
                    handleFileSelect(e.dataTransfer.files);
                }}
                className={`relative w-full max-w-lg flex flex-col items-center justify-center p-10 border-4 rounded-2xl cursor-pointer group transition-all duration-300 ${isDraggingOver ? 'bg-blue-500/20 border-dashed border-blue-400' : 'bg-gray-900/50 border-dashed border-gray-600 hover:border-blue-500 hover:bg-gray-800/50'}`}
                title="Select images to convert"
            >
                <UploadIcon className="w-16 h-16 text-gray-500 group-hover:text-blue-400 transition-colors" />
                <p className="mt-4 text-xl font-semibold text-gray-300">Drag & Drop or Click to Upload</p>
                <p className="mt-1 text-gray-400">Convert multiple images at once</p>
            </label>
            <input id="converter-upload" type="file" multiple className="hidden" accept="image/*" onChange={(e) => handleFileSelect(e.target.files)} />
        </div>
    );
    
    const allDone = files.length > 0 && files.every(f => f.status === 'done' || f.status === 'error');

    return (
        <main className="flex-1 overflow-y-auto p-4 sm:p-8 animate-fade-in">
            <div className="container mx-auto">
                <div className="text-center mb-8 sm:mb-12">
                     <div className="inline-flex items-center justify-center gap-3 bg-gray-800/50 border border-gray-700 rounded-full py-2 px-6 mb-4">
                        <FileSwapIcon className="w-6 h-6 text-blue-400" />
                        <h2 className="text-sm font-bold uppercase tracking-wider text-blue-300">Utility Tool</h2>
                    </div>
                    <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-gray-100">
                        Free Online Image Converter
                    </h1>
                    <p className="max-w-3xl mx-auto mt-4 text-lg text-gray-400">
                        Quickly and easily convert your images to JPG, PNG, WEBP, and GIF formats. Batch convert multiple files at once. All processing is done securely in your browser, so your files never leave your computer.
                    </p>
                </div>

                <div className="w-full max-w-5xl mx-auto bg-gray-800/50 border border-gray-700/50 rounded-2xl shadow-2xl p-4 sm:p-8 min-h-[500px]">
                    {files.length === 0 ? <Uploader /> : (
                        <div className="flex flex-col lg:flex-row gap-8">
                            {/* Controls */}
                            <div className="w-full lg:w-1/3 flex flex-col gap-6">
                                <h3 className="text-xl font-bold text-white">Conversion Settings</h3>
                                <div className="flex flex-col gap-2">
                                    <label className="font-semibold text-gray-300">Convert to:</label>
                                    <div className="grid grid-cols-2 gap-2">
                                        {(['png', 'jpeg', 'webp', 'gif'] as TargetFormat[]).map(format => (
                                            <button key={format} onClick={() => setTargetFormat(format)} disabled={isConverting} className={`p-3 text-center rounded-lg font-semibold transition-all text-sm uppercase ${targetFormat === format ? 'bg-blue-600 text-white' : 'bg-white/10 hover:bg-white/20'}`}>{format}</button>
                                        ))}
                                    </div>
                                </div>
                                {targetFormat === 'jpeg' && (
                                    <div className="flex flex-col gap-2 animate-fade-in">
                                        <div className="flex items-center justify-between">
                                            <label htmlFor="jpeg-quality" className="font-semibold text-gray-300">JPEG Quality</label>
                                            <span className="text-sm font-mono bg-gray-700/50 px-2 py-1 rounded">{jpegQuality}</span>
                                        </div>
                                        <input id="jpeg-quality" type="range" min="10" max="100" value={jpegQuality} onChange={e => setJpegQuality(Number(e.target.value))} disabled={isConverting} className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer" />
                                    </div>
                                )}
                                <div className="flex-grow"></div>
                                <div className="flex flex-col gap-3 mt-4">
                                    <button onClick={handleConvert} disabled={isConverting} className="w-full bg-gradient-to-br from-blue-600 to-indigo-500 text-white font-bold py-4 px-6 rounded-lg transition-all text-lg disabled:opacity-50">
                                        {isConverting ? 'Converting...' : `Convert ${files.length} Files`}
                                    </button>
                                    <button onClick={handleDownloadAll} disabled={isConverting || !allDone} className="w-full bg-gradient-to-br from-green-600 to-green-500 text-white font-bold py-3 px-5 rounded-lg transition-all disabled:opacity-50">
                                        Download All (.zip)
                                    </button>
                                    <button onClick={clearAll} disabled={isConverting} className="w-full bg-red-600 hover:bg-red-500 text-white font-bold py-2 px-4 rounded-lg transition-all disabled:opacity-50">
                                        Clear All
                                    </button>
                                </div>
                            </div>
                            {/* File List */}
                            <div className="w-full lg:w-2/3 max-h-96 lg:max-h-[500px] overflow-y-auto pr-2">
                                <div className="space-y-3">
                                    {files.map((f, i) => (
                                        <div key={i} className="bg-black/20 p-3 rounded-lg flex items-center gap-4 text-sm animate-fade-in">
                                            <div className="flex-grow">
                                                <p className="font-semibold text-gray-200 truncate">{f.originalFile.name}</p>
                                                <p className="text-gray-400">{(f.originalFile.size / 1024).toFixed(1)} KB</p>
                                            </div>
                                            <div className="w-24 text-center">
                                                {f.status === 'pending' && <span className="text-gray-400">Pending</span>}
                                                {f.status === 'converting' && <Spinner />}
                                                {f.status === 'done' && <span className="font-bold text-green-400">Done</span>}
                                                {f.status === 'error' && <span className="font-bold text-red-400">Error</span>}
                                            </div>
                                            <a href={f.resultUrl} download={f.resultFileName} className={`p-2 rounded-md transition-all ${f.status === 'done' ? 'bg-blue-600 hover:bg-blue-500 text-white' : 'bg-gray-600 text-gray-400 opacity-50 cursor-not-allowed'}`} aria-disabled={f.status !== 'done'}>
                                                <DownloadIcon className="w-5 h-5"/>
                                            </a>
                                        </div>
                                    ))}
                                    <label htmlFor="converter-upload-more" className="w-full text-center block p-3 border-2 border-dashed border-gray-600 hover:border-blue-500 rounded-lg cursor-pointer text-gray-400 hover:text-blue-400 transition-colors">
                                        + Add More Files
                                    </label>
                                    <input id="converter-upload-more" type="file" multiple className="hidden" accept="image/*" onChange={(e) => handleFileSelect(e.target.files)} />
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
};

export default FileConverterPage;