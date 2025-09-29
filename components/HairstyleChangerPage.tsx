/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState, useCallback } from 'react';
import { generateHairstyleChange } from '../services/geminiService';
import ToolPageLayout from './ToolPageLayout';
import { HairstyleIcon } from './icons';
import { Page } from '../App';
import { ToolCategory } from '../services/toolData';

interface HairstyleChangerPageProps {
    onNavigate: (page: Page) => void;
    currentPage: Page;
    allTools: ToolCategory[];
}

const HairstyleChangerPage: React.FC<HairstyleChangerPageProps> = ({ onNavigate, currentPage, allTools }) => {
    const [prompt, setPrompt] = useState('');

    const handleGenerate = useCallback((file: File) => {
        if (!prompt.trim()) {
            return Promise.reject(new Error("Please describe a hairstyle or select a preset."));
        }
        return generateHairstyleChange(file, prompt);
    }, [prompt]);
    
    const stylePresets = [
        'a long and wavy hairstyle', 'a short bob haircut', 'a chic pixie cut', 'a voluminous curly afro',
        'a slicked-back hairstyle', 'a man bun', 'a buzz cut', 'intricate braids', 'platinum blonde hair',
        'vibrant pink hair', 'electric blue hair', 'fiery red hair'
    ];

    const Controls = ({ isLoading }: { isLoading: boolean }) => (
        <div className="flex flex-col gap-4">
            <h3 className="text-xl font-bold text-white">1. Describe a New Hairstyle</h3>
            <p className="text-sm text-gray-400 -mt-2">Be specific about the style and color you want to see.</p>
            <input
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="e.g., 'a short, curly bob with bangs'"
                className="w-full bg-gray-900/50 border-2 border-gray-700 rounded-lg p-4 text-lg text-gray-200 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
                disabled={isLoading}
            />
            <div className="flex flex-wrap gap-2">
                {stylePresets.map(p => (
                    <button key={p} onClick={() => setPrompt(p)} disabled={isLoading} className="bg-white/10 text-gray-200 text-xs font-semibold py-1 px-3 rounded-full hover:bg-white/20 transition-colors">
                       {p}
                    </button>
                ))}
            </div>
            <h3 className="text-xl font-bold text-white mt-4">2. Generate Your New Look</h3>
        </div>
    );

    return (
        <ToolPageLayout
            title="AI Hairstyle Changer: Virtual Hair Try-On"
            description="Virtually try on new hairstyles and colors online for free. Upload your photo, describe a look, and let our AI show you how you'd look with a different haircut or color."
            Icon={HairstyleIcon}
            controls={<Controls isLoading={false} />}
            onGenerate={handleGenerate}
            generateButtonText="Change Hairstyle"
            howToTitle="How to Try a New Hairstyle Online"
            howToSteps={[
                { title: "1. Upload Your Photo", text: "For the best results, choose a clear, front-facing photo of yourself where your hair and face are visible." },
                { title: "2. Describe a Style", text: "Type in a description of the hairstyle or color you want to try, or simply click one of the popular presets to get started quickly." },
                { title: "3. Generate Your Look", text: "Click the 'Change Hairstyle' button and the AI will realistically apply the new hairstyle to your photo, matching the lighting and angle." },
                { title: "4. Download & Share", text: "Save your new look to your device. It's a great way to get feedback from friends or show a reference to your hairstylist." }
            ]}
            faqTitle="Hairstyle Changer FAQs"
            faqs={[
                { question: "Will the new hairstyle look realistic on me?", answer: "Yes, our AI is designed to preserve your unique face and identity while seamlessly blending the new hairstyle with your photo's original lighting, perspective, and head angle for a photorealistic result." },
                { question: "Can I try different and unusual hair colors?", answer: "Absolutely! Just describe the color you want in the prompt. You can try anything from 'natural auburn' to 'electric blue with purple highlights'." },
                { question: "What kind of photos work best?", answer: "Clear photos where your face is looking forward and your hair isn't obscuring your facial features tend to provide the most accurate and impressive results." },
                { question: "Does this work for all hair types and genders?", answer: "Yes! The AI can generate a vast range of hairstyles suitable for anyone. Just describe what you're looking for, from 'buzz cut' to 'long intricate braids'." }
            ]}
            onNavigate={onNavigate}
            currentPage={currentPage}
            allTools={allTools}
        />
    );
};

export default HairstyleChangerPage;
