/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState, useCallback, useRef, useEffect } from 'react';
import { ReactCompareSlider } from 'react-compare-slider';

import StartScreen from './StartScreen';
import EditorCanvas, { EditorCanvasRef, Selection } from './EditorCanvas';

import Spinner from './Spinner';
import InfoModal from './InfoModal';
import BatchScreen from './BatchScreen';
import {
  generateEditedImage,
  generateFilteredImage,
  generateAdjustedImage,
  generateEnhancedImage,
  generateUpscaledImage,
  generateColorizedImage,
  generateFaceRetouchImage,
// FIX: Import missing function generateBackgroundReplacement.
  generateBackgroundReplacement,
  generateRemovedBackground,
  generateFaceSwapImage,
  generatePosedImage,
  generateRestyledImage,
  generateImageFromText,
  generateLogo,
  generateHeadshot,
  generatePassportPhoto,
  generateHairstyleChange,
} from '../services/geminiService';
import {
  saveBatchSession,
  loadBatchSession,
  clearBatchSession,
  checkForSavedSession,
} from '../services/batchService';
// FIX: Import missing icon QuestionMarkCircleIcon.
import { MagicWandIcon, FaceIcon, PaletteIcon, SunIcon, QuestionMarkCircleIcon, RectangleIcon, LassoIcon, WandIcon, ClearSelectionIcon } from './icons';

type Tab = 'edit' | 'portrait' | 'creative' | 'adjust';
export type ProcessingStatus = 'pending' | 'processing' | 'done' | 'error';
export type SelectionTool = 'rectangle' | 'lasso' | 'magicWand';

interface FullPhotoEditorPageProps {
}


const FullPhotoEditorPage: React.FC<FullPhotoEditorPageProps> = () => {
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [isBatchMode, setIsBatchMode] = useState<boolean>(false);
  
  const [history, setHistory] = useState<string[]>([]);
  const [redoHistory, setRedoHistory] = useState<string[]>([]);
  
  const [processingStatus, setProcessingStatus] = useState<{ [key: string]: ProcessingStatus }>({});
  const [processedImageUrls, setProcessedImageUrls] = useState<{ [key: string]: string }>({});

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>('edit');
  
  const [editPrompt, setEditPrompt] = useState('');
  const [activeSelectionTool, setActiveSelectionTool] = useState<SelectionTool>('rectangle');
  const [selection, setSelection] = useState<Selection | null>(null);
  const [magicWandTolerance, setMagicWandTolerance] = useState<number>(30);
  
  const [crop, setCrop] = useState<{ x: number, y: number, width: number, height: number } | null>(null);
  const [aspect, setAspect] = useState<number | undefined>(undefined);
  const [isCropping, setIsCropping] = useState(false);

  const [hasSavedSession, setHasSavedSession] = useState(false);

  const imageRef = useRef<HTMLImageElement>(null);
  const canvasRef = useRef<EditorCanvasRef>(null);

  const imageFile = imageFiles.length > 0 && !isBatchMode ? imageFiles[0] : null;
  const imageUrl = imageUrls.length > 0 && !isBatchMode ? imageUrls[0] : null;

  useEffect(() => {
    setHasSavedSession(checkForSavedSession());
  }, []);

  const resetState = () => {
    imageUrls.forEach(url => {
        if (url.startsWith('blob:')) URL.revokeObjectURL(url);
    });
    Object.values(processedImageUrls).forEach(url => {
        if (typeof url === 'string' && url.startsWith('blob:')) URL.revokeObjectURL(url);
    });
  
    setImageFiles([]);
    setImageUrls([]);
    setIsBatchMode(false);
    setHistory([]);
    setRedoHistory([]);
    setIsLoading(false);
    setError(null);
    setActiveTab('edit');
    setEditPrompt('');
    setCrop(null);
    setAspect(undefined);
    setIsCropping(false);
    setProcessingStatus({});
    setProcessedImageUrls({});
    setSelection(null);
    setActiveSelectionTool('rectangle');
    clearBatchSession();
    setHasSavedSession(false);
  };
  
  const handleFileSelect = (files: FileList | null) => {
    if (files && files.length > 0) {
      resetState();
      const filesArray = Array.from(files);
      setImageFiles(filesArray);
      setImageUrls(filesArray.map(file => URL.createObjectURL(file)));
      
      if (filesArray.length > 1) {
        setIsBatchMode(true);
        const initialStatus: { [key: string]: ProcessingStatus } = {};
        filesArray.forEach(file => {
          initialStatus[file.name] = 'pending';
        });
        setProcessingStatus(initialStatus);
      } else {
        setIsBatchMode(false);
      }
    }
  };

  const updateImage = (newImageUrl: string) => {
    if (imageUrl) {
      setHistory(prev => [...prev, imageUrl]);
    }
    setImageUrls([newImageUrl]);
    setRedoHistory([]); 
    setSelection(null); 

    fetch(newImageUrl)
      .then(res => res.blob())
      .then(blob => {
        const newFile = new File([blob], imageFile?.name || 'edited.png', { type: blob.type });
        setImageFiles([newFile]);
      });
  };

  const handleApiCall = useCallback(async (apiFn: () => Promise<string>) => {
    if (!imageFile) {
      setError("No image file is available for editing.");
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const newImageUrl = await apiFn();
      updateImage(newImageUrl);
    } catch (e: any) {
      console.error(e);
      setError(e.message || "An unknown error occurred.");
    } finally {
      setIsLoading(false);
    }
  }, [imageFile, imageUrl]);

  const handleGenerativeEdit = useCallback(async () => {
    if (!imageFile || !selection || !canvasRef.current) {
        setError("Please make a selection on the image before generating.");
        return;
    }
    setIsLoading(true);
    setError(null);
    try {
        const maskFile = await canvasRef.current.generateMask();
        if (!maskFile) {
            throw new Error("Could not generate a mask from the selection.");
        }
        const newImageUrl = await generateEditedImage(imageFile, maskFile, editPrompt);
        updateImage(newImageUrl);
    } catch (e: any) {
        console.error(e);
        setError(e.message || "An unknown error occurred during the generative edit.");
    } finally {
        setIsLoading(false);
    }
}, [imageFile, selection, editPrompt]);

  const handleApplyBatchEdit = async (editFn: (file: File) => Promise<string>) => {
    if (!isBatchMode || imageFiles.length === 0) return;
  
    setIsLoading(true);
    setError(null);
  
    for (const file of imageFiles) {
      if (processingStatus[file.name] === 'done') {
        continue;
      }
  
      try {
        setProcessingStatus(prev => ({ ...prev, [file.name]: 'processing' }));
        const resultUrl = await editFn(file);
        setProcessedImageUrls(prev => ({ ...prev, [file.name]: resultUrl }));
        setProcessingStatus(prev => ({ ...prev, [file.name]: 'done' }));
      } catch (e: any) {
        console.error(`Error processing ${file.name}:`, e);
        setError(`Failed to process ${file.name}. Please try again.`);
        setProcessingStatus(prev => ({ ...prev, [file.name]: 'error' }));
      }
    }
  
    setIsLoading(false);
  };

  const handleSaveSession = async () => {
    if (!isBatchMode || imageFiles.length === 0) return;
    setIsLoading(true);
    setError(null);
    try {
      await saveBatchSession(imageFiles, processingStatus, processedImageUrls);
      alert('Session saved successfully!');
    } catch (e: any) {
      setError(e.message || 'Failed to save session.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleResumeSession = async () => {
    setIsLoading(true);
    setError(null);
    const sessionData = await loadBatchSession();
    if (sessionData) {
      setImageFiles(sessionData.imageFiles);
      setImageUrls(sessionData.imageUrls);
      setProcessingStatus(sessionData.processingStatus);
      setProcessedImageUrls(sessionData.processedImageUrls);
      setIsBatchMode(true);
      setHasSavedSession(false);
    } else {
      setError('Could not load the saved session. It might be corrupted.');
      clearBatchSession();
      setHasSavedSession(false);
    }
    setIsLoading(false);
  };

  const handleUndo = () => {
    if (history.length > 0 && imageUrl) {
      const previousImage = history[history.length - 1];
      setRedoHistory(prev => [imageUrl, ...prev]);
      setImageUrls([previousImage]);
      setHistory(history.slice(0, -1));
    }
  };
  
  const handleRedo = () => {
    if (redoHistory.length > 0 && imageUrl) {
        const nextImage = redoHistory[0];
        setHistory(prev => [...prev, imageUrl]);
        setImageUrls([nextImage]);
        setRedoHistory(redoHistory.slice(1));
    }
  };

  const handleApplyCrop = useCallback(() => {
    if (!crop || !imageRef.current) return;
    const image = imageRef.current;
    const canvas = document.createElement('canvas');
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    
    const cropX = crop.x * scaleX;
    const cropY = crop.y * scaleY;
    const cropWidth = crop.width * scaleX;
    const cropHeight = crop.height * scaleY;

    canvas.width = cropWidth;
    canvas.height = cropHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.drawImage(image, cropX, cropY, cropWidth, cropHeight, 0, 0, cropWidth, cropHeight);
    
    const newImageUrl = canvas.toDataURL(imageFile?.type);
    updateImage(newImageUrl);
    setIsCropping(false);
    setCrop(null);
  }, [crop, imageFile?.type]);

  if (imageUrls.length === 0) {
    return (
      <main className="flex-1 flex items-center justify-center min-h-full">
        <StartScreen 
            onFileSelect={handleFileSelect}
            hasSavedSession={hasSavedSession}
            onResumeSession={handleResumeSession}
        />
      </main>
    );
  }

  if (isBatchMode) {
    return (
      <BatchScreen
        imageFiles={imageFiles}
        imageUrls={imageUrls}
        processingStatus={processingStatus}
        processedImageUrls={processedImageUrls}
        onApplyBatchEdit={handleApplyBatchEdit}
        isLoading={isLoading}
        onSaveSession={handleSaveSession}
      />
    );
  }
  
  // Dummy panel for now. The logic for each panel is now in its own page.
  // This page is now just the "all-in-one" editor.
  const renderPanel = () => {
    // This is a simplified version of the old EditPanel
    return (
        <div className="w-full bg-gray-800/50 border border-gray-700 rounded-lg p-4 flex flex-col gap-4 animate-fade-in backdrop-blur-sm">
        <h3 className="text-xl font-bold text-center">Full Editor</h3>
        <p className="text-sm text-center text-gray-400">Use the selection tools on the image, then describe your edit below.</p>
        <div className="grid grid-cols-4 items-center gap-2 bg-black/20 p-1 rounded-md">
            {[
                { id: 'rectangle', label: 'Rectangle', Icon: RectangleIcon },
                { id: 'lasso', label: 'Lasso', Icon: LassoIcon },
                { id: 'magicWand', label: 'Magic Wand', Icon: WandIcon },
            ].map(({ id, label, Icon }) => (
            <button
                key={id}
                onClick={() => setActiveSelectionTool(id as SelectionTool)}
                className={`flex flex-col items-center justify-center gap-1 w-full font-semibold py-2 px-3 rounded-md transition-all duration-200 text-xs ${activeSelectionTool === id ? 'bg-gray-600/80 text-white' : 'text-gray-400 hover:text-white hover:bg-white/10'}`}
                title={label}
            >
                <Icon className="w-6 h-6" />
                <span>{label}</span>
            </button>
            ))}
            <button
            onClick={() => setSelection(null)}
            disabled={!selection || isLoading}
            className="flex flex-col items-center justify-center gap-1 w-full font-semibold py-2 px-3 rounded-md transition-all duration-200 text-xs text-gray-400 hover:text-white hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed"
            title="Clear Selection"
            >
            <ClearSelectionIcon className="w-6 h-6" />
            <span>Clear</span>
            </button>
      </div>

      <form onSubmit={(e) => { e.preventDefault(); handleGenerativeEdit(); }} className="w-full flex items-center gap-2">
            <input
              type="text"
              value={editPrompt}
              onChange={(e) => setEditPrompt(e.target.value)}
              placeholder={selection ? "e.g., 'remove this object'" : "First make a selection on the image"}
              className="flex-grow bg-gray-800 border border-gray-700 text-gray-200 rounded-lg p-5 text-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition w-full disabled:cursor-not-allowed disabled:opacity-60"
              disabled={isLoading || !selection}
              title="Describe the edit you want to make in the selected area"
            />
            <button
              type="submit"
              className="bg-gradient-to-br from-blue-600 to-blue-500 text-white font-bold py-5 px-8 text-lg rounded-lg transition-all duration-300 ease-in-out shadow-lg shadow-blue-500/20 hover:shadow-xl hover:shadow-blue-500/40 hover:-translate-y-px active:scale-95 active:shadow-inner disabled:from-blue-800 disabled:to-blue-700 disabled:shadow-none disabled:cursor-not-allowed disabled:transform-none"
              disabled={isLoading || !editPrompt.trim() || !selection}
              title="Apply the described edit to the selected area"
            >
              Generate
            </button>
          </form>
    </div>
    )
  }

  return (
    <main className="flex-1 p-8 overflow-auto flex flex-col items-center gap-8">
      <div className="relative w-full max-w-5xl mx-auto flex flex-col items-center gap-4">
        {error && (
          <div className="w-full bg-red-500/20 border border-red-500 text-red-300 p-4 rounded-lg animate-fade-in">
            <p className="font-bold">Error:</p>
            <p>{error}</p>
          </div>
        )}
        <div className="flex items-center gap-4">
          <button onClick={resetState} className="bg-red-600 hover:bg-red-500 text-white font-bold py-2 px-4 rounded">Start Over</button>
          <button onClick={handleUndo} disabled={history.length === 0 || isLoading} className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded disabled:opacity-50 disabled:cursor-not-allowed">Undo</button>
          <button onClick={handleRedo} disabled={redoHistory.length === 0 || isLoading} className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded disabled:opacity-50 disabled:cursor-not-allowed">Redo</button>
          <a href={imageUrl!} download={imageFile?.name || "download.png"} className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded">Download</a>
        </div>
      </div>

      <div className="relative w-full flex-grow flex items-center justify-center">
        {isLoading && !isBatchMode && (
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex flex-col items-center justify-center z-20 rounded-lg">
            <Spinner />
            <p className="text-lg font-semibold mt-4 text-gray-200">AI is thinking...</p>
          </div>
        )}
        {history.length > 0 && imageUrl ? (
          <ReactCompareSlider
            itemOne={<img
                src={history[history.length - 1]}
                alt="Before"
                className="max-w-full max-h-[60vh] object-contain rounded-lg shadow-2xl block"
            />}
            itemTwo={
                <EditorCanvas
                    ref={canvasRef}
                    imageRef={imageRef}
                    imageUrl={imageUrl}
                    activeTool={activeSelectionTool}
                    selection={selection}
                    onSelectionChange={setSelection}
                    isCropping={isCropping}
                    aspect={aspect}
                    onCropChange={setCrop}
                    magicWandTolerance={magicWandTolerance}
                />
            }
          />
        ) : (
            <EditorCanvas
              ref={canvasRef}
              imageRef={imageRef}
              imageUrl={imageUrl!}
              activeTool={activeSelectionTool}
              selection={selection}
              onSelectionChange={setSelection}
              isCropping={isCropping}
              aspect={aspect}
              onCropChange={setCrop}
              magicWandTolerance={magicWandTolerance}
            />
        )}
      </div>

      {renderPanel()}

    </main>
  );
};

export default FullPhotoEditorPage;