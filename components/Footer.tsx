/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React from 'react';
import { Page } from '../App';
import { SparkleIcon, TwitterIcon, InstagramIcon, FacebookIcon } from './icons';

interface FooterProps {
    onNavigate: (page: Page) => void;
}

const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
    return (
        <footer className="w-full bg-gray-900/80 border-t border-gray-700/50 mt-16 py-12 px-8 backdrop-blur-sm">
            <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 text-gray-400">
                {/* Section 1: About PhotoMeld */}
                <div className="lg:col-span-2">
                    <div className="flex items-center gap-3 mb-4">
                        <SparkleIcon className="w-7 h-7 text-blue-400" />
                        <h3 className="text-xl font-bold text-white">PhotoMeld</h3>
                    </div>
                    <p className="text-sm">
                        PhotoMeld is a free, all-in-one AI photo editor and creative suite designed to make professional-grade image editing accessible to everyone. Our powerful tools let you enhance photos, generate art, remove backgrounds, and much more, all with the power of artificial intelligence.
                    </p>
                </div>

                {/* Section 2: Important Links */}
                <div>
                    <h3 className="text-lg font-semibold text-white mb-4">Important Links</h3>
                    <ul className="space-y-2 text-sm">
                        <li><button onClick={() => onNavigate('photoEditingCategory')} className="hover:text-blue-400 transition-colors">Photo Editing Tools</button></li>
                        <li><button onClick={() => onNavigate('portraitToolsCategory')} className="hover:text-blue-400 transition-colors">AI Portrait Tools</button></li>
                        <li><button onClick={() => onNavigate('creativeCategory')} className="hover:text-blue-400 transition-colors">Creative & AI Tools</button></li>
                        <li><button onClick={() => onNavigate('fileConverter')} className="hover:text-blue-400 transition-colors">File Converter</button></li>
                    </ul>
                </div>

                {/* Section 3: Social Links */}
                <div>
                    <h3 className="text-lg font-semibold text-white mb-4">Follow Us</h3>
                    <div className="flex items-center gap-4">
                        <a href="#" className="text-gray-400 hover:text-white transition-colors" title="Twitter"><TwitterIcon className="w-6 h-6" /></a>
                        <a href="#" className="text-gray-400 hover:text-white transition-colors" title="Instagram"><InstagramIcon className="w-6 h-6" /></a>
                        <a href="#" className="text-gray-400 hover:text-white transition-colors" title="Facebook"><FacebookIcon className="w-6 h-6" /></a>
                    </div>
                </div>
            </div>
            <div className="text-center text-gray-500 text-sm mt-12 border-t border-gray-700/50 pt-8">
                <p>&copy; {new Date().getFullYear()} PhotoMeld. All Rights Reserved.</p>
            </div>
        </footer>
    );
};

export default Footer;