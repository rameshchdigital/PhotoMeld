/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './components/HomePage';
import FullPhotoEditorPage from './components/FullPhotoEditorPage';
import ImageUpscalerPage from './components/ImageUpscalerPage';
import PhotoColorizerPage from './components/PhotoColorizerPage';
import BackgroundRemoverPage from './components/BackgroundRemoverPage';
import ObjectRemoverPage from './components/ObjectRemoverPage';
import HeadshotGeneratorPage from './components/HeadshotGeneratorPage';
import PassportPhotoPage from './components/PassportPhotoPage';
import HairstyleChangerPage from './components/HairstyleChangerPage';
import FaceSwapPage from './components/FaceSwapPage';
import ImageGeneratorFromTextPage from './components/ImageGeneratorFromTextPage';
import LogoGeneratorPage from './components/LogoGeneratorPage';
import CartoonizerPage from './components/CartoonizerPage';
import GhibliStyleFilterPage from './components/GhibliStyleFilterPage';
import TattooGeneratorPage from './components/TattooGeneratorPage';
import BabyGeneratorPage from './components/BabyGeneratorPage';
import FantasyMapGeneratorPage from './components/FantasyMapGeneratorPage';
import ImageExtenderPage from './components/ImageExtenderPage';
import VirtualTryOnPage from './components/VirtualTryOnPage';
import PhotoEditingCategoryPage from './components/PhotoEditingCategoryPage';
import PortraitToolsCategoryPage from './components/PortraitToolsCategoryPage';
import CreativeCategoryPage from './components/CreativeCategoryPage';
import FileConverterPage from './components/FileConverterPage';
import ContactPage from './components/ContactPage';
import { toolCategories, allTools, otherPages } from './services/toolData';
import ChatFAB from './components/ChatFAB';
import TextChatBot from './components/TextChatBot';
import VoiceChatBot from './components/VoiceChatBot';
import MagicEditorPage from './components/MagicEditorPage';

export type Page = 
  | 'home' 
  | 'photoEditingCategory'
  | 'portraitToolsCategory'
  | 'creativeCategory'
  | 'editor' 
  | 'magicEditor'
  | 'imageUpscaler'
  | 'photoColorizer'
  | 'backgroundRemover'
  | 'objectRemover'
  | 'headshotGenerator'
  | 'passportPhoto'
  | 'hairstyleChanger'
  | 'faceSwap'
  | 'imageGenerator'
  | 'logoGenerator'
  | 'cartoonizer'
  | 'ghibliFilter'
  | 'tattooGenerator'
  | 'babyGenerator'
  | 'fantasyMapGenerator'
  | 'imageExtender'
  | 'virtualTryOn'
  | 'fileConverter'
  | 'contact';

type ChatMode = 'none' | 'text' | 'voice';

const updateMetaTag = (id: string, attribute: string, content: string) => {
    const element = document.getElementById(id);
    if (element) {
        element.setAttribute(attribute, content);
    }
};

const App: React.FC = () => {
    const [currentPage, setCurrentPage] = useState<Page>('home');
    const [chatMode, setChatMode] = useState<ChatMode>('none');

    useEffect(() => {
        let pageTitle = "PhotoMeld";
        let pageDescription = otherPages.home!.description;
        let pageKeywords = otherPages.home!.keywords;
        
        const tool = allTools.find(t => t.page === currentPage);
        const category = toolCategories.find(c => c.page === currentPage);
        const other = otherPages[currentPage];

        if (tool) {
            pageTitle = `${tool.name} | PhotoMeld`;
            pageDescription = tool.description;
            pageKeywords = tool.keywords;
        } else if (category) {
            pageTitle = `${category.name} | PhotoMeld`;
            pageDescription = `Explore ${category.tools.length} free AI tools for ${category.name}, including our ${category.tools.map(t=>t.name).join(', ')}.`;
            pageKeywords = category.keywords;
        } else if (other) {
            pageTitle = other.name;
            pageDescription = other.description;
            pageKeywords = other.keywords;
        }

        document.title = pageTitle;
        updateMetaTag('meta-description', 'content', pageDescription);
        updateMetaTag('meta-keywords', 'content', pageKeywords);
        
        const baseUrl = "https://photomeld.app/";
        const pageUrl = `${baseUrl}#${currentPage}`;
        
        // Update Open Graph & Twitter tags
        updateMetaTag('og-title', 'content', pageTitle);
        updateMetaTag('og-description', 'content', pageDescription);
        updateMetaTag('og-url', 'content', pageUrl);
        updateMetaTag('twitter-title', 'content', pageTitle);
        updateMetaTag('twitter-description', 'content', pageDescription);
        updateMetaTag('twitter-url', 'content', pageUrl);

    }, [currentPage]);

    const handleNavigate = (page: Page) => {
        setCurrentPage(page);
        window.scrollTo(0, 0);
    };

    const handleFunctionCall = (name: string, args: any) => {
        console.log(`Executing function: ${name}`, args);
        switch (name) {
            case 'navigateToPage':
                handleNavigate(args.pageName as Page);
                setChatMode('none');
                break;
            case 'closeChat':
                setChatMode('none');
                break;
            default:
                console.warn(`Unknown function call: ${name}`);
        }
    };

    const renderPage = () => {
        switch (currentPage) {
            case 'home':
                return <HomePage onNavigate={handleNavigate} />;
            case 'editor':
                return <FullPhotoEditorPage onNavigate={handleNavigate} currentPage={currentPage} allTools={toolCategories} />;
            case 'magicEditor':
                return <MagicEditorPage onNavigate={handleNavigate} currentPage={currentPage} allTools={toolCategories} />;
            case 'imageUpscaler':
                 return <ImageUpscalerPage onNavigate={handleNavigate} currentPage={currentPage} allTools={toolCategories} />;
            case 'photoColorizer':
                return <PhotoColorizerPage onNavigate={handleNavigate} currentPage={currentPage} allTools={toolCategories} />;
            case 'backgroundRemover':
                return <BackgroundRemoverPage onNavigate={handleNavigate} currentPage={currentPage} allTools={toolCategories} />;
            case 'objectRemover':
                return <ObjectRemoverPage onNavigate={handleNavigate} currentPage={currentPage} allTools={toolCategories} />;
            case 'headshotGenerator':
                return <HeadshotGeneratorPage onNavigate={handleNavigate} currentPage={currentPage} allTools={toolCategories} />;
            case 'passportPhoto':
                return <PassportPhotoPage onNavigate={handleNavigate} currentPage={currentPage} allTools={toolCategories} />;
            case 'hairstyleChanger':
                return <HairstyleChangerPage onNavigate={handleNavigate} currentPage={currentPage} allTools={toolCategories} />;
            case 'faceSwap':
                return <FaceSwapPage onNavigate={handleNavigate} currentPage={currentPage} allTools={toolCategories} />;
            case 'imageGenerator':
                return <ImageGeneratorFromTextPage onNavigate={handleNavigate} currentPage={currentPage} allTools={toolCategories} />;
            case 'logoGenerator':
                return <LogoGeneratorPage onNavigate={handleNavigate} currentPage={currentPage} allTools={toolCategories} />;
            case 'cartoonizer':
                return <CartoonizerPage onNavigate={handleNavigate} currentPage={currentPage} allTools={toolCategories} />;
            case 'ghibliFilter':
                return <GhibliStyleFilterPage onNavigate={handleNavigate} currentPage={currentPage} allTools={toolCategories} />;
            case 'tattooGenerator':
                return <TattooGeneratorPage onNavigate={handleNavigate} currentPage={currentPage} allTools={toolCategories} />;
            case 'babyGenerator':
                return <BabyGeneratorPage onNavigate={handleNavigate} currentPage={currentPage} allTools={toolCategories} />;
            case 'fantasyMapGenerator':
                return <FantasyMapGeneratorPage onNavigate={handleNavigate} currentPage={currentPage} allTools={toolCategories} />;
            case 'imageExtender':
                return <ImageExtenderPage onNavigate={handleNavigate} currentPage={currentPage} allTools={toolCategories} />;
            case 'virtualTryOn':
                return <VirtualTryOnPage onNavigate={handleNavigate} currentPage={currentPage} allTools={toolCategories} />;
            case 'photoEditingCategory':
                return <PhotoEditingCategoryPage onNavigate={handleNavigate} />;
            case 'portraitToolsCategory':
                return <PortraitToolsCategoryPage onNavigate={handleNavigate} />;
            case 'creativeCategory':
                return <CreativeCategoryPage onNavigate={handleNavigate} />;
            case 'fileConverter':
                return <FileConverterPage />;
            case 'contact':
                return <ContactPage />;
            default:
                return <HomePage onNavigate={handleNavigate} />;
        }
    };

    return (
        <div className="bg-gray-900 text-gray-100 min-h-screen flex flex-col font-sans">
            <Header onNavigate={handleNavigate} />
            <div className="flex-grow flex flex-col">
                {renderPage()}
            </div>
            <Footer onNavigate={handleNavigate} />
            <ChatFAB onOpenTextChat={() => setChatMode('text')} onOpenVoiceChat={() => setChatMode('voice')} />
            {chatMode === 'text' && <TextChatBot onClose={() => setChatMode('none')} />}
            {chatMode === 'voice' && <VoiceChatBot onClose={() => setChatMode('none')} onFunctionCall={handleFunctionCall} />}
        </div>
    );
};

export default App;
