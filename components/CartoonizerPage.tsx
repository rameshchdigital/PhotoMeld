/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState, useCallback } from 'react';
import { generateCartoonImage } from '../services/geminiService';
import ToolPageLayout from './ToolPageLayout';
import { CartoonIcon } from './icons';
import { Page } from '../App';
import { ToolCategory } from '../services/toolData';

const cartoonStyles = [
    { name: 'Classic Cartoon', prompt: 'a classic 2D cartoon style with bold outlines and flat, vibrant colors' },
    { name: 'Anime', prompt: 'a modern Japanese anime style with sharp lines, detailed eyes, and cel-shading' },
    { name: '3D Render', prompt: 'a polished 3D animated movie style, like a character from a modern CGI film' },
    { name: 'Comic Book', prompt: 'a retro comic book style with halftone dot patterns, strong shadows, and a graphic feel' },
    { name: 'Caricature', prompt: 'a fun caricature style with exaggerated features while maintaining likeness' },
    { name: 'Simple Sketch', prompt: 'a clean, minimalist black and white line art sketch' },
];

interface CartoonizerPageProps {
    onNavigate: (page: Page) => void;
    currentPage: Page;
    allTools: ToolCategory[];
}

const CartoonizerPage: React.FC<CartoonizerPageProps> = ({ onNavigate, currentPage, allTools }) => {
    const [selectedStyle, setSelectedStyle] = useState<(typeof cartoonStyles)[0]>(cartoonStyles[0]);

    const handleGenerate = useCallback(
        (file: File) => {
            return generateCartoonImage(file, selectedStyle.prompt);
        },
        [selectedStyle]
    );

    const Controls = ({ isLoading }: { isLoading: boolean }) => (
        <div className="flex flex-col gap-4">
            <h3 className="text-xl font-bold text-white">1. Choose Your Cartoon Style</h3>
            <p className="text-sm text-gray-400 -mt-2">Select an artistic style to apply to your photo.</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {cartoonStyles.map(style => (
                    <button 
                        key={style.name} 
                        onClick={() => setSelectedStyle(style)} 
                        disabled={isLoading} 
                        className={`p-3 text-center rounded-lg font-semibold transition-all text-sm ${selectedStyle.name === style.name ? 'bg-blue-600 text-white ring-2 ring-offset-2 ring-offset-gray-800 ring-blue-500' : 'bg-white/10 hover:bg-white/20'}`}
                    >
                        {style.name}
                    </button>
                ))}
            </div>
            <h3 className="text-xl font-bold text-white mt-4">2. Convert Your Photo</h3>
        </div>
    );

    return (
        <ToolPageLayout
            title="Free AI Photo to Cartoon Converter"
            description="Turn any photo into a cartoon online for free with the PhotoFix AI Cartoonizer. Upload your image, choose from styles like anime, 3D render, or classic comic book, and get a high-quality cartoon version of yourself, your pet, or your landscape in seconds."
            Icon={CartoonIcon}
            controls={<Controls isLoading={false} />}
            onGenerate={handleGenerate}
            generateButtonText="Cartoonize Photo"
            howToTitle="How to Cartoonize a Photo for Free"
            howToSteps={[
                { title: "1. Upload Your Photo", text: "Click the upload area and select a clear photo from your device. Headshots, portraits, and pet photos often produce the most amazing results!" },
                { title: "2. Choose a Cartoon Style", text: "Select an artistic style from the presets, such as Classic Cartoon, Japanese Anime, or 3D Render to define the look of your output." },
                { title: "3. Click 'Cartoonize Photo'", text: "Press the button and let our AI work its magic. It will redraw your image from scratch in your chosen style in just a few seconds." },
                { title: "4. Download Your Art", text: "Use the before-and-after slider to compare, then download your new cartoon masterpiece, ready to share on social media." }
            ]}
            faqTitle="Photo to Cartoon FAQs"
            faqs={[
                { question: "What kind of photos work best to cartoonize?", answer: "Clear, well-lit photos give the best results. Portraits, headshots, and photos of pets are particularly great candidates for our cartoonizer." },
                { question: "Can I turn a photo of my dog or cat into a cartoon?", answer: "Absolutely! The AI is excellent at recognizing and stylizing animals, turning your furry friends into adorable cartoon characters." },
                { question: "Is the generated cartoon image high resolution?", answer: "Yes, the tool generates a high-quality image that is suitable for use as a profile picture on social media, for sharing with friends, or even for printing." },
                { question: "What is the best cartoon style for a profile picture?", answer: "The 'Anime' and '3D Render' styles are very popular choices for creating unique and eye-catching profile pictures. The 'Caricature' style is also great for a more humorous look." }
            ]}
            onNavigate={onNavigate}
            currentPage={currentPage}
            allTools={allTools}
        />
    );
};

export default CartoonizerPage;
