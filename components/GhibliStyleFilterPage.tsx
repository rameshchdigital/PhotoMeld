/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useCallback } from 'react';
import { generateFilteredImage } from '../services/geminiService';
import ToolPageLayout from './ToolPageLayout';
import { GhibliIcon } from './icons';
import { Page } from '../App';
import { ToolCategory } from '../services/toolData';

interface GhibliStyleFilterPageProps {
    onNavigate: (page: Page) => void;
    currentPage: Page;
    allTools: ToolCategory[];
}

const GhibliStyleFilterPage: React.FC<GhibliStyleFilterPageProps> = ({ onNavigate, currentPage, allTools }) => {
    const ghibliPrompt = "Transform the photo into the iconic, nostalgic art style of a Studio Ghibli film. The result should feature lush, painterly backgrounds with soft, detailed clouds and vibrant foliage. Apply a warm, gentle lighting that evokes a sense of wonder. Characters and foreground elements should have clean outlines but soft, painterly coloring, reminiscent of Hayao Miyazaki's animation style.";

    const handleGenerate = useCallback((file: File) => {
        return generateFilteredImage(file, ghibliPrompt);
    }, [ghibliPrompt]);

    const Controls = ({ isLoading }: { isLoading: boolean }) => (
        <div className="flex flex-col gap-4 text-center">
            <h3 className="text-xl font-bold text-white">Ready to Apply Ghibli Style</h3>
            <p className="text-sm text-gray-400">Click the button below to transform your photo with the beautiful and nostalgic art style of Studio Ghibli. It's perfect for landscapes, portraits, and pet photos.</p>
        </div>
    );

    return (
        <ToolPageLayout
            title="Ghibli Style AI Filter - Turn Photo into Ghibli Art"
            description="Transform your photos into the beautiful, nostalgic, and painterly art style of Studio Ghibli films with our free one-click AI filter. Create your own Ghibli-inspired masterpiece."
            Icon={GhibliIcon}
            controls={<Controls isLoading={false} />}
            onGenerate={handleGenerate}
            generateButtonText="Apply Ghibli Style"
            howToTitle="How to Apply the Ghibli Filter"
            howToSteps={[
                { title: "1. Upload Your Photo", text: "Choose a photo to transform. Outdoor scenes, landscapes with beautiful skies, and charming portraits often produce the most stunning results!" },
                { title: "2. Click to Convert", text: "Simply press the 'Apply Ghibli Style' button. Our AI will analyze and redraw your image in this iconic, hand-painted anime style." },
                { title: "3. Enjoy & Download", text: "Use the before-and-after slider to see the magical transformation, then download your new high-quality piece of art for free." }
            ]}
            faqTitle="Ghibli Style Filter FAQs"
            faqs={[
                { question: "What kind of photos work best for the Ghibli filter?", answer: "Photos with natural landscapes, skies with clouds, lush foliage, and clear subjects often produce the most beautiful results, closely mimicking the aesthetic of the films." },
                { question: "Is this just a color filter?", answer: "It's much more than a simple color overlay. The AI analyzes the content and redraws elements of your photo to mimic the painterly textures, soft lighting, and specific color palettes characteristic of the Ghibli art style." },
                { question: "Will it work on portraits and pictures of people?", answer: "Yes, it will stylize portraits, giving people and animals an anime-like appearance that is consistent with the Ghibli aesthetic, including the characteristic clean lines and soft shading." },
                { question: "Can I use this for my pet photos?", answer: "Absolutely! Applying the Ghibli filter to photos of pets often results in incredibly charming and whimsical images." }
            ]}
            onNavigate={onNavigate}
            currentPage={currentPage}
            allTools={allTools}
        />
    );
};

export default GhibliStyleFilterPage;