import { useCallback, useRef, useState } from 'react';
import TRTC, { type NetworkQuality } from 'trtc-sdk-v5';

import { getTRTCInstance } from '@/utils/trtc';

const trtc = getTRTCInstance();

interface UseNetworkQualityReturn {
  networkQuality: NetworkQuality | undefined;
  setupNetworkQualityListener: () => void;
  cleanupNetworkQualityListener: () => void;
}

export const useNetworkQuality = (): UseNetworkQualityReturn => {
  const [networkQuality, setNetworkQuality] = useState<NetworkQuality>();
  const hasSetupListenerRef = useRef(false);

  const handleNetworkQuality = useCallback((event: NetworkQuality) => {
    console.log('Network quality update:', event);
    setNetworkQuality(event);
  }, []);

  const setupNetworkQualityListener = useCallback(() => {
    if (hasSetupListenerRef.current) {
      console.log('Network quality listener already setup, skipping...');
      return;
    }

    hasSetupListenerRef.current = true;
    console.log('Setting up network quality listener...');

    trtc.on(TRTC.EVENT.NETWORK_QUALITY, handleNetworkQuality);

    console.log('Network quality listener setup complete');
  }, [handleNetworkQuality]);

  const cleanupNetworkQualityListener = useCallback(() => {
    if (!hasSetupListenerRef.current) {
      console.log('Network quality listener not setup, skipping cleanup...');
      return;
    }

    hasSetupListenerRef.current = false;
    console.log('Cleaning up network quality listener...');

    trtc.off(TRTC.EVENT.NETWORK_QUALITY, handleNetworkQuality);
  }, [handleNetworkQuality]);

  return {
    networkQuality,
    setupNetworkQualityListener,
    cleanupNetworkQualityListener,
  };
};
