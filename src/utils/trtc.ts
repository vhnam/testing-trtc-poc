import TRTC from 'trtc-sdk-v5';
import VirtualBackground from 'trtc-sdk-v5/plugins/video-effect/virtual-background';

// Create a single TRTC instance to be shared across the application
let trtcInstance: ReturnType<typeof TRTC.create> | null = null;

export const getTRTCInstance = () => {
  if (!trtcInstance) {
    console.log('Creating new TRTC instance');
    trtcInstance = TRTC.create({
      plugins: [VirtualBackground],
      assetsPath: '/assets/trtc-sdk',
    });
  }
  return trtcInstance;
};

export const destroyTRTCInstance = () => {
  if (trtcInstance) {
    console.log('Destroying TRTC instance');
    try {
      trtcInstance.exitRoom();
    } catch (error) {
      console.log('Error during TRTC cleanup:', error);
    }
    trtcInstance = null;
  }
};
