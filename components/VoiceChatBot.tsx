/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI, LiveServerMessage, Modality, Blob as GenAIBlob, FunctionCall } from '@google/genai';
import { systemInstruction } from '../services/chatService';
import { CloseIcon, MicrophoneIcon } from './icons';
import VoiceAssistantAvatar from './VoiceAssistantAvatar';
import { appControllerTools } from '../services/toolController';

interface VoiceChatBotProps {
  onClose: () => void;
  onFunctionCall: (name: string, args: any) => void;
}

interface TranscriptEntry {
  speaker: 'user' | 'model';
  text: string;
}

// FIX: Define a local interface for the LiveSession object since it's not exported from the library.
interface LiveSession {
    sendRealtimeInput(request: { media: GenAIBlob }): void;
    sendToolResponse(request: { functionResponses: { id: string; name: string; response: { result: string } } }): void;
    close(): void;
}

function encode(bytes: Uint8Array): string {
    let binary = '';
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
}

function decode(base64: string): Uint8Array {
    const binaryString = atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
}

async function decodeAudioData(data: Uint8Array, ctx: AudioContext, sampleRate: number, numChannels: number): Promise<AudioBuffer> {
    const dataInt16 = new Int16Array(data.buffer);
    const frameCount = dataInt16.length / numChannels;
    const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

    for (let channel = 0; channel < numChannels; channel++) {
        const channelData = buffer.getChannelData(channel);
        for (let i = 0; i < frameCount; i++) {
            channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
        }
    }
    return buffer;
}


const VoiceChatBot: React.FC<VoiceChatBotProps> = ({ onClose, onFunctionCall }) => {
    const [isRecording, setIsRecording] = useState(false);
    const [transcript, setTranscript] = useState<TranscriptEntry[]>([]);
    const [status, setStatus] = useState('Initializing...');
    const [isBotSpeaking, setIsBotSpeaking] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    
    const sessionPromiseRef = useRef<Promise<LiveSession> | null>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const inputAudioContextRef = useRef<AudioContext | null>(null);
    const outputAudioContextRef = useRef<AudioContext | null>(null);
    const scriptProcessorRef = useRef<ScriptProcessorNode | null>(null);
    const mediaStreamSourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
    const nextStartTimeRef = useRef(0);
    const audioSourcesRef = useRef(new Set<AudioBufferSourceNode>());
    const speakingTimeoutRef = useRef<number | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    let currentInputTranscription = '';
    let currentOutputTranscription = '';

    const stopRecording = () => {
        if (sessionPromiseRef.current) {
            sessionPromiseRef.current.then(session => session.close());
            sessionPromiseRef.current = null;
        }
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
            streamRef.current = null;
        }
        if (scriptProcessorRef.current) {
            scriptProcessorRef.current.disconnect();
            scriptProcessorRef.current = null;
        }
        if (mediaStreamSourceRef.current) {
            mediaStreamSourceRef.current.disconnect();
            mediaStreamSourceRef.current = null;
        }
        if (inputAudioContextRef.current && inputAudioContextRef.current.state !== 'closed') {
            inputAudioContextRef.current.close();
        }
        if (outputAudioContextRef.current && outputAudioContextRef.current.state !== 'closed') {
            outputAudioContextRef.current.close();
        }
        setIsRecording(false);
        setIsProcessing(false);
        setStatus('Session ended.');
    };

    const startRecording = async () => {
        if (isRecording) return;

        setIsRecording(true);
        setStatus('Connecting...');
        nextStartTimeRef.current = 0;

        try {
            streamRef.current = await navigator.mediaDevices.getUserMedia({ audio: true });
            setStatus('Connected. Listening...');

            inputAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
            outputAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
            const outputNode = outputAudioContextRef.current.createGain();
            
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });
            
            sessionPromiseRef.current = ai.live.connect({
                model: 'gemini-2.5-flash-native-audio-preview-09-2025',
                callbacks: {
                    onopen: () => {
                        if (!inputAudioContextRef.current || !streamRef.current) return;
                        mediaStreamSourceRef.current = inputAudioContextRef.current.createMediaStreamSource(streamRef.current);
                        scriptProcessorRef.current = inputAudioContextRef.current.createScriptProcessor(4096, 1, 1);
                        
                        scriptProcessorRef.current.onaudioprocess = (audioProcessingEvent) => {
                            const inputData = audioProcessingEvent.inputBuffer.getChannelData(0);
                            const pcmBlob: GenAIBlob = {
                                data: encode(new Uint8Array(new Int16Array(inputData.map(i => i * 32768)).buffer)),
                                mimeType: 'audio/pcm;rate=16000',
                            };
                            
                            if (sessionPromiseRef.current) {
                                sessionPromiseRef.current.then((session) => {
                                    session.sendRealtimeInput({ media: pcmBlob });
                                });
                            }
                        };
                        
                        mediaStreamSourceRef.current.connect(scriptProcessorRef.current);
                        scriptProcessorRef.current.connect(inputAudioContextRef.current.destination);
                    },
                    onmessage: async (message: LiveServerMessage) => {
                        if (message.toolCall) {
                            setIsProcessing(true);
                            for (const fc of message.toolCall.functionCalls) {
                                console.log('Function call received:', fc);
                                onFunctionCall(fc.name, fc.args);
                                // Acknowledge the function call
                                sessionPromiseRef.current?.then((session) => {
                                    session.sendToolResponse({
                                        functionResponses: {
                                            id : fc.id,
                                            name: fc.name,
                                            response: { result: "OK, action initiated." },
                                        }
                                    });
                                });
                            }
                        }

                        if (message.serverContent?.outputTranscription) {
                            currentOutputTranscription += message.serverContent.outputTranscription.text;
                        }
                        if (message.serverContent?.inputTranscription) {
                            currentInputTranscription += message.serverContent.inputTranscription.text;
                        }

                        if (message.serverContent?.turnComplete) {
                            if (currentInputTranscription) {
                                setTranscript(prev => [...prev, { speaker: 'user', text: currentInputTranscription }]);
                                setIsProcessing(true);
                            }
                            if (currentOutputTranscription) {
                                setTranscript(prev => [...prev, { speaker: 'model', text: currentOutputTranscription }]);
                            }
                            currentInputTranscription = '';
                            currentOutputTranscription = '';
                        }
                        
                        const base64Audio = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
                        if (base64Audio && outputAudioContextRef.current) {
                            if (isProcessing) setIsProcessing(false);
                            setIsBotSpeaking(true);
                            if (speakingTimeoutRef.current) clearTimeout(speakingTimeoutRef.current);
                            speakingTimeoutRef.current = window.setTimeout(() => setIsBotSpeaking(false), 1500);

                            nextStartTimeRef.current = Math.max(nextStartTimeRef.current, outputAudioContextRef.current.currentTime);
                            const audioBuffer = await decodeAudioData(decode(base64Audio), outputAudioContextRef.current, 24000, 1);
                            const source = outputAudioContextRef.current.createBufferSource();
                            source.buffer = audioBuffer;
                            source.connect(outputNode);
                            outputNode.connect(outputAudioContextRef.current.destination);
                            
                            source.addEventListener('ended', () => audioSourcesRef.current.delete(source));
                            source.start(nextStartTimeRef.current);
                            nextStartTimeRef.current += audioBuffer.duration;
                            audioSourcesRef.current.add(source);
                        }
                    },
                    onerror: (e: ErrorEvent) => {
                        console.error('Session error:', e);
                        setStatus(`Error: ${e.message}. Please try again.`);
                        stopRecording();
                    },
                    onclose: () => {
                        console.debug('Session closed');
                    },
                },
                config: {
                    responseModalities: [Modality.AUDIO],
                    speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } } },
                    systemInstruction: systemInstruction,
                    tools: appControllerTools,
                    inputAudioTranscription: {},
                    outputAudioTranscription: {},
                },
            });

        } catch (error) {
            console.error('Failed to start recording:', error);
            setStatus('Could not access microphone. Please check permissions.');
            setIsRecording(false);
        }
    };

    useEffect(() => {
        setTranscript([{ speaker: 'model', text: "Hello! I'm Meldie, your AI creative partner. How can I help you today?" }]);
        startRecording();
        return () => {
            stopRecording();
        };
    }, []);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [transcript]);

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
            <div className="bg-gray-800 border border-gray-700 rounded-xl shadow-2xl w-full max-w-2xl h-[80vh] flex flex-col m-4">
                <header className="flex items-center justify-between p-4 border-b border-gray-700">
                    <div className="flex items-center gap-3"><MicrophoneIcon className="w-6 h-6 text-blue-400" /><h2 className="text-lg font-bold text-gray-100">AI Voice Assistant</h2></div>
                    <button onClick={onClose} className="text-gray-400 hover:text-white" aria-label="Close chat"><CloseIcon className="h-6 w-6" /></button>
                </header>

                <main className="flex-1 p-4 flex flex-col gap-4 overflow-y-auto">
                    <VoiceAssistantAvatar 
                        isSpeaking={isBotSpeaking} 
                        isListening={isRecording && !isBotSpeaking && !isProcessing}
                        isProcessing={isProcessing}
                    />
                    <div className="w-full space-y-4 mt-4">
                        {transcript.map((entry, index) => (
                           <div key={index} className={`flex items-end gap-2 ${entry.speaker === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-md p-3 rounded-2xl ${entry.speaker === 'user' ? 'bg-blue-600 text-white rounded-br-none' : 'bg-gray-700 text-gray-200 rounded-bl-none'}`}>
                                    <p className="text-sm">{entry.text}</p>
                                </div>
                            </div>
                        ))}
                         <div ref={messagesEndRef} />
                    </div>
                </main>

                <footer className="p-4 border-t border-gray-700 flex flex-col items-center gap-3">
                    <p className="text-sm text-gray-400 h-5">
                      {isProcessing ? 'Thinking...' : isBotSpeaking ? 'Speaking...' : isRecording ? 'Listening...' : status}
                    </p>
                    <button
                        onClick={isRecording ? stopRecording : startRecording}
                        className={`w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 ${isRecording ? 'bg-red-600 hover:bg-red-500 animate-pulse' : 'bg-blue-600 hover:bg-blue-500'}`}
                    >
                        <MicrophoneIcon className="w-10 h-10 text-white" />
                    </button>
                </footer>
            </div>
        </div>
    );
};

export default VoiceChatBot;