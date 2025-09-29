/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import { FunctionDeclaration, Tool, Type } from '@google/genai';

const navigateToPage: FunctionDeclaration = {
    name: 'navigateToPage',
    description: 'Navigates the user to a specific tool page within the PhotoFix application.',
    parameters: {
        type: Type.OBJECT,
        properties: {
            pageName: {
                type: Type.STRING,
                description: 'The name of the page to navigate to.',
                enum: [
                    'home', 'editor', 'cartoonizer', 'headshotGenerator', 'tattooGenerator', 
                    'fantasyMapGenerator', 'babyGenerator', 'imageExtender', 'virtualTryOn'
                ]
            }
        },
        required: ['pageName']
    }
};

const applyPhotoEdit: FunctionDeclaration = {
    name: 'applyPhotoEdit',
    description: "Applies a specified edit, filter, or adjustment to the currently loaded image in the editor. This should only be called if the user is already in the 'editor' page and has an image loaded.",
    parameters: {
        type: Type.OBJECT,
        properties: {
            toolCategory: {
                type: Type.STRING,
                description: 'The category of the tool panel where the edit is located.',
                enum: ['edit', 'portrait', 'creative', 'adjust']
            },
            editType: {
                type: Type.STRING,
                description: 'The specific type of generative edit to perform.',
                enum: ['filter', 'adjustment', 'restyle', 'retouch', 'pose', 'hairstyle']
            },
            prompt: {
                type: Type.STRING,
                description: 'The detailed text prompt describing the edit. For example, "apply a vintage film filter" or "make the person smile".'
            }
        },
        required: ['toolCategory', 'editType', 'prompt']
    }
};

const closeChat: FunctionDeclaration = {
    name: 'closeChat',
    description: 'Closes the chat interface. Use this when the user says "close", "exit", or "end chat".',
    parameters: {
        type: Type.OBJECT,
        properties: {},
    }
};

export const appControllerTools: Tool[] = [{
    functionDeclarations: [navigateToPage, applyPhotoEdit, closeChat]
}];