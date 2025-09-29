/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React from 'react';
import { Page } from '../App';
import { toolCategories, Tool } from '../services/toolData';

interface PhotoEditingCategoryPageProps {
  onNavigate: (page: Page) => void;
}

const photoEditingCategory = toolCategories.find(c => c.page === 'photoEditingCategory')!;

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

const PhotoEditingCategoryPage: React.FC<PhotoEditingCategoryPageProps> = ({ onNavigate }) => {
    return (
        <main className="flex-1 overflow-y-auto p-4 sm:p-8 animate-fade-in">
            <div className="container mx-auto">
                <div className="text-left mb-12 sm:mb-16">
                    <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-gray-100">
                        Photo Editing & Enhancement
                    </h1>
                    <p className="max-w-3xl mt-4 text-lg text-gray-400">
                        This is your complete suite of AI-powered tools to improve and perfect your images. From one-click quality enhancements and upscaling to complex object removal and background manipulation, everything you need for professional-grade results is right here, and it's all free.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {photoEditingCategory.tools.map(tool => (
                        <ToolCard key={tool.name} tool={tool} onNavigate={onNavigate} />
                    ))}
                </div>

                <div className="max-w-5xl mx-auto mt-16 text-gray-300 space-y-12">
                    <section>
                        <h2 className="text-3xl font-bold text-center mb-8 text-white">How to Use Our Photo Editing Tools</h2>
                        <div className="grid md:grid-cols-4 gap-8 text-center">
                            <div className="bg-black/20 p-6 rounded-lg">
                                <p className="text-4xl font-bold text-blue-400 mb-2">1</p>
                                <h3 className="font-bold text-lg text-white mb-2">Select a Tool</h3>
                                <p className="text-sm">Choose a specific tool from this page, like the Image Upscaler or Object Remover, to get started.</p>
                            </div>
                            <div className="bg-black/20 p-6 rounded-lg">
                                <p className="text-4xl font-bold text-blue-400 mb-2">2</p>
                                <h3 className="font-bold text-lg text-white mb-2">Upload Your Image</h3>
                                <p className="text-sm">Drag and drop or click to upload the photo you want to edit. All common formats like JPG and PNG are supported.</p>
                            </div>
                            <div className="bg-black/20 p-6 rounded-lg">
                                <p className="text-4xl font-bold text-blue-400 mb-2">3</p>
                                <h3 className="font-bold text-lg text-white mb-2">Apply the Edit</h3>
                                <p className="text-sm">Follow the simple on-screen controls. Most tools are one-click, while others let you select an area to edit.</p>
                            </div>
                            <div className="bg-black/20 p-6 rounded-lg">
                                <p className="text-4xl font-bold text-blue-400 mb-2">4</p>
                                <h3 className="font-bold text-lg text-white mb-2">Download Your Result</h3>
                                <p className="text-sm">Use the comparison slider to see the changes, then download your enhanced, high-resolution image for free.</p>
                            </div>
                        </div>
                    </section>
                    
                    <section>
                        <h2 className="text-3xl font-bold text-center mb-8 text-white">Photo Editing FAQs</h2>
                        <div className="space-y-4 max-w-3xl mx-auto">
                            <div className="bg-black/20 p-4 rounded-lg"><strong className="text-white block mb-1">What's the difference between Image Upscaler and enhancing quality?</strong>The Upscaler increases the pixel dimensions (e.g., 500px to 2000px) to make an image larger. Enhancing quality improves sharpness and clarity at the original size.</div>
                            <div className="bg-black/20 p-4 rounded-lg"><strong className="text-white block mb-1">How does the Object Remover work?</strong>You use a selection tool (like a brush or lasso) to highlight the object you want to erase. The AI then intelligently reconstructs the background that was behind it.</div>
                            <div className="bg-black/20 p-4 rounded-lg"><strong className="text-white block mb-1">Are these tools really free to use?</strong>Yes, every tool in our Photo Editing suite is completely free. There are no hidden costs or sign-ups required.</div>
                        </div>
                    </section>
                </div>
            </div>
        </main>
    );
};

export default PhotoEditingCategoryPage;
