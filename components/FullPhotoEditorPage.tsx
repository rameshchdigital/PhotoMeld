/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState, useCallback, useRef, useEffect } from 'react';
import { ReactCompareSlider } from 'react-compare-slider';

import StartScreen from './StartScreen';
import EditorCanvas, { EditorCanvasRef, Selection } from './EditorCanvas';
import Sidebar from './Sidebar';
import EditPanel, { SelectionTool } from './EditPanel';
import PortraitPanel from './PortraitPanel';
import CreativePanel from './CreativePanel';
import AdjustAndCropPanel from './AdjustAndCropPanel';
import Spinner from './Spinner';
import BatchScreen from './BatchScreen';
import {
  generateEditedImage,
  generateFilteredImage,
  generateAdjustedImage,
  generateEnhancedImage,
  generateUpscaledImage,
  generateColorizedImage,
  generateFaceRetouchImage,
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
import { Page } from '../App';
import { ToolCategory } from '../services/toolData';
import RelatedTools from './RelatedTools';
import { MagicPencilIcon, FaceIcon, PaletteIcon, SunIcon } from './icons';


export type ProcessingStatus = 'pending' | 'processing' | 'done' | 'error';
type Tab = 'edit' | 'portrait' | 'creative' | 'adjust';


interface FullPhotoEditorPageProps {
    onNavigate: (page: Page) => void;
    currentPage: Page;
    allTools: ToolCategory[];
}


const FullPhotoEditorPage: React.FC<FullPhotoEditorPageProps> = ({ onNavigate, currentPage, allTools }) => {
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [isBatchMode, setIsBatchMode] = useState<boolean>(false);
  
  const [history, setHistory] = useState<string[]>([]);
  const [redoHistory, setRedoHistory] = useState<string[]>([]);
  
  const [processingStatus, setProcessingStatus] = useState<{ [key: string]: ProcessingStatus }>({});
  const [processedImageUrls, setProcessedImageUrls] = useState<{ [key: string]: string }>({});

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>('adjust');
  
  // Edit Panel State
  const [editPrompt, setEditPrompt] = useState('');
  const [activeSelectionTool, setActiveSelectionTool] = useState<SelectionTool>('rectangle');
  const [selection, setSelection] = useState<Selection | null>(null);
  const [magicWandTolerance, setMagicWandTolerance] = useState<number>(30);
  
  // Adjust Panel State
  const [crop, setCrop] = useState<{ x: number, y: number, width: number, height: number } | null>(null);
  const [aspect, setAspect] = useState<number | undefined>(undefined);
  const [isCropping, setIsCropping] = useState(false);
  const [previewAdjustments, setPreviewAdjustments] = useState({ brightness: 100, contrast: 100, saturation: 100 });

  // Creative Panel State
  const [generatedLogos, setGeneratedLogos] = useState<string[]>([]);

  // Portrait Panel State
  const [generatedHeadshots, setGeneratedHeadshots] = useState<string[]>([]);

  const [hasSavedSession, setHasSavedSession] = useState(false);

  const imageRef = useRef<HTMLImageElement>(null);
  const canvasRef = useRef<EditorCanvasRef>(null);

  const imageFile = imageFiles.length > 0 && !isBatchMode ? imageFiles[0] : null;
  const imageUrl = imageUrls.length > 0 && !isBatchMode ? imageUrls[0] : null;
  const currentCategory = allTools.find(cat => cat.tools.some(tool => tool.page === currentPage));


  useEffect(() => {
    setHasSavedSession(checkForSavedSession());
  }, []);

  const resetState = () => {
    imageUrls.forEach(url => { if (url.startsWith('blob:')) URL.revokeObjectURL(url); });
    Object.values(processedImageUrls).forEach(url => { if (typeof url === 'string' && url.startsWith('blob:')) URL.revokeObjectURL(url); });
  
    setImageFiles([]);
    setImageUrls([]);
    setIsBatchMode(false);
    setHistory([]);
    setRedoHistory([]);
    setIsLoading(false);
    setError(null);
    setActiveTab('adjust');
    setEditPrompt('');
    setCrop(null);
    setAspect(undefined);
    setIsCropping(false);
    setProcessingStatus({});
    setProcessedImageUrls({});
    setSelection(null);
    setActiveSelectionTool('rectangle');
    setPreviewAdjustments({ brightness: 100, contrast: 100, saturation: 100 });
    setGeneratedLogos([]);
    setGeneratedHeadshots([]);
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
        filesArray.forEach(file => { initialStatus[file.name] = 'pending'; });
        setProcessingStatus(initialStatus);
      } else {
        setIsBatchMode(false);
        setActiveTab('adjust');
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
        if (!maskFile) throw new Error("Could not generate a mask from the selection.");
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
      if (processingStatus[file.name] === 'done') continue;
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
  
  const handleApplyRealtimeAdjustments = useCallback(() => {
    const adjustments: string[] = [];
    if (previewAdjustments.brightness !== 100) adjustments.push(`brightness to ${previewAdjustments.brightness}%`);
    if (previewAdjustments.contrast !== 100) adjustments.push(`contrast to ${previewAdjustments.contrast}%`);
    if (previewAdjustments.saturation !== 100) adjustments.push(`saturation to ${previewAdjustments.saturation}%`);
    
    if (adjustments.length === 0) return;
    
    const prompt = `Apply the following photorealistic adjustments: ${adjustments.join(', ')}.`;
    
    handleApiCall(() => generateAdjustedImage(imageFile!, prompt));
    setPreviewAdjustments({ brightness: 100, contrast: 100, saturation: 100 });
  }, [previewAdjustments, handleApiCall, imageFile]);

  const handleResetAdjustments = () => {
    setPreviewAdjustments({ brightness: 100, contrast: 100, saturation: 100 });
  };
  
  const handleGenerateLogo = async (companyName: string, slogan: string, style: string) => {
    setIsLoading(true);
    setError(null);
    setGeneratedLogos([]);
    try {
        const logoUrls = await generateLogo(companyName, slogan, style);
        setGeneratedLogos(logoUrls);
    } catch (e: any) {
        setError(e.message || "Failed to generate logos.");
    } finally {
        setIsLoading(false);
    }
  };

  const handleGenerateHeadshots = async (selfies: File[]) => {
      setIsLoading(true);
      setError(null);
      setGeneratedHeadshots([]);
      const headshotStyles = [
          "Corporate look, wearing a dark business suit, in a modern office background with soft, blurred lights.",
          "Casual business look, wearing a smart blazer, against a neutral grey studio backdrop.",
          "Creative professional look, wearing a stylish sweater, in a bright, minimalist indoor setting.",
      ];
      try {
          const results = await Promise.all(
              headshotStyles.map(style => generateHeadshot(selfies, style))
          );
          setGeneratedHeadshots(results);
      } catch (e: any) {
          setError(e.message || "Failed to generate headshots.");
      } finally {
          setIsLoading(false);
      }
  };


  if (imageUrls.length === 0) {
    return (
      <main className="flex-1 flex items-center justify-center min-h-full">
        <StartScreen onFileSelect={handleFileSelect} hasSavedSession={hasSavedSession} onResumeSession={handleResumeSession} />
      </main>
    );
  }

  if (isBatchMode) {
    return <BatchScreen imageFiles={imageFiles} imageUrls={imageUrls} processingStatus={processingStatus} processedImageUrls={processedImageUrls} onApplyBatchEdit={handleApplyBatchEdit} isLoading={isLoading} onSaveSession={handleSaveSession} />;
  }
  
  const editorTabs = [
    { id: 'edit' as Tab, label: 'Generative Edit', Icon: MagicPencilIcon, title: 'Make precise, selection-based edits' },
    { id: 'portrait' as Tab, label: 'Portrait Tools', Icon: FaceIcon, title: 'Access portrait-specific tools like face retouch and headshots' },
    { id: 'creative' as Tab, label: 'Creative Tools', Icon: PaletteIcon, title: 'Access creative filters, scene restyling, and more' },
    { id: 'adjust' as Tab, label: 'Adjust & Crop', Icon: SunIcon, title: 'Adjust colors, lighting, quality, and crop the image' },
  ];

  const previewStyle = { filter: `brightness(${previewAdjustments.brightness}%) contrast(${previewAdjustments.contrast}%) saturate(${previewAdjustments.saturation}%)` };

  const renderPanel = () => {
    switch (activeTab) {
        case 'edit': return <EditPanel prompt={editPrompt} setPrompt={setEditPrompt} onGenerate={handleGenerativeEdit} isLoading={isLoading} hasSelection={!!selection} activeTool={activeSelectionTool} setActiveTool={setActiveSelectionTool} onClearSelection={() => setSelection(null)} magicWandTolerance={magicWandTolerance} setMagicWandTolerance={setMagicWandTolerance} />;
        case 'portrait': return <PortraitPanel onApplyFaceRetouch={(prompt) => handleApiCall(() => generateFaceRetouchImage(imageFile!, prompt))} onApplyPose={(prompt) => handleApiCall(() => generatePosedImage(imageFile!, prompt))} onFaceSwap={(other, mode) => handleApiCall(() => generateFaceSwapImage(mode === 'currentIsSource' ? imageFile! : other, mode === 'currentIsSource' ? other : imageFile!))} onGenerateHeadshots={handleGenerateHeadshots} onHeadshotSelect={updateImage} onGeneratePassportPhoto={() => handleApiCall(() => generatePassportPhoto(imageFile!))} onGenerateHairstyle={(prompt) => handleApiCall(() => generateHairstyleChange(imageFile!, prompt))} generatedHeadshots={generatedHeadshots} isLoading={isLoading} />;
        case 'creative': return <CreativePanel onApplyFilter={(prompt) => handleApiCall(() => generateFilteredImage(imageFile!, prompt))} onApplyRestyle={(prompt) => handleApiCall(() => generateRestyledImage(imageFile!, prompt))} onReplaceBackground={(opts) => handleApiCall(() => generateBackgroundReplacement(imageFile!, opts))} onRemoveBackground={() => handleApiCall(() => generateRemovedBackground(imageFile!))} onGenerateImage={(prompt, aspect) => handleApiCall(() => generateImageFromText(prompt, aspect))} onGenerateLogo={handleGenerateLogo} onLogoSelect={updateImage} isLoading={isLoading} generatedLogos={generatedLogos} />;
        case 'adjust': return <AdjustAndCropPanel onApplyAdjustment={(prompt) => handleApiCall(() => generateAdjustedImage(imageFile!, prompt))} onEnhanceQuality={() => handleApiCall(() => generateEnhancedImage(imageFile!))} onUpscaleImage={() => handleApiCall(() => generateUpscaledImage(imageFile!))} onColorizeImage={() => handleApiCall(() => generateColorizedImage(imageFile!))} onApplyCrop={handleApplyCrop} onSetAspect={setAspect} isLoading={isLoading} isCropping={!!crop} onCropModeChange={setIsCropping} previewAdjustments={previewAdjustments} onPreviewChange={setPreviewAdjustments} onApplyRealtimeAdjustments={handleApplyRealtimeAdjustments} onResetAdjustments={handleResetAdjustments} />;
        default: return null;
    }
  };

  return (
    <div className="flex-1 flex overflow-hidden h-full">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} onUploadNew={resetState} tabs={editorTabs} />
        <main className="flex-1 p-8 overflow-auto flex flex-col items-center gap-6">
            <div className="relative w-full max-w-5xl mx-auto flex flex-col items-center gap-4">
                {error && <div className="w-full bg-red-500/20 border border-red-500 text-red-300 p-4 rounded-lg animate-fade-in"><p className="font-bold">Error:</p><p>{error}</p></div>}
                <div className="flex items-center gap-4">
                <button onClick={resetState} className="bg-red-600 hover:bg-red-500 text-white font-bold py-2 px-4 rounded">Start Over</button>
                <button onClick={handleUndo} disabled={history.length === 0 || isLoading} className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded disabled:opacity-50">Undo</button>
                <button onClick={handleRedo} disabled={redoHistory.length === 0 || isLoading} className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded disabled:opacity-50">Redo</button>
                <a href={imageUrl!} download={imageFile?.name || "download.png"} className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded">Download</a>
                </div>
            </div>

            <div className="relative w-full flex-grow flex items-center justify-center">
                {isLoading && <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex flex-col items-center justify-center z-20 rounded-lg"><Spinner /><p className="text-lg font-semibold mt-4 text-gray-200">AI is thinking...</p></div>}
                <div style={previewStyle} className="transition-all duration-100">
                    {history.length > 0 && imageUrl ? (
                        <ReactCompareSlider itemOne={<img src={history[history.length - 1]} alt="Before" className="max-w-full max-h-[55vh] object-contain rounded-lg shadow-2xl block"/>} itemTwo={<EditorCanvas ref={canvasRef} imageRef={imageRef} imageUrl={imageUrl} activeTool={isCropping ? 'crop' : activeSelectionTool} selection={selection} onSelectionChange={setSelection} isCropping={isCropping} aspect={aspect} onCropChange={setCrop} magicWandTolerance={magicWandTolerance} />}/>
                    ) : ( <EditorCanvas ref={canvasRef} imageRef={imageRef} imageUrl={imageUrl!} activeTool={isCropping ? 'crop' : activeSelectionTool} selection={selection} onSelectionChange={setSelection} isCropping={isCropping} aspect={aspect} onCropChange={setCrop} magicWandTolerance={magicWandTolerance} />)}
                </div>
            </div>
            <div className="w-full max-w-5xl mx-auto">{renderPanel()}</div>
            {currentCategory && <div className="container mx-auto mt-8"><RelatedTools category={currentCategory} currentPage={currentPage} onNavigate={onNavigate}/></div>}
        </main>
    </div>
  );
};

export default FullPhotoEditorPage;