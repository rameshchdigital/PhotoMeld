/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState, useRef, useEffect, MouseEvent, useImperativeHandle, forwardRef, useCallback } from 'react';
import type { SelectionTool } from './EditPanel';

type Point = { x: number; y: number };

export type Selection = {
    type: 'rect' | 'lasso' | 'magicWand';
    path: Path2D; // Use Path2D for all selection types for consistency
    imageData?: ImageData; // Store the mask data for magic wand
};

export type EditorCanvasRef = {
    generateMask: () => Promise<File | null>;
};

interface EditorCanvasProps {
    imageRef: React.RefObject<HTMLImageElement>;
    imageUrl: string;
    activeTool: SelectionTool | 'crop' | 'move';
    selection: Selection | null;
    onSelectionChange: (selection: Selection | null) => void;
    isCropping: boolean;
    aspect?: number;
    onCropChange: (crop: { x: number, y: number, width: number, height: number } | null) => void;
    magicWandTolerance: number;
}

const EditorCanvas = forwardRef<EditorCanvasRef, EditorCanvasProps>(({
    imageRef,
    imageUrl,
    activeTool,
    selection,
    onSelectionChange,
    isCropping,
    aspect,
    onCropChange,
    magicWandTolerance,
}, ref) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const selectionCanvasRef = useRef<HTMLCanvasElement>(null);

    // Hidden canvas for getting image data for magic wand
    const hiddenCanvasRef = useRef<HTMLCanvasElement | null>(null);

    // Cropping state
    const [crop, setCrop] = useState<{ x: number, y: number, width: number, height: number }>({ x: 0, y: 0, width: 0, height: 0 });
    const [isDrawing, setIsDrawing] = useState(false);
    
    // Lasso specific state
    const [lassoPoints, setLassoPoints] = useState<Point[]>([]);

    // Marching ants animation
    const animationFrameRef = useRef<number>();
    const dashOffset = useRef(0);

    // --- Imperative Handle for Mask Generation ---
    // FIX: Add a dependency array to the `useImperativeHandle` hook. This ensures the `generateMask` function does not have a stale closure over the `selection` prop, which may resolve obscure type inference issues.
    useImperativeHandle(ref, () => ({
        generateMask: async (): Promise<File | null> => {
            const image = imageRef.current;
            if (!image || !selection) return null;
            
            const maskCanvas = document.createElement('canvas');
            maskCanvas.width = image.naturalWidth;
            maskCanvas.height = image.naturalHeight;
            const ctx = maskCanvas.getContext('2d');
            if (!ctx) return null;

            ctx.fillStyle = 'black';
            ctx.fillRect(0, 0, maskCanvas.width, maskCanvas.height);

            ctx.fillStyle = 'white';
            if (selection.type === 'magicWand' && selection.imageData) {
                // For magic wand, we draw the pre-computed mask directly for perfect accuracy
                const tempCanvas = document.createElement('canvas');
                tempCanvas.width = selection.imageData.width;
                tempCanvas.height = selection.imageData.height;
                const tempCtx = tempCanvas.getContext('2d');
                if (tempCtx) {
                    tempCtx.putImageData(selection.imageData, 0, 0);
                    ctx.drawImage(tempCanvas, 0, 0);
                }
            } else {
                // For rect and lasso, we draw the path
                ctx.fill(selection.path);
            }

            return new Promise(resolve => {
                maskCanvas.toBlob(blob => {
                    if (blob) {
                        resolve(new File([blob], 'mask.png', { type: 'image/png' }));
                    } else {
                        resolve(null);
                    }
                }, 'image/png');
            });
        }
    }), [selection]);

    // --- Canvas and Image setup ---
    useEffect(() => {
        // Load image data into hidden canvas when imageUrl changes
        const image = new Image();
        image.crossOrigin = "anonymous";
        image.src = imageUrl;
        image.onload = () => {
            if (!hiddenCanvasRef.current) {
                hiddenCanvasRef.current = document.createElement('canvas');
            }
            const canvas = hiddenCanvasRef.current;
            canvas.width = image.naturalWidth;
            canvas.height = image.naturalHeight;
            const ctx = canvas.getContext('2d');
            ctx?.drawImage(image, 0, 0);
            console.log('Image data loaded into hidden canvas.');
        };
    }, [imageUrl]);

    // --- Drawing and Animation Loop ---
    const drawSelection = useCallback(() => {
        const canvas = selectionCanvasRef.current;
        const image = imageRef.current;
        if (!canvas || !image || !selection) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Ensure canvas is sized to the displayed image
        canvas.width = image.clientWidth;
        canvas.height = image.clientHeight;
        const scaleX = image.clientWidth / image.naturalWidth;
        const scaleY = image.clientHeight / image.naturalHeight;
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Create a scaled path for rendering
        const scaledPath = new Path2D();
        const matrix = new DOMMatrix().scale(scaleX, scaleY);
        scaledPath.addPath(selection.path, matrix);

        // Marching ants style
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 1;
        ctx.setLineDash([5, 5]);
        ctx.lineDashOffset = dashOffset.current;
        ctx.stroke(scaledPath);

        ctx.strokeStyle = 'black';
        ctx.lineDashOffset = dashOffset.current + 5;
        ctx.stroke(scaledPath);

    }, [selection, imageRef]);

    useEffect(() => {
        const animate = () => {
            dashOffset.current = (dashOffset.current - 0.5) % 10;
            drawSelection();
            animationFrameRef.current = requestAnimationFrame(animate);
        };

        if (selection) {
            animationFrameRef.current = requestAnimationFrame(animate);
        } else {
            // Clear canvas if no selection
            const canvas = selectionCanvasRef.current;
            const ctx = canvas?.getContext('2d');
            ctx?.clearRect(0, 0, canvas.width, canvas.height);
        }

        return () => {
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
        };
    }, [selection, drawSelection]);

    // --- Mouse Event Handlers ---
    const getCoords = (e: MouseEvent<HTMLDivElement>): Point | null => {
        const container = containerRef.current;
        const image = imageRef.current;
        if (!container || !image) return null;

        const rect = container.getBoundingClientRect();
        return {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        };
    };

    const getNaturalCoords = (p: Point): Point | null => {
        const image = imageRef.current;
        if (!image || image.clientWidth === 0 || image.clientHeight === 0) return null;
        const scaleX = image.naturalWidth / image.clientWidth;
        const scaleY = image.naturalHeight / image.clientHeight;
        return { x: Math.round(p.x * scaleX), y: Math.round(p.y * scaleY) };
    }

    const handleMouseDown = (e: MouseEvent<HTMLDivElement>) => {
        const startPoint = getCoords(e);
        if (!startPoint) return;
        
        setIsDrawing(true);

        if (isCropping) {
            setCrop({ x: startPoint.x, y: startPoint.y, width: 0, height: 0 });
            return;
        }

        switch (activeTool) {
            case 'rectangle':
                onSelectionChange({
                    type: 'rect',
                    path: new Path2D(),
                });
                setCrop({ x: startPoint.x, y: startPoint.y, width: 0, height: 0 }); // Use crop state for drawing rect
                break;
            case 'lasso':
                setLassoPoints([startPoint]);
                break;
        }
    };

    const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
        if (!isDrawing) return;
        const movePoint = getCoords(e);
        if (!movePoint) return;
        
        if (isCropping) {
            let width = movePoint.x - crop.x;
            let height = movePoint.y - crop.y;
    
            if (aspect) {
                if (width * aspect > height) {
                    height = width / aspect;
                } else {
                    width = height * aspect;
                }
            }
            setCrop(c => ({ ...c, width, height }));
            return;
        }

        switch (activeTool) {
            case 'rectangle':
                setCrop(c => ({ ...c, width: movePoint.x - c.x, height: movePoint.y - c.y }));
                break;
            case 'lasso':
                setLassoPoints(prev => [...prev, movePoint]);
                break;
        }
    };

    const handleMouseUp = () => {
        if (!isDrawing) return;
        setIsDrawing(false);
        
        if (isCropping) {
            onCropChange(crop);
            return;
        }

        const image = imageRef.current;
        if (!image) return;

        const scaleX = image.naturalWidth / image.clientWidth;
        const scaleY = image.naturalHeight / image.clientHeight;
        const path = new Path2D();

        switch (activeTool) {
            case 'rectangle':
                path.rect(crop.x * scaleX, crop.y * scaleY, crop.width * scaleX, crop.height * scaleY);
                onSelectionChange({ type: 'rect', path });
                break;
            case 'lasso':
                if (lassoPoints.length > 1) {
                    const scaledPoints = lassoPoints.map(p => ({ x: p.x * scaleX, y: p.y * scaleY }));
                    path.moveTo(scaledPoints[0].x, scaledPoints[0].y);
                    scaledPoints.slice(1).forEach(p => path.lineTo(p.x, p.y));
                    path.closePath();
                    onSelectionChange({ type: 'lasso', path });
                }
                setLassoPoints([]);
                break;
        }
    };

    // --- Magic Wand Logic ---
    const handleMagicWandClick = (e: MouseEvent<HTMLDivElement>) => {
        if (activeTool !== 'magicWand') return;
        
        const clickPoint = getCoords(e);
        // FIX: Add a guard clause to prevent a potential null reference when using clickPoint!.
        if (!clickPoint) return;
        const naturalClickPoint = getNaturalCoords(clickPoint);
        const hiddenCanvas = hiddenCanvasRef.current;

        if (!naturalClickPoint || !hiddenCanvas) return;

        const ctx = hiddenCanvas.getContext('2d', { willReadFrequently: true });
        if (!ctx) return;
        
        const { width, height } = hiddenCanvas;
        const imageData = ctx.getImageData(0, 0, width, height);
        const { data } = imageData;
        const { x, y } = naturalClickPoint;

        const startPos = (y * width + x) * 4;
        const startR = data[startPos];
        const startG = data[startPos + 1];
        const startB = data[startPos + 2];

        const visited = new Uint8Array(width * height);
        const maskData = new Uint8ClampedArray(width * height * 4);
        const queue: Point[] = [{ x, y }];
        
        visited[y * width + x] = 1;

        const toleranceSq = magicWandTolerance * magicWandTolerance;

        while (queue.length > 0) {
            const { x: curX, y: curY } = queue.shift()!;
            
            const pos = (curY * width + curX) * 4;
            maskData[pos] = 255;
            maskData[pos+1] = 255;
            maskData[pos+2] = 255;
            maskData[pos+3] = 255;

            for (const [dx, dy] of [[0, 1], [0, -1], [1, 0], [-1, 0]]) {
                const nextX = curX + dx;
                const nextY = curY + dy;

                if (nextX >= 0 && nextX < width && nextY >= 0 && nextY < height && !visited[nextY * width + nextX]) {
                    visited[nextY * width + nextX] = 1;
                    
                    const nextPos = (nextY * width + nextX) * 4;
                    const r = data[nextPos];
                    const g = data[nextPos + 1];
                    const b = data[nextPos + 2];
                    
                    const distSq = (r - startR)**2 + (g - startG)**2 + (b - startB)**2;
                    if (distSq <= toleranceSq) {
                        queue.push({ x: nextX, y: nextY });
                    }
                }
            }
        }
        
        // This is complex, but for now we'll create a path that is just the bounding box of the mask
        // A more advanced version would trace the contour of the mask
        const path = new Path2D();
        path.rect(0, 0, width, height); // This is a placeholder path for animation. The real mask is in imageData.

        onSelectionChange({
            type: 'magicWand',
            path: path,
            imageData: new ImageData(maskData, width, height),
        });
    };

    // --- Cursor Style & Title ---
    const getCursorStyle = () => {
        if (isCropping || activeTool === 'crop') return 'crosshair';
        if (activeTool === 'move') return 'default';
        return 'cell';
    };

    const getCursorTitle = () => {
        if (isCropping || activeTool === 'crop') return 'Click and drag to select an area to crop.';
        switch(activeTool) {
            case 'rectangle': return 'Click and drag to draw a rectangular selection.';
            case 'lasso': return 'Click and drag to draw a freeform (lasso) selection.';
            case 'magicWand': return `Click on a color to select adjacent pixels with similar colors. Adjust tolerance in the panel.`;
            case 'move': return 'The canvas is not interactive. Select another tool to begin editing.';
            default: return 'Your image ready for editing.';
        }
    };
    
    return (
        <div
            ref={containerRef}
            className="relative select-none"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onClick={handleMagicWandClick}
            style={{ cursor: getCursorStyle() }}
            title={getCursorTitle()}
        >
            <img
                ref={imageRef}
                src={imageUrl}
                alt="Editable"
                className="max-w-full max-h-[60vh] object-contain rounded-lg shadow-2xl block" // `block` is important to remove bottom space
            />
            
            {/* Selection and Crop Overlay Canvas */}
            <canvas ref={selectionCanvasRef} className="absolute top-0 left-0 w-full h-full pointer-events-none" />

            {/* Cropping UI (if active) */}
            {isCropping && (
                 <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute inset-0 bg-black/50" style={{
                        clipPath: `polygon(
                            0% 0%, 100% 0%, 100% 100%, 0% 100%,
                            0% ${crop.y}px,
                            ${crop.x}px ${crop.y}px,
                            ${crop.x}px ${crop.y + crop.height}px,
                            ${crop.x + crop.width}px ${crop.y + crop.height}px,
                            ${crop.x + crop.width}px ${crop.y}px,
                            0 ${crop.y}px
                        )`
                    }} />
                    <div
                        className="absolute border-2 border-dashed border-white"
                        style={{
                            left: crop.x,
                            top: crop.y,
                            width: crop.width,
                            height: crop.height,
                        }}
                    />
                </div>
            )}
        </div>
    );
});

export default EditorCanvas;