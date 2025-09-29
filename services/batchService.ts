/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import { ProcessingStatus } from '../components/FullPhotoEditorPage';

export interface SavedImage {
  name: string;
  type: string;
  dataUrl: string;
}

export interface SavedBatchSession {
  originalImages: SavedImage[];
  processingStatus: { [key: string]: ProcessingStatus };
  processedImageUrls: { [key: string]: string }; // Stored as data URLs
}

const BATCH_SESSION_KEY = 'photoMeldBatchSession';

const fileToDataUrl = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
};

const urlToDataUrl = async (url: string): Promise<string> => {
  if (url.startsWith('data:')) {
    return url;
  }
  // This handles blob URLs
  const response = await fetch(url);
  const blob = await response.blob();
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(blob);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
};

export const saveBatchSession = async (
  imageFiles: File[],
  processingStatus: { [key: string]: ProcessingStatus },
  processedImageUrls: { [key: string]: string }
): Promise<void> => {
  try {
    const originalImages: SavedImage[] = await Promise.all(
      imageFiles.map(async (file) => ({
        name: file.name,
        type: file.type,
        dataUrl: await fileToDataUrl(file),
      }))
    );

    const savedProcessedUrls: { [key: string]: string } = {};
    for (const key in processedImageUrls) {
      if (processedImageUrls[key]) {
        savedProcessedUrls[key] = await urlToDataUrl(processedImageUrls[key]);
      }
    }

    const session: SavedBatchSession = {
      originalImages,
      processingStatus,
      processedImageUrls: savedProcessedUrls,
    };

    localStorage.setItem(BATCH_SESSION_KEY, JSON.stringify(session));
    console.log('Batch session saved.');
  } catch (error) {
    console.error('Failed to save batch session:', error);
    throw new Error('Could not save session. Storage might be full.');
  }
};

export const dataUrlToFile = async (dataUrl: string, fileName: string, fileType: string): Promise<File> => {
    const res = await fetch(dataUrl);
    const blob = await res.blob();
    return new File([blob], fileName, { type: fileType });
};


export const loadBatchSession = async (): Promise<{
    imageFiles: File[],
    imageUrls: string[],
    processingStatus: { [key: string]: ProcessingStatus },
    processedImageUrls: { [key: string]: string },
} | null> => {
  const savedSession = localStorage.getItem(BATCH_SESSION_KEY);
  if (!savedSession) {
    return null;
  }
  
  try {
    const parsed: SavedBatchSession = JSON.parse(savedSession);

    const imageFiles = await Promise.all(
        parsed.originalImages.map(img => dataUrlToFile(img.dataUrl, img.name, img.type))
    );
    
    const imageUrls = parsed.originalImages.map(img => img.dataUrl);
    const processedImageUrls = parsed.processedImageUrls;

    console.log('Batch session loaded.');
    return {
      imageFiles,
      imageUrls,
      processingStatus: parsed.processingStatus,
      processedImageUrls,
    };
  } catch (error) {
    console.error('Failed to load batch session:', error);
    clearBatchSession(); // Clear corrupted data
    return null;
  }
};

export const clearBatchSession = (): void => {
  localStorage.removeItem(BATCH_SESSION_KEY);
  console.log('Batch session cleared.');
};

export const checkForSavedSession = (): boolean => {
    return !!localStorage.getItem(BATCH_SESSION_KEY);
}