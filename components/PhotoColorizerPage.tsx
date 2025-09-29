/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useCallback } from 'react';
import { generateColorizedImage } from '../services/geminiService';
import ToolPageLayout from './ToolPageLayout';
import { ColorizeIcon } from './icons';
import { Page } from '../App';
import { ToolCategory } from '../services/toolData';

interface PhotoColorizerPageProps {
    onNavigate: (page: Page) => void;
    currentPage: Page;
    allTools: ToolCategory[];
}

const PhotoColorizerPage: React.FC<PhotoColorizerPageProps> = ({ onNavigate, currentPage, allTools }) => {
    const handleGenerate = useCallback((file: File) => {
        return generateColorizedImage(file);
    }, []);

    const Controls = ({ isLoading }: { isLoading: boolean }) => (
        <div className="flex flex-col gap-4 text-center">
            <h3 className="text-xl font-bold text-white">Ready to Add Color</h3>
            <p className="text-sm text-gray-400">Click the button below to add realistic, AI-generated color to your black and white photo, bringing your memories to life.</p>
        </div>
    );

    return (
        <ToolPageLayout
            title="AI Photo Colorizer - Colorize Black & White Photos Free"
            description="Bring your old black and white photos to life with stunning, realistic color. Our free AI Photo Colorizer analyzes your image to apply historically accurate and natural tones in seconds."
            Icon={ColorizeIcon}
            controls={<Controls isLoading={false} />}
            onGenerate={handleGenerate}
            generateButtonText="Colorize Photo"
            howToTitle="How to Colorize Your B&W Photo"
            howToSteps={[
                { title: "1. Upload Your Photo", text: "Select any black and white, sepia, or monochrome image from your device that you wish to colorize." },
                { title: "2. Click 'Colorize Photo'", text: "With a single click, our AI will analyze the contents of your image and intelligently apply natural-looking colors." },
                { title: "3. Review & Download", text: "Use the slider to compare the original with the new color version. Download your beautifully colorized photo for free." }
            ]}
            faqTitle="Photo Colorizer FAQs"
            faqs={[
                { question: "How does the AI know which colors to use?", answer: "The AI is trained on millions of modern color photographs. It learns to recognize objects, textures, and contexts (like sky, grass, and clothing from certain eras) to apply contextually appropriate and realistic colors." },
                { question: "Can I use this tool on sepia or faded photos?", answer: "Yes, it works wonderfully on sepia and other single-tone images, not just pure black and white. It can help restore the original color vibrancy." },
                { question: "Will the colors be 100% historically accurate?", answer: "The AI makes highly educated guesses based on its vast training data, which often results in remarkably accurate colors. However, for specific historical items, it should be considered a beautiful, artistic interpretation." },
                { question: "Can I colorize a photo that's already in color?", answer: "This tool is specifically designed and optimized for monochrome images. Applying it to an existing color photo may produce interesting but unpredictable artistic results." }
            ]}
            onNavigate={onNavigate}
            currentPage={currentPage}
            allTools={allTools}
        />
    );
};

export default PhotoColorizerPage;