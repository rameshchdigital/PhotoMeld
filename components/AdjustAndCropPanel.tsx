/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState, useEffect } from 'react';
import AdjustmentPanel from './AdjustmentPanel';
import CropPanel from './CropPanel';
import { SunIcon, CropIcon } from './icons';

interface AdjustAndCropPanelProps {
  onApplyAdjustment: (prompt: string) => void;
  onEnhanceQuality: () => void;
  onUpscaleImage: () => void;
  onColorizeImage: () => void;
  onApplyCrop: () => void;
  onSetAspect: (aspect: number | undefined) => void;
  isLoading: boolean;
  isCropping: boolean;
  onCropModeChange: (isCropping: boolean) => void;
  previewAdjustments: { brightness: number; contrast: number; saturation: number };
  onPreviewChange: (adjustments: { brightness: number; contrast: number; saturation: number }) => void;
  onApplyRealtimeAdjustments: () => void;
  onResetAdjustments: () => void;
}

type SubTab = 'adjust' | 'crop';

const AdjustAndCropPanel: React.FC<AdjustAndCropPanelProps> = (props) => {
  const [subTab, setSubTab] = useState<SubTab>('adjust');

  const { onCropModeChange } = props;

  useEffect(() => {
    onCropModeChange(subTab === 'crop');
    return () => onCropModeChange(false);
  }, [subTab, onCropModeChange]);

  const tabs: { id: SubTab; label: string; Icon: React.FC<{ className?: string }>, title: string }[] = [
    { id: 'adjust', label: 'Adjust', Icon: SunIcon, title: 'Access color, lighting, and quality adjustments' },
    { id: 'crop', label: 'Crop', Icon: CropIcon, title: 'Access cropping and aspect ratio tools' },
  ];

  return (
    <div className="w-full bg-gray-800/50 border border-gray-700 rounded-lg p-4 flex flex-col gap-4 animate-fade-in backdrop-blur-sm">
      <div className="flex items-center justify-center gap-2 bg-black/20 p-1 rounded-md">
        {tabs.map(({ id, label, Icon, title }) => (
          <button
            key={id}
            onClick={() => setSubTab(id)}
            className={`flex items-center justify-center gap-2 w-full font-semibold py-2 px-4 rounded-md transition-all duration-200 text-sm ${
              subTab === id
                ? 'bg-gray-600/80 text-white'
                : 'text-gray-400 hover:text-white hover:bg-white/10'
            }`}
            title={title}
          >
            <Icon className="w-5 h-5" />
            {label}
          </button>
        ))}
      </div>

      <div className="pt-2">
        {subTab === 'adjust' && (
            <AdjustmentPanel 
                onApplyAdjustment={props.onApplyAdjustment}
                onEnhanceQuality={props.onEnhanceQuality}
                onUpscaleImage={props.onUpscaleImage}
                onColorizeImage={props.onColorizeImage}
                isLoading={props.isLoading}
                previewAdjustments={props.previewAdjustments}
                onPreviewChange={props.onPreviewChange}
                onApplyRealtimeAdjustments={props.onApplyRealtimeAdjustments}
                onResetAdjustments={props.onResetAdjustments}
            />
        )}
        {subTab === 'crop' && (
            <CropPanel
                onApplyCrop={props.onApplyCrop}
                onSetAspect={props.onSetAspect}
                isLoading={props.isLoading}
                isCropping={props.isCropping}
            />
        )}
      </div>
    </div>
  );
};

export default AdjustAndCropPanel;