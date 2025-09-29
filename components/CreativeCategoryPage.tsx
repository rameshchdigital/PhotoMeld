/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React from 'react';
import { Page } from '../App';
import { toolCategories, Tool } from '../services/toolData';

interface CreativeCategoryPageProps {
  onNavigate: (page: Page) => void;
}

const creativeCategory = toolCategories.find(c => c.page === 'creativeCategory')!;

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

const CreativeCategoryPage: React.FC<CreativeCategoryPageProps> = ({ onNavigate }) => {
    return (
        <main className="flex-1 overflow-y-auto p-4 sm:p-8 animate-fade-in">
            <div className="container mx-auto">
                <div className="text-left mb-12 sm:mb-16">
                    <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-gray-100">
                        Creative & Generative AI Tools
                    </h1>
                    <p className="max-w-3xl mt-4 text-lg text-gray-400">
                        Unleash your imagination with tools that create something entirely new. Generate original images and art from text, design a logo for your brand, transform photos into cartoons, or bring your fantasy worlds to life with a custom map. If you can dream it, our AI can help you create it.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {creativeCategory.tools.map(tool => (
                        <ToolCard key={tool.name} tool={tool} onNavigate={onNavigate} />
                    ))}
                </div>

                <div className="max-w-5xl mx-auto mt-16 text-gray-300 space-y-12">
                    <section>
                        <h2 className="text-3xl font-bold text-center mb-8 text-white">How to Use Our Creative AI Tools</h2>
                        <div className="grid md:grid-cols-3 gap-8 text-center">
                            <div className="bg-black/20 p-6 rounded-lg">
                                <p className="text-4xl font-bold text-blue-400 mb-2">1</p>
                                <h3 className="font-bold text-lg text-white mb-2">Describe Your Vision</h3>
                                <p className="text-sm">For generative tools like the Image or Logo generators, start with a clear text prompt. Describe the subject, style, colors, and mood.</p>
                            </div>
                            <div className="bg-black/20 p-6 rounded-lg">
                                <p className="text-4xl font-bold text-blue-400 mb-2">2</p>
                                <h3 className="font-bold text-lg text-white mb-2">Upload a Photo (Optional)</h3>
                                <p className="text-sm">For creative filters like the Cartoonizer or Ghibli Style, you'll start by uploading a source photo for the AI to transform.</p>
                            </div>
                            <div className="bg-black/20 p-6 rounded-lg">
                                <p className="text-4xl font-bold text-blue-400 mb-2">3</p>
                                <h3 className="font-bold text-lg text-white mb-2">Generate & Refine</h3>
                                <p className="text-sm">Click the generate button to see the result. If it's not perfect, tweak your prompt and try again to refine your creation.</p>
                            </div>
                        </div>
                    </section>
                    
                    <section>
                        <h2 className="text-3xl font-bold text-center mb-8 text-white">Creative AI FAQs</h2>
                        <div className="space-y-4 max-w-3xl mx-auto">
                            <div className="bg-black/20 p-4 rounded-lg"><strong className="text-white block mb-1">What does "generative AI" mean?</strong>It refers to artificial intelligence that can create new, original content—like images, art, or text—based on the data it was trained on and the prompts it receives.</div>
                            <div className="bg-black/20 p-4 rounded-lg"><strong className="text-white block mb-1">How can I get better results from the Image Generator?</strong>Be descriptive! Instead of "a dog," try "a photorealistic golden retriever puppy playing in a field of flowers during sunset." Adding details about style, lighting, and composition helps a lot.</div>
                            <div className="bg-black/20 p-4 rounded-lg"><strong className="text-white block mb-1">Can I use the images I create for commercial projects?</strong>Yes, the images you generate are yours to use for any personal or commercial purpose.</div>
                        </div>
                    </section>
                </div>
            </div>
        </main>
    );
};

export default CreativeCategoryPage;
