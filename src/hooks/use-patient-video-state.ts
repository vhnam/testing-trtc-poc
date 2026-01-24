import { useRouter } from 'next/router';
import { useCallback, useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { useStore } from 'zustand';

import { useMediaControls, useRemoteUsers, useTRTCRoom } from '@/hooks';

import userInfoStore from '@/stores/user-info.store';

export interface PatientVideoState {
  // Room state
  currentRoomId: string | number | null;
  isJoining: boolean;
  joinError: string;

  // Media state
  isVideoOn: boolean;
  isMicrophoneOn: boolean;
  isVideoStarted: boolean;
  isAudioStarted: boolean;

  // Remote state
  remoteUsers: string[];

  // Actions
  handleJoinRoom: () => Promise<void>;
  handleEndCall: () => Promise<void>;
  toggleMicrophone: () => Promise<void>;
  toggleVideo: () => Promise<void>;
}

interface UsePatientVideoStateProps {
  sdkAppId: number;
  userSig: string;
}

export const usePatientVideoState = ({
  sdkAppId,
  userSig,
}: UsePatientVideoStateProps): PatientVideoState => {
  const router = useRouter();
  const hasSetupEventListenersRef = useRef(false);

  const {
    userInfo: { userId },
  } = useStore(userInfoStore);

  // Initialize TRTC room hook with patient-specific settings
  const {
    currentRoomId,
    isJoining,
    joinError,
    exitRoom,
    joinRoom,
    isVideoStarted,
    isAudioStarted,
    startLocalMedia,
  } = useTRTCRoom({
    autoJoin: false,
    denoise: true, // Patients use denoise
    showVirtualBackground: false,
    sdkAppId,
    userSig,
  });

  // Initialize media controls hook
  const { isVideoOn, isMicrophoneOn, toggleMicrophone, toggleVideo } =
    useMediaControls({ isVideoStarted });

  // Initialize remote users hook
  const {
    remoteUsers,
    setupEventListeners,
    cleanupEventListeners,
    checkExistingRemoteUsers,
  } = useRemoteUsers();

  // Handle end call
  const handleEndCall = useCallback(async () => {
    await exitRoom();
    router.push('/');
  }, [exitRoom, router]);

  // Handle doctor end call - show toast and then end call
  const handleDoctorEndCall = useCallback(async () => {
    toast.info('The doctor has ended the call', {
      description: 'You will be redirected to the home page.',
      duration: 3000,
    });

    // Wait a bit for the toast to be visible, then end the call
    setTimeout(async () => {
      await handleEndCall();
    }, 2000);
  }, [handleEndCall]);

  // Handle join room (patients join with their userId)
  const handleJoinRoom = useCallback(async () => {
    if (!userId) return;

    try {
      await joinRoom(userId);
    } catch (error) {
      console.error('Failed to join room:', error);
    }
  }, [userId, joinRoom]);

  // Setup remote user event listeners - only run once
  useEffect(() => {
    if (!userId || hasSetupEventListenersRef.current) return;

    hasSetupEventListenersRef.current = true;
    console.log(
      'Setting up remote user event listeners in usePatientVideoState...'
    );
    setupEventListeners(handleEndCall, handleDoctorEndCall);

    return () => {
      hasSetupEventListenersRef.current = false;
      cleanupEventListeners();
    };
  }, [
    userId,
    setupEventListeners,
    cleanupEventListeners,
    handleEndCall,
    handleDoctorEndCall,
  ]);

  // Check for existing remote users when room is joined and start local media
  useEffect(() => {
    if (currentRoomId && !isJoining) {
      console.log(
        'Room joined, starting local media and checking for existing remote users...'
      );

      // Start local media
      setTimeout(async () => {
        console.log('Patient starting local media');
        try {
          await startLocalMedia();
        } catch (error) {
          console.error('Failed to start local media:', error);
        }
      }, 1000);

      // Check for existing remote users
      setTimeout(() => {
        checkExistingRemoteUsers();
      }, 3000); // Increased delay to avoid timing issues
    }
  }, [
    currentRoomId,
    isJoining,
    checkExistingRemoteUsers,
    startLocalMedia,
    userId,
  ]);

  return {
    // Room state
    currentRoomId,
    isJoining,
    joinError,

    // Media state
    isVideoOn,
    isMicrophoneOn,
    isVideoStarted,
    isAudioStarted,

    // Remote state
    remoteUsers,

    // Actions
    handleJoinRoom,
    handleEndCall,
    toggleMicrophone,
    toggleVideo,
  };
};
