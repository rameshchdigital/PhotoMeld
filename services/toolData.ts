/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

// FIX: Import React to provide the React namespace for React.FC.
import React from 'react';
import { Page } from '../App';
import {
    SparkleIcon, UpscaleIcon, ColorizeIcon, BackgroundIcon, EraseIcon, HeadshotIcon,
    PassportIcon, HairstyleIcon, FaceSwapIcon, LogoIcon, CartoonIcon, GhibliIcon,
    TattooIcon, BabyIcon, MapIcon, ExpandIcon, TshirtIcon, MagicWandIcon, FileSwapIcon, MagicPencilIcon
} from '../components/icons';

export interface Tool {
    name: string;
    description: string;
    keywords: string;
    Icon: React.FC<{ className?: string }>;
    page: Page;
}

export interface ToolCategory {
    name: string;
    page: Page;
    keywords: string;
    tools: Tool[];
}

export const toolCategories: ToolCategory[] = [
    {
        name: "Photo Editing & Enhancement",
        page: 'photoEditingCategory',
        keywords: "photo editing, ai enhancement, image editor, photo tools, improve image quality",
        tools: [
            { name: "AI Magic Editor", description: "Conversational editing with character consistency and image blending.", page: "magicEditor", Icon: MagicPencilIcon, keywords: "ai magic editor, conversational editing, one-shot editing, image blending, scene preservation, character consistency" },
            { name: "Full Photo Editor", description: "All-in-one editor for precise, selection-based generative edits.", page: "editor", Icon: MagicWandIcon, keywords: "photo editor, image editor, generative edit, inpainting, selection edit" },
            { name: "AI Image Upscaler", description: "Increase image resolution and enhance quality without losing detail.", page: "imageUpscaler", Icon: UpscaleIcon, keywords: "image upscaler, enhance photo, increase resolution, ai photo enhancer, 4k upscaler" },
            { name: "AI Photo Colorizer", description: "Add realistic, natural color to black and white photos.", page: "photoColorizer", Icon: ColorizeIcon, keywords: "photo colorizer, colorize black and white, add color to photo, ai colorization" },
            { name: "Background Remover", description: "Automatically remove the background from any image with one click.", page: "backgroundRemover", Icon: BackgroundIcon, keywords: "background remover, transparent background, remove bg, png maker" },
            { name: "Object Remover", description: "Erase unwanted objects, people, or text from your photos.", page: "objectRemover", Icon: EraseIcon, keywords: "object remover, erase object, photo cleanup, remove person from photo" },
            { name: "AI Image Extender", description: "Expand the borders of your photos with generative outpainting.", page: "imageExtender", Icon: ExpandIcon, keywords: "image extender, outpainting, uncrop image, generative fill, expand photo" },
        ]
    },
    {
        name: "AI Portrait Tools",
        page: 'portraitToolsCategory',
        keywords: "portrait editor, ai portrait, face editor, headshot tools, professional photos",
        tools: [
            { name: "AI Headshot Generator", description: "Create professional studio-quality headshots from your selfies.", page: "headshotGenerator", Icon: HeadshotIcon, keywords: "headshot generator, ai headshot, professional headshot, linkedin photo" },
            { name: "AI Passport Photo Maker", description: "Generate compliant passport, visa, or ID photos automatically.", page: "passportPhoto", Icon: PassportIcon, keywords: "passport photo maker, id photo, visa photo, 2x2 photo" },
            { name: "AI Hairstyle Changer", description: "Virtually try on different hairstyles and colors in seconds.", page: "hairstyleChanger", Icon: HairstyleIcon, keywords: "hairstyle changer, virtual hair try on, ai haircut, hair color changer" },
            { name: "AI Face Swap", description: "Realistically swap faces between two different photos for fun.", page: "faceSwap", Icon: FaceSwapIcon, keywords: "face swap, ai face swap, swap faces online, face changer" },
            { name: "AI Virtual Try-On", description: "See how clothes, accessories, or tattoos look on you.", page: "virtualTryOn", Icon: TshirtIcon, keywords: "virtual try on, ai fashion, try on clothes online, virtual dressing room" },
        ]
    },
    {
        name: "Creative & Generative AI",
        page: 'creativeCategory',
        keywords: "creative ai, generative ai, ai tools, art generator, content creation",
        tools: [
            { name: "AI Image Generator", description: "Create original images and art from a simple text description.", page: "imageGenerator", Icon: SparkleIcon, keywords: "ai image generator, text to image, ai art generator, create image from text" },
            { name: "AI Logo Generator", description: "Design a unique, professional logo for your brand or business.", page: "logoGenerator", Icon: LogoIcon, keywords: "logo generator, ai logo maker, create a logo, free logo design" },
            { name: "Photo to Cartoon", description: "Turn your photos into cartoons with various artistic styles.", page: "cartoonizer", Icon: CartoonIcon, keywords: "photo to cartoon, cartoonizer, cartoon yourself, ai cartoon filter" },
            { name: "Ghibli Style Filter", description: "Apply the beautiful, nostalgic art style of Studio Ghibli films.", page: "ghibliFilter", Icon: GhibliIcon, keywords: "ghibli filter, ghibli style, ai anime filter, photo to ghibli" },
            { name: "AI Tattoo Generator", description: "Generate custom tattoo designs from your ideas and concepts.", page: "tattooGenerator", Icon: TattooIcon, keywords: "tattoo generator, ai tattoo design, create tattoo, tattoo idea generator" },
            { name: "AI Baby Generator", description: "Predict what your future baby might look like by combining photos.", page: "babyGenerator", Icon: BabyIcon, keywords: "baby generator, ai baby predictor, future baby, combine faces" },
            { name: "AI Fantasy Map Generator", description: "Create detailed fantasy maps for your stories or games.", page: "fantasyMapGenerator", Icon: MapIcon, keywords: "fantasy map generator, ai map maker, d&d map creator, worldbuilding tool" },
        ]
    },
];

export const allTools: Tool[] = toolCategories.flatMap(category => category.tools);

export const otherPages: { [key in Page]?: { name: string, description: string, keywords: string } } = {
    home: {
        name: "PhotoMeld | Free AI Photo Editor & Creative Suite",
        description: "PhotoMeld is a free, all-in-one AI photo editor and creative suite. Enhance photos, remove backgrounds, generate AI headshots, create art from text, and use dozens of other powerful tools online.",
        keywords: "AI photo editor, free photo editor, background remover, image upscaler, photo enhancer, cartoonizer, headshot generator, AI art generator, virtual try-on, image converter, generative fill, outpainting"
    },
    fileConverter: {
        name: "Free Online Image Converter",
        description: "Quickly and easily convert your images to JPG, PNG, WEBP, and GIF formats. Batch convert multiple files at once. All processing is done securely in your browser.",
        keywords: "image converter, file converter, png to jpg, jpg to png, webp converter, batch image converter"
    },
    contact: {
        name: "Contact Us | PhotoMeld",
        description: "Have questions, feedback, or need support? Get in touch with the PhotoMeld team. We'd love to hear from you.",
        keywords: "contact, support, feedback, help, photomeld contact"
    }
};