/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { useState } from 'react';
import { ChatIcon, CloseIcon, MicrophoneIcon, SparkleIcon } from './icons';

interface ChatFABProps {
    onOpenTextChat: () => void;
    onOpenVoiceChat: () => void;
}

const ChatFAB: React.FC<ChatFABProps> = ({ onOpenTextChat, onOpenVoiceChat }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="fixed bottom-6 right-6 z-50">
            <div className="relative flex flex-col items-center gap-3">
                {isOpen && (
                    <div className="flex flex-col items-center gap-3 animate-fade-in">
                        <button 
                            onClick={() => { onOpenVoiceChat(); setIsOpen(false); }}
                            className="w-32 flex items-center justify-start gap-3 bg-gray-700 text-white font-semibold py-2 px-4 rounded-full shadow-lg hover:bg-gray-600 transition-all"
                            title="Start Voice Chat"
                        >
                            <MicrophoneIcon className="w-6 h-6" />
                            <span>Voice</span>
                        </button>
                        <button
                            onClick={() => { onOpenTextChat(); setIsOpen(false); }}
                            className="w-32 flex items-center justify-start gap-3 bg-gray-700 text-white font-semibold py-2 px-4 rounded-full shadow-lg hover:bg-gray-600 transition-all"
                            title="Start Text Chat"
                        >
                            <SparkleIcon className="w-6 h-6" />
                             <span>Text</span>
                        </button>
                    </div>
                )}
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-500 rounded-full flex items-center justify-center text-white shadow-2xl shadow-blue-500/30 hover:scale-105 active:scale-95 transition-transform"
                    aria-label={isOpen ? "Close chat options" : "Open chat options"}
                >
                    {isOpen ? <CloseIcon className="w-8 h-8" /> : <ChatIcon className="w-8 h-8" />}
                </button>
            </div>
        </div>
    );
};

export default ChatFAB;