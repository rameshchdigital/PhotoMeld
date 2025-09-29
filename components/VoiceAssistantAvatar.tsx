/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React from 'react';

interface VoiceAssistantAvatarProps {
  isSpeaking: boolean;
  isListening: boolean;
  isProcessing: boolean;
}

const VoiceAssistantAvatar: React.FC<VoiceAssistantAvatarProps> = ({ isSpeaking, isListening, isProcessing }) => {
    
    let stateClass = 'idle';
    if (isSpeaking) stateClass = 'speaking';
    else if (isListening) stateClass = 'listening';
    else if (isProcessing) stateClass = 'processing';
    
  return (
    <div className="relative w-64 h-64 mx-auto group">
      <style>
        {`
          /* --- KEYFRAME ANIMATIONS --- */

          /* General float/breathing */
          @keyframes idle-breathe {
            0%, 100% { transform: translateY(0) scale(1); }
            50% { transform: translateY(-1.5px) scale(1.005); }
          }
          
          /* Eye animations */
          @keyframes eye-blink {
            0%, 95%, 100% { transform: scaleY(1); }
            97.5% { transform: scaleY(0.05); }
          }
          @keyframes eyes-think {
            0%, 100% { transform: translateX(0px); }
            25% { transform: translateX(0.5px); }
            75% { transform: translateX(-0.5px); }
          }
           @keyframes eye-widen {
            0%, 100% { transform: scaleY(1); }
            50% { transform: scaleY(1.05); }
          }

          /* Mouth animation */
          @keyframes mouth-speak {
            0%, 100% { transform: scaleY(0.2); }
            25% { transform: scaleY(0.6); }
            50% { transform: scaleY(0.3); }
            75% { transform: scaleY(0.8); }
          }
          
          /* Eyebrow animations */
          @keyframes eyebrows-think {
             0%, 100% { transform: translateY(0); }
             50% { transform: translateY(0.25px); }
          }
           @keyframes eyebrows-listen {
             0%, 100% { transform: translateY(0); }
             50% { transform: translateY(-0.75px); }
          }
          
          /* Glow animation for processing */
          @keyframes processing-glow {
            0%, 100% { opacity: 0; }
            50% { opacity: 0.3; }
          }


          /* --- STATE-BASED STYLES --- */
          .avatar-container #head,
          .avatar-container #eyes-group,
          .avatar-container #eyebrows-group {
            transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
          }
          
          /* IDLE */
          .avatar-container.idle #head {
            animation: idle-breathe 7s ease-in-out infinite;
          }
          .avatar-container.idle #eyelids {
            animation: eye-blink 4s ease-in-out infinite;
          }

          /* LISTENING */
          .avatar-container.listening #head {
            transform: scale(1.01);
          }
          .avatar-container.listening #eyelids {
            animation: eye-widen 1.5s ease-in-out infinite;
          }
          .avatar-container.listening #eyebrows {
             animation: eyebrows-listen 1.5s ease-in-out infinite;
          }
          
          /* PROCESSING */
          .avatar-container.processing #processing-glow-effect {
             animation: processing-glow 1.8s ease-in-out infinite;
          }
          .avatar-container.processing #eyes-group {
             animation: eyes-think 2.5s ease-in-out infinite;
          }
          .avatar-container.processing #eyebrows {
            animation: eyebrows-think 2.5s ease-in-out infinite;
          }

          /* SPEAKING */
          .avatar-container.speaking #mouth-inner {
            animation: mouth-speak 0.4s ease-in-out infinite;
            transform-origin: center;
          }
          .avatar-container.speaking #head {
             animation: idle-breathe 5s ease-in-out infinite -0.5s;
          }
        `}
      </style>
      <svg viewBox="0 0 200 200" className={`avatar-container ${stateClass}`}>
        <defs>
            <radialGradient id="skin-gradient" cx="50%" cy="45%" r="55%">
                <stop offset="0%" stopColor="#F2CBBF"/>
                <stop offset="80%" stopColor="#E4B9A3"/>
                <stop offset="100%" stopColor="#D3A993"/>
            </radialGradient>
            <radialGradient id="processing-glow-gradient" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="rgba(199, 210, 254, 0.5)" />
                <stop offset="100%" stopColor="rgba(199, 210, 254, 0)" />
            </radialGradient>
            <filter id="subtle-shadow">
              <feDropShadow dx="0" dy="1" stdDeviation="1" floodColor="#000000" floodOpacity="0.1"/>
            </filter>
        </defs>

        {/* Processing Glow Effect */}
        <circle id="processing-glow-effect" cx="100" cy="100" r="100" fill="url(#processing-glow-gradient)" opacity="0" />

        <g id="avatar-body" transform="translate(0, 10)">
          {/* Blazer/Shoulders */}
          <path d="M 40 200 C 10 150, 10 100, 50 100 L 150 100 C 190 100, 190 150, 160 200 Z" fill="#757575"/>
          <path d="M 80 100 L 50 100 C 60 120, 75 130, 90 130 L 95 100 Z" fill="#616161"/>
          <path d="M 120 100 L 150 100 C 140 120, 125 130, 110 130 L 105 100 Z" fill="#616161"/>
          
          <g id="head" filter="url(#subtle-shadow)">
              {/* Neck */}
              <path d="M 90 130 C 85 145, 115 145, 110 130 L 105 110 L 95 110 Z" fill="#D3A993"/>
              
              {/* Face */}
              <path d="M 70 120 C 50 100, 50 60, 100 40 C 150 60, 150 100, 130 120 C 120 135, 80 135, 70 120 Z" fill="url(#skin-gradient)"/>
              <path d="M 100 105 C 102 106, 102 108, 100 110 L 98 108 C 98 106, 100 105, 100 105 Z" fill="#C39683" opacity="0.3"/>
              
              <g id="features">
                  {/* Eyebrows */}
                  <g id="eyebrows">
                    <path d="M 78 78 C 82 75, 92 75, 96 78" stroke="#4E342E" fill="none" strokeWidth="2.5" strokeLinecap="round"/>
                    <path d="M 122 78 C 118 75, 108 75, 104 78" stroke="#4E342E" fill="none" strokeWidth="2.5" strokeLinecap="round"/>
                  </g>
                  
                  {/* Eyes */}
                  <g id="eyes-group">
                      {/* Left Eye */}
                      <path d="M 75 88 C 80 82, 95 82, 100 88 C 95 94, 80 94, 75 88 Z" fill="#f5f5f5"/>
                      <circle cx="87.5" cy="88" r="4.5" fill="#5D4037"/>
                      <circle cx="88.5" cy="87" r="1.5" fill="#FFFFFF" opacity="0.9"/>
                      {/* Right Eye */}
                      <path d="M 125 88 C 120 82, 105 82, 100 88 C 105 94, 120 94, 125 88 Z" fill="#f5f5f5"/>
                      <circle cx="112.5" cy="88" r="4.5" fill="#5D4037"/>
                      <circle cx="111.5" cy="87" r="1.5" fill="#FFFFFF" opacity="0.9"/>
                      
                      <g id="eyelids">
                          <path d="M 75 88 C 80 82, 95 82, 100 88" stroke="#D3A993" fill="url(#skin-gradient)" strokeWidth="1" strokeLinecap="round"/>
                          <path d="M 125 88 C 120 82, 105 82, 100 88" stroke="#D3A993" fill="url(#skin-gradient)" strokeWidth="1" strokeLinecap="round"/>
                      </g>
                  </g>

                  {/* Nose */}
                  <path d="M 100 95 C 96 105, 104 105, 100 95 C 100 108, 100 112, 100 112" stroke="#C39683" fill="none" strokeWidth="1.5" strokeLinecap="round" opacity="0.7"/>

                  {/* Mouth */}
                  <g id="mouth">
                     <path d="M 90 128 C 95 131, 105 131, 110 128 C 105 129, 95 129, 90 128 Z" fill="#D81B60"/>
                     <path id="mouth-inner" d="M 92 128.5 C 96 129.5, 104 129.5, 108 128.5" fill="#880E4F" />
                  </g>
              </g>

              {/* Hair */}
              <g id="hair">
                  <path d="M 100 20 C 40 20, 25 80, 60 130 C 65 115, 65 100, 70 80 C 80 50, 90 40, 100 40 Z" fill="#212121"/>
                  <path d="M 100 20 C 160 20, 175 80, 140 130 C 135 115, 135 100, 130 80 C 120 50, 110 40, 100 40 Z" fill="#212121"/>
                  <path d="M 100 20 C 80 25, 60 45, 70 80 C 75 70, 85 65, 100 65 C 115 65, 125 70, 130 80 C 140 45, 120 25, 100 20 Z" fill="#3E2723"/>
                   <path d="M 95 22 C 90 35, 90 50, 95 65" stroke="#4E342E" strokeWidth="1.5" fill="none" opacity="0.5"/>
                   <path d="M 105 22 C 110 35, 110 50, 105 65" stroke="#4E342E" strokeWidth="1.5" fill="none" opacity="0.5"/>
              </g>

              {/* Bindi */}
              <circle cx="100" cy="72" r="1.5" fill="#C62828"/>
          </g>
        </g>
      </svg>
    </div>
  );
};

export default VoiceAssistantAvatar;
