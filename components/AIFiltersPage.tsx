/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState, useCallback } from 'react';
import { generateFilteredImage } from '../services/geminiService';
import ToolPageLayout from './ToolPageLayout';
import { PaletteIcon, SynthwaveIcon, AnimeIcon, LomoIcon, GlitchIcon, VintageFilmIcon, CyberpunkIcon, WatercolorIcon, DramaticLightIcon, GhibliIcon } from './icons';
import { Page } from '../App';
import { ToolCategory } from '../services/toolData';

const filterStyles = [
    { name: 'Ghibli Style', prompt: "Transform the photo into the iconic, nostalgic art style of a Studio Ghibli film. The result should feature lush, painterly backgrounds with soft, detailed clouds and vibrant foliage. Apply a warm, gentle lighting that evokes a sense of wonder. Characters and foreground elements should have clean outlines but soft, painterly coloring, reminiscent of Hayao Miyazaki's animation style.", Icon: GhibliIcon },
    { name: 'Synthwave', prompt: 'Transform the image with an 80s synthwave and retro-futuristic aesthetic. Introduce vibrant neon glows, especially magenta, cyan, and electric blue. Add a subtle grid pattern to the background and faint horizontal scan lines to complete the retro CRT monitor feel.', Icon: SynthwaveIcon },
    { name: 'Anime', prompt: 'Convert the photo into a high-quality Japanese anime art style. This should include bold, clean outlines, simplified color palettes with cel-shading, vibrant and saturated colors, and expressive, stylized features, particularly for any people in the image.', Icon: AnimeIcon },
    { name: 'Lomo', prompt: 'Emulate the iconic Lomography film camera look. Apply heavy color saturation, high contrast, strong vignetting (darkened corners), and unpredictable color shifts, often towards blues and greens, for a spontaneous, experimental, and lo-fi aesthetic.', Icon: LomoIcon },
    { name: 'Glitch', prompt: 'Deconstruct the image with a digital glitch art style. Introduce elements like pixel sorting, datamoshing artifacts, RGB channel splitting (chromatic aberration), and geometric distortions to create a futuristic, chaotic, and tech-dystopian vibe.', Icon: GlitchIcon },
    { name: 'Vintage Film', prompt: "Apply a classic vintage film aesthetic. This should include warm, slightly faded colors with a shift towards amber and magenta in the shadows. Reduce the overall contrast to mimic aged photographic paper, and add a subtle, fine-grained texture. The final image should feel nostalgic and timeless.", Icon: VintageFilmIcon },
    { name: 'Cyberpunk', prompt: "Immerse the image in a high-contrast, cyberpunk neon world. Dramatically increase the contrast, crushing the blacks and making highlights pop with electric blues, vibrant pinks, and glowing cyans. Add atmospheric effects like a subtle haze or digital rain, and ensure that light sources cast a strong, colorful neon glow on surrounding surfaces.", Icon: CyberpunkIcon },
    { name: 'Watercolor', prompt: "Transform the photo into a beautiful watercolor sketch. The lines should be soft and slightly blurred, blending into the colors. The colors themselves should be vibrant but translucent, with visible brushstroke textures and paper grain. The final result should look like it was hand-painted on textured watercolor paper.", Icon: WatercolorIcon },
    { name: 'Dramatic Light', prompt: "Dramatically enhance the lighting to create a moody, cinematic feel. Deepen the shadows and add a strong, directional light source (like a single spotlight or light coming through a window) that sculpts the subject and creates high contrast. The result should be atmospheric and visually striking, like a scene from a noir film.", Icon: DramaticLightIcon },
];

interface AIFiltersPageProps {
    onNavigate: (page: Page) => void;
    currentPage: Page;
    allTools: ToolCategory[];
}

const AIFiltersPage: React.FC<AIFiltersPageProps> = ({ onNavigate, currentPage, allTools }) => {
    const [selectedStyle, setSelectedStyle] = useState<(typeof filterStyles)[0]>(filterStyles[0]);

    const handleGenerate = useCallback(
        (file: File) => {
            return generateFilteredImage(file, selectedStyle.prompt);
        },
        [selectedStyle]
    );

    const Controls = ({ isLoading }: { isLoading: boolean }) => (
        <div className="flex flex-col gap-4">
            <h3 className="text-xl font-bold text-white">1. Choose Your AI Filter</h3>
            <p className="text-sm text-gray-400 -mt-2">Select an artistic style to apply to your photo.</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {filterStyles.map(style => (
                    <button 
                        key={style.name} 
                        onClick={() => setSelectedStyle(style)} 
                        disabled={isLoading} 
                        className={`p-3 text-center rounded-lg font-semibold transition-all text-sm flex flex-col items-center justify-center gap-2 ${selectedStyle.name === style.name ? 'bg-blue-600 text-white ring-2 ring-offset-2 ring-offset-gray-800 ring-blue-500' : 'bg-white/10 hover:bg-white/20'}`}
                    >
                        <style.Icon className="w-6 h-6" />
                        <span>{style.name}</span>
                    </button>
                ))}
            </div>
            <h3 className="text-xl font-bold text-white mt-4">2. Apply to Your Photo</h3>
        </div>
    );

    return (
        <ToolPageLayout
            title="Free AI Photo Filters"
            description="Transform your photos with one-click AI-powered artistic filters. Turn any image into a masterpiece with styles like Anime, Ghibli, Cyberpunk, and more."
            Icon={PaletteIcon}
            controls={<Controls isLoading={false} />}
            onGenerate={handleGenerate}
            generateButtonText="Apply Filter"
            howToTitle="How to Apply an AI Filter"
            howToSteps={[
                { title: "1. Upload Your Photo", text: "Click the upload area and select any photo from your device. Landscapes, portraits, and even pet photos work great!" },
                { title: "2. Choose a Filter", text: "Select a creative filter from the list of presets. Each one will radically transform the look and feel of your image." },
                { title: "3. Click 'Apply Filter'", text: "Press the button and our AI will redraw your entire photo from scratch in your chosen artistic style." },
                { title: "4. Download Your Artwork", text: "Use the before-and-after slider to see the amazing transformation, then download your new artwork for free." }
            ]}
            faqTitle="AI Photo Filter FAQs"
            faqs={[
                { question: "Are these just simple color overlays?", answer: "No, these are advanced generative AI filters. The AI doesn't just change colors; it redraws your image in the new style, changing textures, lines, and lighting to match the aesthetic." },
                { question: "What photos work best?", answer: "Almost any photo can be transformed! Clear, well-lit images tend to produce the most striking results. Experiment with different photos to see what you can create." },
                { question: "Can I combine filters?", answer: "Currently, you can apply one filter at a time. To combine effects, you can download the result of one filter and then upload it again to apply a second one." }
            ]}
            onNavigate={onNavigate}
            currentPage={currentPage}
            allTools={allTools}
        />
    );
};

export default AIFiltersPage;
