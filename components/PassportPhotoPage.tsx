/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useCallback } from 'react';
import { generatePassportPhoto } from '../services/geminiService';
import ToolPageLayout from './ToolPageLayout';
import { PassportIcon } from './icons';
import { Page } from '../App';
import { ToolCategory } from '../services/toolData';

interface PassportPhotoPageProps {
    onNavigate: (page: Page) => void;
    currentPage: Page;
    allTools: ToolCategory[];
}

const PassportPhotoPage: React.FC<PassportPhotoPageProps> = ({ onNavigate, currentPage, allTools }) => {
    const handleGenerate = useCallback((file: File) => {
        return generatePassportPhoto(file);
    }, []);

    const Controls = ({ isLoading }: { isLoading: boolean }) => (
        <div className="flex flex-col gap-4 text-center">
            <h3 className="text-xl font-bold text-white">Ready to Create Your Photo</h3>
             <div className="bg-black/20 p-4 rounded-lg text-sm text-left text-gray-300 w-full">
                <h4 className="font-semibold text-gray-100 mb-2">Photo Requirements for Best Results:</h4>
                <ul className="list-disc list-inside space-y-1 text-gray-400">
                    <li>Use a clear, high-quality, front-facing photo.</li>
                    <li>Have a neutral facial expression with both eyes open.</li>
                    <li>Avoid wearing glasses, hats, or headphones.</li>
                </ul>
            </div>
            <p className="text-sm text-gray-400">The AI will automatically handle the background, centering, and cropping to official standards.</p>
        </div>
    );

    return (
        <ToolPageLayout
            title="AI Passport Photo Maker"
            description="Create official, compliant 2x2 inch passport, visa, and ID photos from the comfort of your home for free. Our AI tool automatically adjusts your photo to meet government standards."
            Icon={PassportIcon}
            controls={<Controls isLoading={false} />}
            onGenerate={handleGenerate}
            generateButtonText="Create Passport Photo"
            howToTitle="How to Create a Passport Photo Online"
            howToSteps={[
                { title: "1. Upload Your Photo", text: "Choose a clear, front-facing portrait of yourself. A photo against a plain wall works best, but any background is acceptable." },
                { title: "2. Click Create", text: "Press the 'Create Passport Photo' button. The AI will instantly crop to the correct size, center your head, and replace the background with a compliant off-white color." },
                { title: "3. Download & Print", text: "Download your compliant, high-resolution 2x2 inch digital passport photo, ready for printing at your local pharmacy or at home." }
            ]}
            faqTitle="Passport Photo FAQs"
            faqs={[
                { question: "Is this photo guaranteed to be accepted by government agencies?", answer: "Our AI is trained on official passport photo guidelines from multiple countries (including the U.S.) to produce a compliant image. However, we always recommend you double-check the specific, most current requirements for your country's passport agency." },
                { question: "What if my original photo has a cluttered background?", answer: "That's not a problem. The AI is designed to identify you as the subject and will automatically replace any background with a solid, uniform, off-white color as required by official guidelines." },
                { question: "Can I wear glasses or a hat in my photo?", answer: "Most passport guidelines do not permit glasses (unless for medical reasons with a doctor's note) or hats. It is strongly recommended to upload a photo without them for the highest chance of acceptance." },
                { question: "What size is the final photo?", answer: "The tool generates a high-resolution digital image with a 1:1 aspect ratio, perfectly suited for printing as a standard 2x2 inch passport photo." }
            ]}
            onNavigate={onNavigate}
            currentPage={currentPage}
            allTools={allTools}
        />
    );
};

export default PassportPhotoPage;