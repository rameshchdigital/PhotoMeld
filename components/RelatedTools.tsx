/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useMemo } from 'react';
import { Page } from '../App';
import { ToolCategory, Tool } from '../services/toolData';

interface RelatedToolsProps {
    category: ToolCategory;
    currentPage: Page;
    onNavigate: (page: Page) => void;
}

const RelatedToolCard: React.FC<{ tool: Tool; onNavigate: (page: Page) => void }> = ({ tool, onNavigate }) => (
    <button
        onClick={() => onNavigate(tool.page)}
        className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-4 text-left flex items-center gap-4 hover:border-blue-500 hover:bg-gray-800 transition-all duration-300 ease-in-out hover:-translate-y-1 group"
    >
        <div className="bg-gray-900 p-3 rounded-lg flex-shrink-0">
            <tool.Icon className="w-6 h-6 text-blue-400" />
        </div>
        <div>
            <h4 className="text-md font-bold text-white">{tool.name}</h4>
            <p className="text-gray-400 text-xs line-clamp-2">{tool.description}</p>
        </div>
    </button>
);

const RelatedTools: React.FC<RelatedToolsProps> = ({ category, currentPage, onNavigate }) => {
    // useMemo ensures the list is shuffled only once when the component props change
    const relatedTools = useMemo(() => {
        const filtered = category.tools.filter(tool => tool.page !== currentPage);
        // Shuffle the array to show a different, relevant selection of tools each time
        const shuffled = filtered.sort(() => 0.5 - Math.random());
        // Limit to a maximum of 4 tools to keep the section focused
        return shuffled.slice(0, 4);
    }, [category, currentPage]);


    if (relatedTools.length === 0) {
        return null;
    }

    return (
        <section className="mt-16">
            <h2 className="text-3xl font-bold text-center mb-8 text-white">Explore Other Tools</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {relatedTools.map(tool => (
                    <RelatedToolCard key={tool.page} tool={tool} onNavigate={onNavigate} />
                ))}
            </div>
        </section>
    );
};

export default RelatedTools;