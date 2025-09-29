/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI, Chat, GenerateContentResponse } from '@google/genai';
import { systemInstruction } from '../services/chatService';
import { CloseIcon, SendIcon, SparkleIcon } from './icons';

interface TextChatBotProps {
  onClose: () => void;
}

interface Message {
  role: 'user' | 'model';
  text: string;
}

const TextChatBot: React.FC<TextChatBotProps> = ({ onClose }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatRef = useRef<Chat | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });
    chatRef.current = ai.chats.create({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction,
      },
    });

    setMessages([{ role: 'model', text: "Hello! I'm the PhotoMeld assistant. Ask me anything about our tools and features." }]);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!input.trim() || !chatRef.current || isLoading) return;

    const userMessage: Message = { role: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    const currentInput = input;
    setInput('');
    setIsLoading(true);

    try {
      const response: GenerateContentResponse = await chatRef.current.sendMessage({ message: currentInput });
      
      const botMessage: Message = { role: 'model', text: response.text };
      setMessages(prev => [...prev, botMessage]);

    } catch (error) {
      console.error('Chatbot error:', error);
      const errorMessage: Message = { role: 'model', text: 'Sorry, I encountered an error. Please try again.' };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-end justify-end z-50 animate-fade-in">
      <div className="bg-gray-800 border border-gray-700 rounded-xl shadow-2xl w-full max-w-md h-[70vh] flex flex-col m-4 animate-fade-in">
        <header className="flex items-center justify-between p-4 border-b border-gray-700">
          <div className="flex items-center gap-3">
            <SparkleIcon className="w-6 h-6 text-blue-400" />
            <h2 className="text-lg font-bold text-gray-100">PhotoMeld Assistant</h2>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white" aria-label="Close chat">
            <CloseIcon className="h-6 w-6" />
          </button>
        </header>

        <main className="flex-1 p-4 overflow-y-auto space-y-4">
          {messages.map((msg, index) => (
            <div key={index} className={`flex items-end gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-xs md:max-w-sm p-3 rounded-2xl ${msg.role === 'user' ? 'bg-blue-600 text-white rounded-br-none' : 'bg-gray-700 text-gray-200 rounded-bl-none'}`}>
                <p className="text-sm">{msg.text}</p>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="p-3 rounded-2xl bg-gray-700 rounded-bl-none">
                <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-pulse delay-0"></span>
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-pulse delay-150"></span>
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-pulse delay-300"></span>
                </div>
              </div>
            </div>
          )}
           <div ref={messagesEndRef} />
        </main>

        <footer className="p-4 border-t border-gray-700">
          <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about a tool or feature..."
              className="flex-grow bg-gray-900 border border-gray-600 text-gray-200 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
              disabled={isLoading}
            />
            <button type="submit" className="bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-500 disabled:opacity-50" disabled={isLoading || !input.trim()}>
              <SendIcon className="w-6 h-6" />
            </button>
          </form>
        </footer>
      </div>
    </div>
  );
};

export default TextChatBot;