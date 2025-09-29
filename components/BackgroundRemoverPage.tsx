/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useCallback } from 'react';
import { generateRemovedBackground } from '../services/geminiService';
import ToolPageLayout from './ToolPageLayout';
import { BackgroundIcon } from './icons';
import { Page } from '../App';
import { ToolCategory } from '../services/toolData';

interface BackgroundRemoverPageProps {
    onNavigate: (page: Page) => void;
    currentPage: Page;
    allTools: ToolCategory[];
}

const BackgroundRemoverPage: React.FC<BackgroundRemoverPageProps> = ({ onNavigate, currentPage, allTools }) => {
    const handleGenerate = useCallback((file: File) => {
        return generateRemovedBackground(file);
    }, []);

    const Controls = ({ isLoading }: { isLoading: boolean }) => (
        <div className="flex flex-col gap-4 text-center">
            <h3 className="text-xl font-bold text-white">Ready to Remove Background</h3>
            <p className="text-sm text-gray-400">Click the button below to automatically detect the main subject and create a high-quality transparent background.</p>
        </div>
    );

    return (
        <ToolPageLayout
            title="Free AI Background Remover"
            description="Instantly remove the background from any image with a single click. Our AI precisely cuts out subjects like people, products, and cars to create a transparent PNG, perfect for any project."
            Icon={BackgroundIcon}
            controls={<Controls isLoading={false} />}
            onGenerate={handleGenerate}
            generateButtonText="Remove Background"
            howToTitle="How to Remove a Background in One Click"
            howToSteps={[
                { title: "1. Upload Your Image", text: "Choose any photo (JPG, PNG, WEBP) where you want to isolate the subject from its background." },
                { title: "2. Click the Button", text: "Press 'Remove Background'. The AI will automatically detect the subject and erase the background in about 5 seconds." },
                { title: "3. Download Transparent PNG", text: "Your new image with a transparent background is ready to download instantly as a high-quality PNG file." }
            ]}
            faqTitle="Background Remover FAQs"
            faqs={[
                { question: "What kind of images work best for background removal?", answer: "Images with a clear, well-defined subject against a contrasting background produce the cleanest results, but our AI is highly effective on a wide range of photos, including complex ones." },
                { question: "Does it work with fine details like hair?", answer: "Yes, a major advantage of our AI is its ability to handle complex edges like hair and fur, providing a clean and professional-looking cutout without jagged edges." },
                { question: "What image format will the downloaded file be?", answer: "The output is always a PNG (Portable Network Graphics) file, which is a standard image format that supports transparency." },
                { question: "Can I use the resulting image for commercial purposes?", answer: "Absolutely. Once you remove the background, you are free to use the resulting image for any personal or commercial project, such as e-commerce listings, marketing materials, or presentations." }
            ]}
            onNavigate={onNavigate}
            currentPage={currentPage}
            allTools={allTools}
        />
    );
};

export default BackgroundRemoverPage;