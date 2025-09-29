/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState } from 'react';
import FaceRetouchPanel from './FaceRetouchPanel';
import PosePanel from './PosePanel';
import FaceSwapPanel from './FaceSwapPanel';
import HeadshotGeneratorPanel from './HeadshotGeneratorPanel';
import PassportPhotoPanel from './PassportPhotoPanel';
import HairstylePanel from './HairstylePanel';
// FIX: Import missing PoseIcon.
import { FaceIcon, PoseIcon, FaceSwapIcon, HeadshotIcon, PassportIcon, HairstyleIcon } from './icons';

interface PortraitPanelProps {
  onApplyFaceRetouch: (prompt: string) => void;
  onApplyPose: (prompt: string) => void;
  onFaceSwap: (otherImage: File, mode: 'currentIsSource' | 'currentIsTarget') => void;
  onGenerateHeadshots: (selfies: File[]) => void;
  onHeadshotSelect: (dataUrl: string) => void;
  onGeneratePassportPhoto: () => void;
  onGenerateHairstyle: (prompt: string) => void;
  generatedHeadshots: string[];
  isLoading: boolean;
}

type SubTab = 'face' | 'pose' | 'faceswap' | 'headshot' | 'passport' | 'hairstyle';

const PortraitPanel: React.FC<PortraitPanelProps> = (props) => {
  const [subTab, setSubTab] = useState<SubTab>('face');

  const tabs: { id: SubTab; label: string; Icon: React.FC<{ className?: string }>, title: string }[] = [
    { id: 'face', label: 'Face Retouch', Icon: FaceIcon, title: 'Access tools for skin smoothing, teeth whitening, etc.' },
    { id: 'pose', label: 'Pose Edit', Icon: PoseIcon, title: 'Change the pose of a person in the photo' },
    { id: 'faceswap', label: 'Face Swap', Icon: FaceSwapIcon, title: 'Swap a face from one photo onto another' },
    { id: 'headshot', label: 'AI Headshot', Icon: HeadshotIcon, title: 'Generate professional headshots from your selfies' },
    { id: 'passport', label: 'Passport Photo', Icon: PassportIcon, title: 'Create a compliant passport photo' },
    { id: 'hairstyle', label: 'AI Hairstyle', Icon: HairstyleIcon, title: 'Change the hairstyle of the person in the photo' },
  ];

  return (
    <div className="w-full bg-gray-800/50 border border-gray-700 rounded-lg p-4 flex flex-col gap-4 animate-fade-in backdrop-blur-sm">
      <div className="grid grid-cols-6 items-center justify-center gap-1 bg-black/20 p-1 rounded-md">
        {tabs.map(({ id, label, Icon, title }) => (
          <button
            key={id}
            onClick={() => setSubTab(id)}
            className={`flex flex-col items-center justify-center gap-1 w-full font-semibold py-2 px-1 rounded-md transition-all duration-200 text-xs ${
              subTab === id
                ? 'bg-gray-600/80 text-white'
                : 'text-gray-400 hover:text-white hover:bg-white/10'
            }`}
            title={title}
          >
            <Icon className="w-5 h-5" />
            <span>{label}</span>
          </button>
        ))}
      </div>

      <div className="pt-2">
        {subTab === 'face' && <FaceRetouchPanel onApplyFaceRetouch={props.onApplyFaceRetouch} isLoading={props.isLoading} />}
        {subTab === 'pose' && <PosePanel onApplyPose={props.onApplyPose} isLoading={props.isLoading} />}
        {subTab === 'faceswap' && <FaceSwapPanel onFaceSwap={props.onFaceSwap} isLoading={props.isLoading} />}
        {subTab === 'headshot' && <HeadshotGeneratorPanel 
            onGenerate={props.onGenerateHeadshots}
            onHeadshotSelect={props.onHeadshotSelect}
            isLoading={props.isLoading}
            generatedHeadshots={props.generatedHeadshots}
        />}
        {subTab === 'passport' && <PassportPhotoPanel onGenerate={props.onGeneratePassportPhoto} isLoading={props.isLoading} />}
        {subTab === 'hairstyle' && <HairstylePanel onGenerate={props.onGenerateHairstyle} isLoading={props.isLoading} />}
      </div>
    </div>
  );
};

export default PortraitPanel;