/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React from 'react';
import { Page } from '../App';
import { toolCategories, Tool } from '../services/toolData';

interface PortraitToolsCategoryPageProps {
  onNavigate: (page: Page) => void;
}

const portraitToolsCategory = toolCategories.find(c => c.page === 'portraitToolsCategory')!;

const ToolCard: React.FC<{ tool: Tool, onNavigate: (page: Page) => void }> = ({ tool, onNavigate }) => (
    <button
        onClick={() => onNavigate(tool.page as Page)}
        className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-6 text-left flex flex-col hover:border-blue-500 hover:bg-gray-800 transition-all duration-300 ease-in-out hover:-translate-y-1 group"
    >
        <div className="flex items-center gap-4">
            <div className="bg-gray-900 p-3 rounded-lg">
                <tool.Icon className="w-6 h-6 text-blue-400" />
            </div>
            <h3 className="text-lg font-bold text-white flex-1">{tool.name}</h3>
        </div>
        <p className="text-gray-400 mt-3 text-sm flex-grow">{tool.description}</p>
        <span className="text-blue-400 font-semibold mt-4 text-sm self-start group-hover:underline">
            Use Tool &rarr;
        </span>
    </button>
);

const PortraitToolsCategoryPage: React.FC<PortraitToolsCategoryPageProps> = ({ onNavigate }) => {
    return (
        <main className="flex-1 overflow-y-auto p-4 sm:p-8 animate-fade-in">
            <div className="container mx-auto">
                <div className="text-left mb-12 sm:mb-16">
                    <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-gray-100">
                        AI Portrait Tools
                    </h1>
                    <p className="max-w-3xl mt-4 text-lg text-gray-400">
                        Perfect your portraits with powerful, specialized AI. Generate professional headshots for your LinkedIn profile, create official ID photos without leaving home, virtually try on a new hairstyle, or have fun with our realistic face swap tool. These features are designed to make every person look their best.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {portraitToolsCategory.tools.map(tool => (
                        <ToolCard key={tool.name} tool={tool} onNavigate={onNavigate} />
                    ))}
                </div>

                <div className="max-w-5xl mx-auto mt-16 text-gray-300 space-y-12">
                    <section>
                        <h2 className="text-3xl font-bold text-center mb-8 text-white">How to Use Our Portrait Tools</h2>
                        <div className="grid md:grid-cols-3 gap-8 text-center">
                            <div className="bg-black/20 p-6 rounded-lg">
                                <p className="text-4xl font-bold text-blue-400 mb-2">1</p>
                                <h3 className="font-bold text-lg text-white mb-2">Upload Your Photo(s)</h3>
                                <p className="text-sm">Start by uploading a clear, front-facing photo. For the Headshot Generator, you'll need to upload 4-10 different selfies.</p>
                            </div>
                            <div className="bg-black/20 p-6 rounded-lg">
                                <p className="text-4xl font-bold text-blue-400 mb-2">2</p>
                                <h3 className="font-bold text-lg text-white mb-2">Follow the Tool's Guide</h3>
                                <p className="text-sm">Each tool has simple steps. You might describe a hairstyle, upload a second photo for a face swap, or simply click a button.</p>
                            </div>
                            <div className="bg-black/20 p-6 rounded-lg">
                                <p className="text-4xl font-bold text-blue-400 mb-2">3</p>
                                <h3 className="font-bold text-lg text-white mb-2">Generate & Download</h3>
                                <p className="text-sm">The AI generates a high-quality, realistic result in seconds. Download your new portrait, headshot, or ID photo for free.</p>
                            </div>
                        </div>
                    </section>
                    
                    <section>
                        <h2 className="text-3xl font-bold text-center mb-8 text-white">Portrait Tool FAQs</h2>
                        <div className="space-y-4 max-w-3xl mx-auto">
                            <div className="bg-black/20 p-4 rounded-lg"><strong className="text-white block mb-1">What photos work best for the Headshot Generator?</strong>For the best results, use 4-10 clear selfies with varied angles, backgrounds, and expressions. This helps the AI learn your face accurately.</div>
                            <div className="bg-black/20 p-4 rounded-lg"><strong className="text-white block mb-1">Is the Passport Photo tool compliant with official regulations?</strong>Our AI is trained on official guidelines to automatically set the correct size (2x2 inches) and a compliant off-white background. However, always double-check your local government's most current requirements.</div>
                            <div className="bg-black/20 p-4 rounded-lg"><strong className="text-white block mb-1">Will the Hairstyle Changer look realistic?</strong>Yes, the AI is designed to match the lighting, angle, and perspective of your original photo to blend the new hairstyle seamlessly for a photorealistic result.</div>
                        </div>
                    </section>
                </div>
            </div>
        </main>
    );
};

export default PortraitToolsCategoryPage;
