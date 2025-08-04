import { useState } from 'react';
import TRTC from 'trtc-sdk-v5';

const trtc = TRTC.create();

interface UseMediaControlsReturn {
  isVideoOn: boolean;
  isMicrophoneOn: boolean;
  toggleMicrophone: () => Promise<void>;
  toggleVideo: () => Promise<void>;
}

export const useMediaControls = (): UseMediaControlsReturn => {
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isMicrophoneOn, setIsMicrophoneOn] = useState(true);

  const toggleMicrophone = async () => {
    try {
      await trtc.updateLocalAudio({ mute: isMicrophoneOn });
      setIsMicrophoneOn(!isMicrophoneOn);
    } catch (error) {
      console.error('Failed to toggle microphone', error);
    }
  };

  const toggleVideo = async () => {
    try {
      await trtc.updateLocalVideo({ mute: isVideoOn });
      setIsVideoOn(!isVideoOn);
    } catch (error) {
      console.error('Failed to toggle video', error);
    }
  };

  return {
    isVideoOn,
    isMicrophoneOn,
    toggleMicrophone,
    toggleVideo,
  };
};
