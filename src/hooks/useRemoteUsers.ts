import { useCallback, useEffect, useRef, useState } from 'react';
import TRTC, { type TRTCStreamType } from 'trtc-sdk-v5';
import { useStore } from 'zustand';

import { REMOTE_VIDEO_VIEW } from '@/constants/room';

import { getTRTCInstance } from '@/utils/trtc';

import userInfoStore from '@/stores/userInfo.store';

const trtc = getTRTCInstance();

interface UseRemoteUsersReturn {
  remoteUsers: string[];
  handleRemoteUserEnter: (event: { userId: string }) => void;
  handleRemoteUserExit: (event: { userId: string }) => Promise<void>;
  handleRemoteVideoAvailable: (event: {
    userId: string;
    streamType: TRTCStreamType;
  }) => void;
  setupEventListeners: (onRemoteUserExit?: () => void, onDoctorEndCall?: () => void) => void;
  cleanupEventListeners: () => void;
  checkExistingRemoteUsers: () => void;
}

export const useRemoteUsers = (): UseRemoteUsersReturn => {
  const [remoteUsers, setRemoteUsers] = useState<string[]>([]);
  const remoteUsersRef = useRef(remoteUsers);
  const retryCountRef = useRef(0);
  const maxRetries = 10;
  const startingRemoteVideoRef = useRef<Set<string>>(new Set()); // Track which users are having video started
  const hasSetupEventListenersRef = useRef(false); // Prevent multiple event listener setups
  const remoteUserExitListenerRef = useRef<((event: { userId: string }) => Promise<void>) | null>(null); // Store reference to the event listener

  // Note: userId is available from the store but not used in this hook
  // Keeping the import for potential future use
  useStore(userInfoStore);

  // Update ref when state changes
  useEffect(() => {
    remoteUsersRef.current = remoteUsers;
  });

  // Helper function to wait for remote video container
  const waitForRemoteVideoContainer = useCallback((): Promise<boolean> => {
    return new Promise((resolve) => {
      const check = () => {
        const remoteVideoElement = document.getElementById(REMOTE_VIDEO_VIEW);

        if (remoteVideoElement) {
          console.log('Remote video container found');
          resolve(true);
          return;
        }

        retryCountRef.current++;
        if (retryCountRef.current >= maxRetries) {
          console.error(
            'Max retries reached, remote video container not found'
          );
          resolve(false);
          return;
        }

        console.log(
          `Remote video container not ready, retrying in 200ms... (attempt ${retryCountRef.current})`
        );
        setTimeout(check, 200);
      };

      check();
    });
  }, []);

  const handleRemoteUserEnter = useCallback((event: { userId: string }) => {
    console.log('Remote user entered:', event.userId);
    setRemoteUsers((prev) => {
      const newUsers = [...prev, event.userId];
      console.log('Updated remote users:', newUsers);
      return newUsers;
    });
  }, []);

  const handleRemoteUserExit = useCallback(
    async (event: { userId: string }) => {
      console.log('Remote user exited:', event.userId);

      // Stop remote video for the exiting user
      try {
        await trtc.stopRemoteVideo({
          userId: event.userId,
          streamType: 'main' as TRTCStreamType,
        });
        console.log(`Stopped remote video for user: ${event.userId}`);
      } catch (error) {
        console.error(
          `Failed to stop remote video for user ${event.userId}:`,
          error
        );
      }

      // Remove from starting set
      startingRemoteVideoRef.current.delete(event.userId);
      setRemoteUsers((prev) => {
        const newUsers = prev.filter((id) => id !== event.userId);
        console.log('Updated remote users after exit:', newUsers);
        return newUsers;
      });
    },
    []
  );

  const handleRemoteVideoAvailable = useCallback(
    async (event: { userId: string; streamType: TRTCStreamType }) => {
      try {
        if (!event.userId) return;

        const userId = event.userId;
        const streamType = event.streamType;

        console.log(
          `Remote video available for user: ${userId}, streamType: ${streamType}`
        );

        // Prevent duplicate video starts for the same user
        if (startingRemoteVideoRef.current.has(userId)) {
          console.log(`Remote video already being started for user: ${userId}`);
          return;
        }

        startingRemoteVideoRef.current.add(userId);

        // Wait for remote video container to be available
        const containerReady = await waitForRemoteVideoContainer();
        if (!containerReady) {
          console.error(
            'Remote video container not available, cannot start remote video'
          );
          startingRemoteVideoRef.current.delete(userId);
          return;
        }

        console.log('Starting remote video for user:', userId);
        try {
          await trtc.startRemoteVideo({
            userId,
            streamType,
            view: REMOTE_VIDEO_VIEW,
          });
          console.log('Successfully started remote video for user:', userId);
        } catch (error) {
          const errorMessage =
            error instanceof Error ? error.message : String(error);
          if (errorMessage.includes('already started')) {
            console.log(`Remote video already started for user: ${userId}`);
          } else {
            throw error;
          }
        }
      } catch (error) {
        console.error('Failed to start remote video:', error);
      } finally {
        // Remove from starting set
        startingRemoteVideoRef.current.delete(event.userId);
      }
    },
    [waitForRemoteVideoContainer]
  );

  // Function to manually check for existing remote users
  const checkExistingRemoteUsers = useCallback(async () => {
    try {
      console.log('Checking for existing remote users...');

      // Since getRoomInfo doesn't exist, we'll just log that we're checking
      // The remote user events should fire automatically when users are in the room
      console.log(
        'Remote user events should fire automatically for existing users'
      );
    } catch (error) {
      console.error('Error checking existing remote users:', error);
    }
  }, []);

  const setupEventListeners = useCallback(
    (onRemoteUserExit?: () => void, onDoctorEndCall?: () => void) => {
      if (hasSetupEventListenersRef.current) {
        console.log('Event listeners already setup, skipping...');
        return;
      }

      hasSetupEventListenersRef.current = true;
      console.log('Setting up remote user event listeners...');

      // Listen for remote user enter
      trtc.on(TRTC.EVENT.REMOTE_USER_ENTER, handleRemoteUserEnter);

      // Create the remote user exit listener function and store its reference
      const remoteUserExitListener = async (event: { userId: string }) => {
        await handleRemoteUserExit(event);
        
        // Call the doctor end call callback if provided (for patient to show toast when doctor leaves)
        if (onDoctorEndCall) {
          setTimeout(() => {
            onDoctorEndCall();
          }, 100);
        }
        
        // Call the general remote user exit callback if provided (for patient to end call when doctor leaves)
        if (onRemoteUserExit) {
          setTimeout(() => {
            onRemoteUserExit();
          }, 100);
        }
      };

      // Store the reference for cleanup
      remoteUserExitListenerRef.current = remoteUserExitListener;

      // Listen for remote user exit
      trtc.on(TRTC.EVENT.REMOTE_USER_EXIT, remoteUserExitListener);

      // Listen for remote video available
      trtc.on(TRTC.EVENT.REMOTE_VIDEO_AVAILABLE, handleRemoteVideoAvailable);

      // Also listen for remote audio available (in case audio comes first)
      trtc.on(
        TRTC.EVENT.REMOTE_AUDIO_AVAILABLE,
        (event: { userId: string }) => {
          console.log('Remote audio available for user:', event.userId);
        }
      );

      console.log('Remote user event listeners setup complete');
    },
    [handleRemoteUserEnter, handleRemoteUserExit, handleRemoteVideoAvailable]
  );

  const cleanupEventListeners = useCallback(() => {
    if (!hasSetupEventListenersRef.current) {
      console.log('Event listeners not setup, skipping cleanup...');
      return;
    }

    hasSetupEventListenersRef.current = false;
    console.log('Cleaning up remote user event listeners...');

    trtc.off(TRTC.EVENT.REMOTE_USER_ENTER, handleRemoteUserEnter);
    
    // Use the stored reference to remove the event listener
    if (remoteUserExitListenerRef.current) {
      trtc.off(TRTC.EVENT.REMOTE_USER_EXIT, remoteUserExitListenerRef.current);
      remoteUserExitListenerRef.current = null;
    }
    
    trtc.off(TRTC.EVENT.REMOTE_VIDEO_AVAILABLE, handleRemoteVideoAvailable);
    trtc.off(TRTC.EVENT.REMOTE_AUDIO_AVAILABLE, () => {});
  }, [handleRemoteUserEnter, handleRemoteVideoAvailable]);

  return {
    remoteUsers,
    handleRemoteUserEnter,
    handleRemoteUserExit,
    handleRemoteVideoAvailable,
    setupEventListeners,
    cleanupEventListeners,
    checkExistingRemoteUsers,
  };
};
