import { useCallback, useEffect, useRef, useState } from 'react';
import { useStore } from 'zustand';

import {
  DEFAULT_ROOM_ID,
  LOCAL_VIDEO_VIEW,
  REMOTE_VIDEO_VIEW,
} from '@/constants/room';

import { genTestUserSig } from '@/utils/generateTestUserSig';
import { getTRTCInstance } from '@/utils/trtc';

import userInfoStore from '@/stores/userInfo.store';

const trtc = getTRTCInstance();

interface UseTRTCRoomReturn {
  currentRoomId: number | null;
  isJoining: boolean;
  isVideoStarted: boolean;
  isAudioStarted: boolean;
  joinError: string;
  joinRoom: (roomId: number) => Promise<void>;
  exitRoom: () => Promise<void>;
  startLocalMedia: () => Promise<void>;
}

export const useTRTCRoom = (): UseTRTCRoomReturn => {
  const [currentRoomId, setCurrentRoomId] = useState<number | null>(null);
  const [isJoining, setIsJoining] = useState(false);
  const [isVideoStarted, setIsVideoStarted] = useState(false);
  const [isAudioStarted, setIsAudioStarted] = useState(false);
  const [joinError, setJoinError] = useState<string>('');

  const videoStartTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const hasJoinedRef = useRef(false);
  const retryCountRef = useRef(0);
  const maxRetries = 10; // Maximum number of retries
  const isStartingMediaRef = useRef(false); // Prevent multiple simultaneous media starts
  const hasInitializedRef = useRef(false); // Prevent multiple initializations

  const {
    userInfo: { userId },
  } = useStore(userInfoStore);

  // Helper function to check if video containers exist
  const checkVideoContainers = useCallback(() => {
    const localVideoElement = document.getElementById(LOCAL_VIDEO_VIEW);
    const remoteVideoElement = document.getElementById(REMOTE_VIDEO_VIEW);
    return { localVideoElement, remoteVideoElement };
  }, []);

  // Helper function to wait for video containers with retry
  const waitForVideoContainers = useCallback((): Promise<boolean> => {
    return new Promise((resolve) => {
      const check = () => {
        const { localVideoElement, remoteVideoElement } =
          checkVideoContainers();

        if (localVideoElement && remoteVideoElement) {
          console.log('Video containers found');
          resolve(true);
          return;
        }

        retryCountRef.current++;
        if (retryCountRef.current >= maxRetries) {
          console.error('Max retries reached, video containers not found');
          resolve(false);
          return;
        }

        console.log(
          `Video containers not ready, retrying in 200ms... (attempt ${retryCountRef.current})`
        );
        setTimeout(check, 200);
      };

      check();
    });
  }, [checkVideoContainers]);

  const startLocalMedia = useCallback(async () => {
    // Prevent multiple simultaneous calls
    if (isStartingMediaRef.current) {
      console.log('Media start already in progress, skipping...');
      return;
    }

    // Check if media is already started
    if (isVideoStarted && isAudioStarted) {
      console.log('Media already started, skipping...');
      return;
    }

    try {
      isStartingMediaRef.current = true;
      console.log('Starting local video and audio...');

      // Wait for video containers to be available
      const containersReady = await waitForVideoContainers();
      if (!containersReady) {
        console.error('Video containers not available, cannot start media');
        return;
      }

      // Only start video if not already started
      if (!isVideoStarted) {
        try {
          await trtc.startLocalVideo({
            view: LOCAL_VIDEO_VIEW,
            option: {
              fillMode: 'cover',
              profile: '720p',
            },
          });
          setIsVideoStarted(true);
          console.log('Successfully started local video');
        } catch (error) {
          const errorMessage =
            error instanceof Error ? error.message : String(error);
          if (errorMessage.includes('already started')) {
            console.log('Video already started, updating state');
            setIsVideoStarted(true);
          } else {
            throw error;
          }
        }
      }

      // Only start audio if not already started
      if (!isAudioStarted) {
        try {
          await trtc.startLocalAudio();
          setIsAudioStarted(true);
          console.log('Successfully started local audio');
        } catch (error) {
          const errorMessage =
            error instanceof Error ? error.message : String(error);
          if (errorMessage.includes('already started')) {
            console.log('Audio already started, updating state');
            setIsAudioStarted(true);
          } else {
            throw error;
          }
        }
      }
    } catch (error) {
      console.error('Failed to start local video/audio:', error);
    } finally {
      isStartingMediaRef.current = false;
    }
  }, [isVideoStarted, isAudioStarted, waitForVideoContainers]);

  const joinRoom = useCallback(
    async (roomId: number) => {
      if (!userId) {
        console.log('No userId available, skipping join room');
        return;
      }

      console.log('Attempting to join room:', roomId, 'with userId:', userId);

      try {
        setIsJoining(true);
        setJoinError('');
        retryCountRef.current = 0; // Reset retry count

        // Exit any existing room first to prevent "already start" error
        try {
          console.log('Exiting existing room...');
          await trtc.exitRoom();
          console.log('Successfully exited existing room');
        } catch (error) {
          // Ignore errors when exiting room that doesn't exist
          console.log('No existing room to exit or error during exit:', error);
        }

        const { sdkAppId, userSig } = genTestUserSig({
          userId,
        });

        console.log('Entering room with sdkAppId:', sdkAppId);
        await trtc.enterRoom({
          roomId,
          sdkAppId,
          userId,
          userSig,
        });

        console.log('Successfully entered room');

        // Set room ID first so the video container renders
        setCurrentRoomId(roomId);

        hasJoinedRef.current = true;
        setIsJoining(false);

        // Wait a bit for the DOM to update, then start video
        // Clear any existing timeout to prevent multiple calls
        if (videoStartTimeoutRef.current) {
          clearTimeout(videoStartTimeoutRef.current);
        }

        videoStartTimeoutRef.current = setTimeout(async () => {
          await startLocalMedia();
        }, 300); // Increased delay to ensure DOM is ready
      } catch (error) {
        console.error('Failed to join room:', error);
        setJoinError(
          'Failed to join the room. Please check the invitation link.'
        );
        setIsJoining(false);
      }
    },
    [userId, startLocalMedia]
  );

  const exitRoom = useCallback(async () => {
    try {
      // Stop video and audio if they're running
      if (isVideoStarted) {
        try {
          await trtc.stopLocalVideo();
        } catch (error) {
          console.log('Error stopping local video:', error);
        }
      }

      if (isAudioStarted) {
        try {
          await trtc.stopLocalAudio();
        } catch (error) {
          console.log('Error stopping local audio:', error);
        }
      }

      await trtc.exitRoom();

      // Reset room state
      setIsVideoStarted(false);
      setIsAudioStarted(false);
      setCurrentRoomId(null);
      hasJoinedRef.current = false;
      retryCountRef.current = 0;
      isStartingMediaRef.current = false;

      // Clear video start timeout
      if (videoStartTimeoutRef.current) {
        clearTimeout(videoStartTimeoutRef.current);
        videoStartTimeoutRef.current = null;
      }
    } catch (error) {
      console.error('Failed to exit room:', error);
    }
  }, [isVideoStarted, isAudioStarted]);

  // Auto-join room when component mounts - only run once
  useEffect(() => {
    if (!userId || hasJoinedRef.current || hasInitializedRef.current) return;

    hasInitializedRef.current = true;
    console.log('Setting up TRTC room and joining...');

    // Join the default room with a delay to ensure TRTC is ready
    const joinTimeout = setTimeout(() => {
      joinRoom(DEFAULT_ROOM_ID);
    }, 500); // Increased initial delay

    return () => {
      clearTimeout(joinTimeout);
      // Clean up room state only when component unmounts
      try {
        trtc.exitRoom();
      } catch (error) {
        console.log('Error during cleanup exitRoom:', error);
      }

      hasJoinedRef.current = false;
      hasInitializedRef.current = false;
      setIsVideoStarted(false);
      setIsAudioStarted(false);
      setCurrentRoomId(null);
      retryCountRef.current = 0;
      isStartingMediaRef.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]); // Remove joinRoom from dependencies to prevent infinite loop

  return {
    currentRoomId,
    isJoining,
    isVideoStarted,
    isAudioStarted,
    joinError,
    joinRoom,
    exitRoom,
    startLocalMedia,
  };
};
