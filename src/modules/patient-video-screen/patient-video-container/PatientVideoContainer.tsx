import { useRouter } from 'next/router';
import { useCallback, useEffect, useRef } from 'react';
import { useStore } from 'zustand';

import { useMediaControls, useRemoteUsers, useTRTCRoom } from '@/hooks';

import userInfoStore from '@/stores/userInfo.store';

import {
  ErrorState,
  LoadingState,
  MediaControls,
  PatientVideoLayout,
} from '@/components';

const PatientVideoContainer = () => {
  const router = useRouter();
  const hasSetupEventListenersRef = useRef(false);

  const {
    userInfo: { userId },
  } = useStore(userInfoStore);

  // Custom hooks
  const { currentRoomId, isJoining, joinError, exitRoom } = useTRTCRoom();

  const { isVideoOn, isMicrophoneOn, toggleMicrophone, toggleVideo } =
    useMediaControls();

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

  // Setup remote user event listeners - only run once
  useEffect(() => {
    if (!userId || hasSetupEventListenersRef.current) return;

    hasSetupEventListenersRef.current = true;
    console.log(
      'Setting up remote user event listeners in PatientVideoContainer...'
    );
    setupEventListeners(handleEndCall);

    return () => {
      hasSetupEventListenersRef.current = false;
      cleanupEventListeners();
    };
  }, [userId, setupEventListeners, cleanupEventListeners, handleEndCall]);

  // Check for existing remote users when room is joined
  useEffect(() => {
    if (currentRoomId && !isJoining) {
      console.log('Room joined, checking for existing remote users...');
      // Add a small delay to ensure everything is ready
      setTimeout(() => {
        checkExistingRemoteUsers();
      }, 1000);
    }
  }, [currentRoomId, isJoining, checkExistingRemoteUsers]);

  // Show loading state
  if (isJoining) {
    return <LoadingState />;
  }

  // Show error state
  if (joinError) {
    return <ErrorState error={joinError} />;
  }

  return (
    <div className="relative">
      <PatientVideoLayout key={currentRoomId || 'waiting'} remoteUsers={remoteUsers} />

      <MediaControls
        isVideoOn={isVideoOn}
        isMicrophoneOn={isMicrophoneOn}
        onToggleMicrophone={toggleMicrophone}
        onToggleVideo={toggleVideo}
      />
    </div>
  );
};

export default PatientVideoContainer;
