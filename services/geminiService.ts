/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import { GoogleGenAI, Modality, Part, GenerateContentResponse } from '@google/genai';

// Initialize the Google Gemini AI client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

// --- Helper Functions ---

const fileToGenerativePart = async (file: File): Promise<Part> => {
  const base64EncodedDataPromise = new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
    reader.readAsDataURL(file);
  });
  return {
    inlineData: {
      data: await base64EncodedDataPromise,
      mimeType: file.type,
    },
  };
};

const getImageUrlFromResponse = (response: GenerateContentResponse): string => {
    const imagePart = response.candidates?.[0]?.content?.parts?.find(part => part.inlineData);
    if (!imagePart || !imagePart.inlineData) {
        const textResponse = response.text?.trim();
        if (textResponse) {
             console.warn("API returned text instead of an image:", textResponse);
        }
        throw new Error('No image data found in the API response.');
    }
    const { data, mimeType } = imagePart.inlineData;
    return `data:${mimeType};base64,${data}`;
};

const generateImageWithPrompt = async (parts: Part[]): Promise<string> => {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image-preview',
        contents: { parts },
        config: {
            responseModalities: [Modality.IMAGE, Modality.TEXT],
        },
    });
    return getImageUrlFromResponse(response);
};

// --- Core API Functions ---

export const generateMagicEditImage = async (options: {
    baseImage: File;
    prompt: string;
    styleImage?: File | null;
    preserveCharacter?: boolean;
    preserveScene?: boolean;
}): Promise<string> => {
    const { baseImage, styleImage, prompt, preserveCharacter, preserveScene } = options;
    
    const parts: Part[] = [await fileToGenerativePart(baseImage)];
    
    if (styleImage) {
        parts.push(await fileToGenerativePart(styleImage));
    }

    let constructedPrompt = `User's primary instruction: "${prompt}"`;

    if (styleImage) {
        constructedPrompt += "\n\nApply the style, mood, colors, and overall aesthetic from the second image (the style reference) to the first image (the base image), following the user's primary instruction.";
    }
    if (preserveCharacter) {
        constructedPrompt += "\n\nCRITICAL RULE: The primary subject (person, animal, main object) in the base image MUST BE PRESERVED. Do not change their appearance, pose, or clothing unless specifically instructed to in the prompt. Apply all described changes ONLY to the background and surrounding scene.";
    }
    if (preserveScene) {
        constructedPrompt += "\n\nCRITICAL RULE: The background and environment in the base image MUST BE PRESERVED. Do not change them. Apply all described changes ONLY to the primary subject (person, animal, main object).";
    }

    parts.push({ text: constructedPrompt });
    return generateImageWithPrompt(parts);
};

export const generateEditedImage = async (image: File, mask: File, prompt: string): Promise<string> => {
    const imagePart = await fileToGenerativePart(image);
    const maskPart = await fileToGenerativePart(mask);
    const textPart = { text: prompt };
    return generateImageWithPrompt([imagePart, maskPart, textPart]);
};

export const generateFilteredImage = async (image: File, prompt: string): Promise<string> => {
    const imagePart = await fileToGenerativePart(image);
    const textPart = { text: prompt };
    return generateImageWithPrompt([imagePart, textPart]);
};

export const generateAdjustedImage = (image: File, prompt: string) => generateFilteredImage(image, prompt);
export const generateFaceRetouchImage = (image: File, prompt: string) => generateFilteredImage(image, prompt);

// FIX: Add missing function generateBackgroundReplacement.
export const generateBackgroundReplacement = async (
  baseImage: File,
  options: { image?: File; prompt?: string }
): Promise<string> => {
  return generateMagicEditImage({
    baseImage,
    styleImage: options.image,
    prompt: `Replace the background of the main subject with this new scene: ${
      options.prompt || 'the provided image'
    }. The main subject must be preserved perfectly.`,
    preserveCharacter: true,
  });
};

export const generatePosedImage = (image: File, prompt: string) => generateFilteredImage(image, prompt);
export const generateRestyledImage = (image: File, prompt: string) => generateFilteredImage(image, prompt);
export const generateHairstyleChange = (image: File, prompt: string) => generateFilteredImage(image, prompt);
export const generateCartoonImage = (image: File, prompt: string) => generateFilteredImage(image, prompt);
export const generateEnhancedImage = (image: File) => generateFilteredImage(image, "Subtly enhance the sharpness, clarity, and overall quality of this image. The result should be crisp but natural, avoiding any artificial-looking halos or over-sharpening.");
export const generateUpscaledImage = (image: File) => generateFilteredImage(image, "Upscale this image to twice its original resolution, intelligently adding photorealistic detail to maintain and improve quality.");
export const generateColorizedImage = (image: File) => generateFilteredImage(image, "Colorize this black and white image with realistic and historically appropriate colors.");
export const generateRemovedBackground = (image: File) => generateFilteredImage(image, "Remove the background of this image, making it transparent. The subject should be perfectly and cleanly cut out.");
export const generateFaceSwapImage = async (sourceImage: File, targetImage: File): Promise<string> => {
    const sourcePart = await fileToGenerativePart(sourceImage);
    const targetPart = await fileToGenerativePart(targetImage);
    const textPart = { text: "Take the face from the first image (source) and realistically place it onto the person in the second image (target). Match lighting, skin tone, and perspective for a seamless blend." };
    return generateImageWithPrompt([sourcePart, targetPart, textPart]);
};
export const generateImageFromText = async (prompt: string, aspectRatio: string): Promise<string> => {
    const response = await ai.models.generateImages({
        model: 'imagen-4.0-generate-001',
        prompt: prompt,
        config: { numberOfImages: 1, aspectRatio: aspectRatio as any },
    });
    return `data:image/png;base64,${response.generatedImages[0].image.imageBytes}`;
};
export const generateLogo = async (companyName: string, slogan: string, style: string): Promise<string[]> => {
    const prompt = `A professional logo for a company named "${companyName}". Slogan: "${slogan}". Style: ${style}. The logo should be on a clean white background, vector style, suitable for branding.`;
    const response = await ai.models.generateImages({
        model: 'imagen-4.0-generate-001',
        prompt,
        config: { numberOfImages: 4, aspectRatio: '1:1' },
    });
    return response.generatedImages.map(img => `data:image/png;base64,${img.image.imageBytes}`);
};
export const generateHeadshot = async (selfies: File[], style: string): Promise<string> => {
    const selfieParts = await Promise.all(selfies.map(fileToGenerativePart));
    const promptPart = { text: `Using the provided selfies as a reference for the person's face, generate a new, photorealistic headshot of them. The new headshot should have this style: ${style}` };
    return generateImageWithPrompt([...selfieParts, promptPart]);
};
export const generatePassportPhoto = (image: File) => generateFilteredImage(image, "Convert this portrait into a compliant 2x2 inch passport photo. The background must be a uniform off-white. The head should be centered and correctly proportioned according to official guidelines.");
export const generateBabyImage = async (parent1: File, parent2: File): Promise<string> => {
    const parent1Part = await fileToGenerativePart(parent1);
    const parent2Part = await fileToGenerativePart(parent2);
    const promptPart = { text: "Based on the two photos of the parents provided, generate a photorealistic portrait of what their future baby might look like, blending their key facial features." };
    return generateImageWithPrompt([parent1Part, parent2Part, promptPart]);
};
export const generateFantasyMap = (prompt: string) => generateImageFromText(prompt, '16:9');
export const generateTattooDesigns = async (prompt: string): Promise<string[]> => {
    const fullPrompt = `A clean, professional tattoo design based on the following description: "${prompt}". The design should be isolated on a plain white background, black and white line art style, suitable for a stencil.`;
     const response = await ai.models.generateImages({
        model: 'imagen-4.0-generate-001',
        prompt: fullPrompt,
        config: { numberOfImages: 4, aspectRatio: '1:1' },
    });
    return response.generatedImages.map(img => `data:image/png;base64,${img.image.imageBytes}`);
};
export const generateExtendedImage = (image: File, mask: File) => generateEditedImage(image, mask, "Extend the image by filling in the masked area with content that logically and seamlessly continues the existing scene. This is an outpainting task.");
export const generateVirtualTryOnImage = (image: File, prompt: string) => generateFilteredImage(image, `Realistically place the following item onto the person in the photo: ${prompt}. The item should fit naturally, matching lighting, shadows, and perspective.`);