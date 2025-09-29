/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState, useCallback } from 'react';
import { generateFaceSwapImage } from '../services/geminiService';
import ToolPageLayout from './ToolPageLayout';
import { FaceSwapIcon, UploadIcon } from './icons';
import { Page } from '../App';
import { ToolCategory } from '../services/toolData';

type SwapMode = 'currentIsSource' | 'currentIsTarget';

interface FaceSwapPageProps {
    onNavigate: (page: Page) => void;
    currentPage: Page;
    allTools: ToolCategory[];
}

const FaceSwapPage: React.FC<FaceSwapPageProps> = ({ onNavigate, currentPage, allTools }) => {
    const [otherFile, setOtherFile] = useState<File | null>(null);
    const [otherFilePreview, setOtherFilePreview] = useState<string | null>(null);
    const [mode, setMode] = useState<SwapMode>('currentIsTarget');

    const handleOtherFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setOtherFile(file);
            if (otherFilePreview) URL.revokeObjectURL(otherFilePreview);
            setOtherFilePreview(URL.createObjectURL(file));
        }
    };

    const handleGenerate = useCallback((originalFile: File) => {
        if (!otherFile) {
            return Promise.reject(new Error("Please upload the second image to perform the swap."));
        }
        const source = mode === 'currentIsSource' ? originalFile : otherFile;
        const target = mode === 'currentIsSource' ? otherFile : originalFile;
        return generateFaceSwapImage(source, target);
    }, [otherFile, mode]);

    const Controls = ({ isLoading }: { isLoading: boolean }) => (
        <div className="flex flex-col gap-4">
            <div>
                <h3 className="text-xl font-bold text-white mb-2">1. Define Image Roles</h3>
                <p className="text-sm text-gray-400 -mt-2 mb-2">Which image should receive the new face?</p>
                <div className="flex flex-col gap-2">
                    <button onClick={() => setMode('currentIsTarget')} className={`w-full text-left p-3 rounded-md border-2 transition-all ${mode === 'currentIsTarget' ? 'bg-blue-500/20 border-blue-500' : 'bg-gray-700/50 border-transparent hover:bg-gray-600/50'}`}>
                        <p className="font-semibold text-gray-100">Main Image is the Target</p>
                        <p className="text-xs text-gray-400">A face from the new image you upload will be put onto the main image.</p>
                    </button>
                    <button onClick={() => setMode('currentIsSource')} className={`w-full text-left p-3 rounded-md border-2 transition-all ${mode === 'currentIsSource' ? 'bg-blue-500/20 border-blue-500' : 'bg-gray-700/50 border-transparent hover:bg-gray-600/50'}`}>
                        <p className="font-semibold text-gray-100">Main Image is the Source</p>
                        <p className="text-xs text-gray-400">The face from the main image will be put onto the new one you upload.</p>
                    </button>
                </div>
            </div>
            <div>
                <h3 className="text-xl font-bold text-white mb-2">2. Upload Second Image</h3>
                <label htmlFor="other-image-upload" className={`relative flex flex-col items-center justify-center w-full h-32 border-2 border-gray-600 border-dashed rounded-lg cursor-pointer bg-gray-800/50 hover:bg-gray-700/50 transition-colors`}>
                    {otherFilePreview ? <img src={otherFilePreview} alt="Other preview" className="w-full h-full object-cover rounded-md" /> : <div className="text-center"><UploadIcon className="w-8 h-8 text-gray-400 mx-auto" /><p className="text-sm text-gray-300 mt-1">Upload Source/Target Image</p></div>}
                    <input id="other-image-upload" type="file" className="hidden" accept="image/*" onChange={handleOtherFileChange} disabled={isLoading}/>
                </label>
            </div>
             <h3 className="text-xl font-bold text-white mt-4">3. Perform Swap</h3>
        </div>
    );

    return (
        <ToolPageLayout
            title="AI Face Swap Online Free"
            description="Swap faces between two photos online for free. Our AI ensures a high-quality, realistic blend of lighting, skin tones, and perspective for hilarious and creative results."
            Icon={FaceSwapIcon}
            controls={<Controls isLoading={false} />}
            onGenerate={handleGenerate}
            generateButtonText="Swap Faces"
            howToTitle="How to Swap Faces in 3 Easy Steps"
            howToSteps={[
                { title: "1. Upload Main Photo", text: "Start by uploading your primary image. This can be either the source of the face or the target image that will receive a new face." },
                { title: "2. Define Roles & Upload 2nd Photo", text: "Specify whether your main image is the 'Source' or 'Target', then upload your second photo to complete the pair." },
                { title: "3. Click Swap & Download", text: "Press the button and the AI will perform a realistic face swap, seamlessly blending it. Download your fun new creation!" }
            ]}
            faqTitle="Face Swap FAQs"
            faqs={[
                { question: "Will the face swap look realistic?", answer: "Yes, our AI is specifically designed to analyze the target image's environment. It meticulously adjusts the source face's lighting, shadows, and skin tone to match perfectly for a seamless and realistic blend." },
                { question: "What kind of photos produce the best results?", answer: "For the highest quality swaps, use clear, well-lit photos where the faces are relatively front-facing. Results are best when head angles and poses are not drastically different between the two images." },
                { question: "Is this tool free to use?", answer: "Yes, our online face swap tool is completely free. You can create as many swaps as you like." },
                { question: "Are my photos kept private?", answer: "Absolutely. Your images are processed securely and are not stored on our servers. Your privacy is a top priority." }
            ]}
            onNavigate={onNavigate}
            currentPage={currentPage}
            allTools={allTools}
        />
    );
};

export default FaceSwapPage;
