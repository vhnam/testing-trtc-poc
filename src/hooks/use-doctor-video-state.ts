import { useRouter } from 'next/router';
import { useCallback, useEffect, useRef } from 'react';
import { type NetworkQuality } from 'trtc-sdk-v5';
import { useStore } from 'zustand';

import {
  useMediaControls,
  useNetworkQuality,
  useRemoteUsers,
  useTRTCRoom,
} from '@/hooks';

import userInfoStore from '@/stores/user-info.store';

export interface DoctorVideoState {
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
  networkQuality?: NetworkQuality;

  // Actions
  handleStartCall: (data: { patientId: string }) => Promise<void>;
  handleEndCall: () => Promise<void>;
  toggleMicrophone: () => Promise<void>;
  toggleVideo: () => Promise<void>;
}

interface UseDoctorVideoStateProps {
  sdkAppId: number;
  userSig: string;
}

export const useDoctorVideoState = ({
  sdkAppId,
  userSig,
}: UseDoctorVideoStateProps): DoctorVideoState => {
  const router = useRouter();
  const hasSetupEventListenersRef = useRef(false);

  const {
    userInfo: { userId },
  } = useStore(userInfoStore);

  // Initialize TRTC room hook
  const {
    currentRoomId,
    isJoining,
    joinError,
    exitRoom,
    joinRoom,
    isVideoStarted,
    isAudioStarted,
  } = useTRTCRoom({
    autoJoin: false,
    showVirtualBackground: false,
    sdkAppId,
    userSig,
  });

  // Initialize media controls hook
  const { isVideoOn, isMicrophoneOn, toggleMicrophone, toggleVideo } =
    useMediaControls({ isVideoStarted });

  // Initialize remote users hook
  const { remoteUsers, setupEventListeners, cleanupEventListeners } =
    useRemoteUsers();

  // Initialize network quality hook
  const {
    networkQuality,
    setupNetworkQualityListener,
    cleanupNetworkQualityListener,
  } = useNetworkQuality();

  // Handle end call
  const handleEndCall = useCallback(async () => {
    await exitRoom();
    router.push('/');
  }, [exitRoom, router]);

  // Handle start call with patient ID
  const handleStartCall = useCallback(
    async (data: { patientId: string }) => {
      if (!userId) return;

      console.log('Starting call as doctor with room ID:', data.patientId);

      try {
        await joinRoom(data.patientId);
      } catch (error) {
        console.error('Failed to join room:', error);
      }
    },
    [userId, joinRoom]
  );

  // Setup remote user event listeners - only run once
  useEffect(() => {
    if (!userId || hasSetupEventListenersRef.current) return;

    hasSetupEventListenersRef.current = true;
    console.log(
      'Setting up remote user event listeners in useDoctorVideoState...'
    );
    setupEventListeners();
    setupNetworkQualityListener();

    return () => {
      hasSetupEventListenersRef.current = false;
      cleanupEventListeners();
      cleanupNetworkQualityListener();
    };
  }, [
    userId,
    setupEventListeners,
    cleanupEventListeners,
    setupNetworkQualityListener,
    cleanupNetworkQualityListener,
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
    networkQuality,

    // Actions
    handleStartCall,
    handleEndCall,
    toggleMicrophone,
    toggleVideo,
  };
};
