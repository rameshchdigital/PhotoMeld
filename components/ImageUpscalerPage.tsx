/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useCallback } from 'react';
import { generateUpscaledImage } from '../services/geminiService';
import ToolPageLayout from './ToolPageLayout';
import { UpscaleIcon } from './icons';
import { Page } from '../App';
import { ToolCategory } from '../services/toolData';

interface ImageUpscalerPageProps {
    onNavigate: (page: Page) => void;
    currentPage: Page;
    allTools: ToolCategory[];
}

const ImageUpscalerPage: React.FC<ImageUpscalerPageProps> = ({ onNavigate, currentPage, allTools }) => {
    const handleGenerate = useCallback((file: File) => {
        return generateUpscaledImage(file);
    }, []);

    const Controls = ({ isLoading }: { isLoading: boolean }) => (
        <div className="flex flex-col gap-4 text-center">
            <h3 className="text-xl font-bold text-white">Ready to Upscale Your Image</h3>
            <p className="text-sm text-gray-400">Click the button below to automatically increase the resolution of your photo. The AI will intelligently add detail, making your image sharper and clearer for high-quality displays and printing.</p>
        </div>
    );

    return (
        <ToolPageLayout
            title="Free AI Image Upscaler"
            description="Enlarge and enhance your images online for free. Increase image resolution up to 4x while preserving and improving quality. Perfect for old photos, digital art, and professional use."
            Icon={UpscaleIcon}
            controls={<Controls isLoading={false} />}
            onGenerate={handleGenerate}
            generateButtonText="Upscale Image"
            howToTitle="How to Upscale an Image in 3 Steps"
            howToSteps={[
                { title: "1. Upload Your Image", text: "Select the image you want to make larger and clearer. This can be a low-resolution photo, a piece of digital art, or an old picture." },
                { title: "2. Click to Upscale", text: "Simply press the 'Upscale Image' button. Our AI will analyze your photo, double its resolution, and intelligently fill in details." },
                { title: "3. Compare & Download", text: "Use the before-and-after slider to see the dramatic difference in detail. Download your new high-resolution image for free." }
            ]}
            faqTitle="AI Image Upscaler FAQs"
            faqs={[
                { question: "How much larger will my image be?", answer: "Our AI Image Upscaler typically doubles the resolution of your image. For example, a 1024x1024 pixel image will become 2048x2048 pixels, containing four times the detail." },
                { question: "Will it fix very blurry photos?", answer: "It can significantly improve sharpness and detail on slightly blurry or low-resolution photos. However, it cannot fully restore images that are completely out of focus." },
                { question: "Is there a file size limit for uploads?", answer: "For the best and fastest performance, we recommend uploading images under 15MB. The tool works with standard formats like JPG, PNG, and WEBP." },
                { question: "What is the difference between this and 'Enhance Quality'?", answer: "'Upscale' specifically increases the number of pixels (the resolution) to make the image physically larger. 'Enhance Quality' works on the original resolution to improve clarity, sharpness, and reduce noise." }
            ]}
            onNavigate={onNavigate}
            currentPage={currentPage}
            allTools={allTools}
        />
    );
};

export default ImageUpscalerPage;