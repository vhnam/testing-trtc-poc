import { useCallback, useEffect, useRef, useState } from 'react';
import { useStore } from 'zustand';

import { LOCAL_VIDEO_VIEW, REMOTE_VIDEO_VIEW } from '@/constants/room';

import { getTRTCInstance } from '@/utils/trtc';

import userInfoStore from '@/stores/userInfo.store';

const trtc = getTRTCInstance();

interface UseTRTCRoomReturn {
  currentRoomId: number | string | null;
  isJoining: boolean;
  isVideoStarted: boolean;
  isAudioStarted: boolean;
  joinError: string;
  joinRoom: (roomId: number | string) => Promise<void>;
  exitRoom: () => Promise<void>;
  startLocalMedia: () => Promise<void>;
}

interface useTRTCRoomProps {
  autoJoin: boolean;
  denoise?: boolean;
  showVirtualBackground?: boolean;
  sdkAppId: number;
  userSig: string;
}

export const useTRTCRoom = ({
  autoJoin = false,
  denoise = false,
  showVirtualBackground = false,
  sdkAppId,
  userSig,
}: useTRTCRoomProps): UseTRTCRoomReturn => {
  const [currentRoomId, setCurrentRoomId] = useState<number | string | null>(
    null
  );
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

  // Helper function to exit existing room
  const exitExistingRoom = useCallback(async () => {
    try {
      console.log('Exiting existing room...');
      await trtc.exitRoom();
      console.log('Successfully exited existing room');
    } catch (error) {
      // Ignore errors when exiting room that doesn't exist
      console.log('No existing room to exit or error during exit:', error);
    }
  }, []);

  // Helper function to enter TRTC room
  const enterTRTCRoom = useCallback(
    async (
      roomId: number | string,
      userId: string,
      sdkAppId: number,
      userSig: string
    ) => {
      console.log('Entering room with sdkAppId:', sdkAppId);
      await trtc.enterRoom({
        ...(typeof roomId === 'number' ? { roomId } : { strRoomId: roomId }),
        sdkAppId,
        userId,
        userSig,
      });
      console.log('Successfully entered room');
    },
    []
  );

  // Helper function to start local video
  const startLocalVideo = useCallback(async () => {
    if (isVideoStarted) return;

    try {
      await trtc.startLocalVideo({
        view: LOCAL_VIDEO_VIEW,
        option: {
          fillMode: 'cover',
          profile: '1440p',
        },
      });

      if (showVirtualBackground) {
        await trtc.startPlugin('VirtualBackground', {
          sdkAppId,
          userId,
          userSig,
          type: 'image',
          src: '/zoom-rmg-green.webp',
        });
      }

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
  }, [isVideoStarted, sdkAppId, showVirtualBackground, userId, userSig]);

  // Helper function to start local audio
  const startLocalAudio = useCallback(async () => {
    if (isAudioStarted) return;

    try {
      await trtc.startLocalAudio();

      if (denoise) {
        await trtc.startPlugin('AIDenoiser', {
          sdkAppId,
          userId,
          userSig,
        });
      }

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
  }, [denoise, isAudioStarted, sdkAppId, userId, userSig]);

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

      // Start video and audio
      await startLocalVideo();
      await startLocalAudio();
    } catch (error) {
      console.error('Failed to start local video/audio:', error);
    } finally {
      isStartingMediaRef.current = false;
    }
  }, [
    isVideoStarted,
    isAudioStarted,
    waitForVideoContainers,
    startLocalVideo,
    startLocalAudio,
  ]);

  // Helper function to schedule media start
  const scheduleMediaStart = useCallback(() => {
    // Clear any existing timeout to prevent multiple calls
    if (videoStartTimeoutRef.current) {
      clearTimeout(videoStartTimeoutRef.current);
    }

    videoStartTimeoutRef.current = setTimeout(async () => {
      await startLocalMedia();
    }, 300); // Increased delay to ensure DOM is ready
  }, [startLocalMedia]);

  const joinRoom = useCallback(
    async (roomId: number | string) => {
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
        await exitExistingRoom();

        // Enter TRTC room
        await enterTRTCRoom(roomId, userId, sdkAppId, userSig);

        // Set room ID first so the video container renders
        setCurrentRoomId(roomId);

        hasJoinedRef.current = true;
        setIsJoining(false);

        // Schedule media start after a delay
        scheduleMediaStart();
      } catch (error) {
        console.error('Failed to join room:', error);
        setJoinError(
          'Failed to join the room. Please check the invitation link.'
        );
        setIsJoining(false);
      }
    },
    [
      userId,
      sdkAppId,
      userSig,
      exitExistingRoom,
      enterTRTCRoom,
      scheduleMediaStart,
    ]
  );

  // Helper function to stop local video
  const stopLocalVideo = useCallback(async () => {
    if (!isVideoStarted) return;

    try {
      if (showVirtualBackground) {
        await trtc.stopPlugin('VirtualBackground');
      }
      await trtc.stopLocalVideo();
    } catch (error) {
      console.log('Error stopping local video:', error);
    }
  }, [isVideoStarted, showVirtualBackground]);

  // Helper function to stop local audio
  const stopLocalAudio = useCallback(async () => {
    if (!isAudioStarted) return;

    try {
      if (denoise) {
        await trtc.stopPlugin('AIDenoiser');
      }
      await trtc.stopLocalAudio();
    } catch (error) {
      console.log('Error stopping local audio:', error);
    }
  }, [denoise, isAudioStarted]);

  // Helper function to reset room state
  const resetRoomState = useCallback(() => {
    setIsVideoStarted(false);
    setIsAudioStarted(false);
    setCurrentRoomId(null);
    hasJoinedRef.current = false;
    retryCountRef.current = 0;
    isStartingMediaRef.current = false;
  }, []);

  // Helper function to clear video start timeout
  const clearVideoStartTimeout = useCallback(() => {
    if (videoStartTimeoutRef.current) {
      clearTimeout(videoStartTimeoutRef.current);
      videoStartTimeoutRef.current = null;
    }
  }, []);

  const exitRoom = useCallback(async () => {
    try {
      // Stop video and audio if they're running
      await stopLocalVideo();
      await stopLocalAudio();

      // Exit TRTC room
      await trtc.exitRoom();

      // Reset room state
      resetRoomState();
      clearVideoStartTimeout();
    } catch (error) {
      console.error('Failed to exit room:', error);
    }
  }, [stopLocalVideo, stopLocalAudio, resetRoomState, clearVideoStartTimeout]);

  // Helper function for cleanup on unmount
  const cleanupOnUnmount = useCallback(() => {
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
  }, []);

  useEffect(() => {
    if (
      !userId ||
      hasJoinedRef.current ||
      hasInitializedRef.current ||
      !autoJoin
    )
      return;

    hasInitializedRef.current = true;
    console.log('Setting up TRTC room and joining...', { userId, autoJoin });

    return () => {
      cleanupOnUnmount();
    };
  }, [userId, cleanupOnUnmount, autoJoin]); // Removed auto-join logic

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
