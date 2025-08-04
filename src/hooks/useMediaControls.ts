import { useState } from 'react';

import { getTRTCInstance } from '@/utils/trtc';

const trtc = getTRTCInstance();

interface UseMediaControlsReturn {
  isVideoOn: boolean;
  isMicrophoneOn: boolean;
  toggleMicrophone: () => Promise<void>;
  toggleVideo: () => Promise<void>;
}

interface UseMediaControlsProps {
  isVideoStarted?: boolean;
}

export const useMediaControls = (props?: UseMediaControlsProps): UseMediaControlsReturn => {
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isMicrophoneOn, setIsMicrophoneOn] = useState(true);

  const toggleMicrophone = async () => {
    try {
      // Add a small delay to ensure room is ready
      await new Promise(resolve => setTimeout(resolve, 100));

      await trtc.updateLocalAudio({ mute: isMicrophoneOn });
      setIsMicrophoneOn(!isMicrophoneOn);
    } catch (error) {
      console.error('Failed to toggle microphone', error);
      // Don't update state if the operation failed
    }
  };

  const toggleVideo = async () => {
    try {
      // Check if video is started before attempting to toggle
      if (props?.isVideoStarted === false) {
        console.warn('Cannot toggle video: video not started yet');
        return;
      }

      // Add a small delay to ensure room is ready
      await new Promise(resolve => setTimeout(resolve, 100));

      await trtc.updateLocalVideo({ mute: isVideoOn });
      setIsVideoOn(!isVideoOn);
    } catch (error) {
      console.error('Failed to toggle video', error);
      // Don't update state if the operation failed
      // The error might be due to video not being started yet
    }
  };

  return {
    isVideoOn,
    isMicrophoneOn,
    toggleMicrophone,
    toggleVideo,
  };
};
