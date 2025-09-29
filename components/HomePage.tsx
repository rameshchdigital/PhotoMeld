/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React from 'react';
import { Page } from '../App';
import { toolCategories, Tool } from '../services/toolData';

interface HomePageProps {
  onNavigate: (page: Page) => void;
}

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


const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
    return (
        <main className="flex-1 overflow-y-auto p-4 sm:p-8 animate-fade-in">
            <div className="container mx-auto">
                <div className="text-center mb-12 sm:mb-16">
                    <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-gray-100">
                        The Ultimate Free AI Photo Editor & Creative Suite
                    </h1>
                    <p className="max-w-3xl mx-auto mt-4 text-lg text-gray-400">
                        Go beyond simple editing. With PhotoMeld, you get a powerful suite of free AI tools designed for everyone. Instantly enhance photos, generate professional headshots, remove backgrounds with a click, create art from text, and so much more. Unleash your creativity today.
                    </p>
                </div>

                <div className="space-y-12">
                    {toolCategories.map(category => (
                        <section key={category.name}>
                            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6 border-l-4 border-blue-500 pl-4">{category.name}</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {category.tools.map(tool => (
                                    <ToolCard key={tool.name} tool={tool} onNavigate={onNavigate} />
                                ))}
                            </div>
                        </section>
                    ))}
                </div>
            </div>
        </main>
    );
};

export default HomePage;