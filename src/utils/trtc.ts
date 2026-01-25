import TRTC from 'trtc-sdk-v5';
import VirtualBackground from 'trtc-sdk-v5/plugins/video-effect/virtual-background';

// Create TRTC instances to be shared across the application
// Store instances separately based on whether virtual background plugin is included
let trtcInstanceWithPlugin: ReturnType<typeof TRTC.create> | null = null;
let trtcInstanceWithoutPlugin: ReturnType<typeof TRTC.create> | null = null;

export const getTRTCInstance = (includeVirtualBackground = false) => {
  if (includeVirtualBackground) {
    if (!trtcInstanceWithPlugin) {
      console.log('Creating new TRTC instance with VirtualBackground plugin');
      trtcInstanceWithPlugin = TRTC.create({
        plugins: [VirtualBackground],
        assetsPath: '/assets/trtc-sdk',
      });
    }
    return trtcInstanceWithPlugin;
  } else {
    if (!trtcInstanceWithoutPlugin) {
      console.log(
        'Creating new TRTC instance without VirtualBackground plugin'
      );
      trtcInstanceWithoutPlugin = TRTC.create({
        assetsPath: '/assets/trtc-sdk',
      });
    }
    return trtcInstanceWithoutPlugin;
  }
};

export const destroyTRTCInstance = () => {
  if (trtcInstanceWithPlugin) {
    console.log('Destroying TRTC instance with plugin');
    try {
      trtcInstanceWithPlugin.exitRoom();
    } catch (error) {
      console.log('Error during TRTC cleanup:', error);
    }
    trtcInstanceWithPlugin = null;
  }
  if (trtcInstanceWithoutPlugin) {
    console.log('Destroying TRTC instance without plugin');
    try {
      trtcInstanceWithoutPlugin.exitRoom();
    } catch (error) {
      console.log('Error during TRTC cleanup:', error);
    }
    trtcInstanceWithoutPlugin = null;
  }
};
