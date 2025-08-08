import { useRouter } from 'next/router';
import { useCallback, useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { useStore } from 'zustand';

import { useMediaControls, useRemoteUsers, useTRTCRoom } from '@/hooks';

import userInfoStore from '@/stores/userInfo.store';

import {
  ErrorState,
  LoadingState,
  MediaControls,
  PatientVideoLayout,
} from '@/components';
import { Button } from '@/components/ui/button';

const PatientVideoContainer = () => {
  const router = useRouter();
  const hasSetupEventListenersRef = useRef(false);

  const {
    userInfo: { userId },
  } = useStore(userInfoStore);

  // Custom hooks
  const {
    currentRoomId,
    isJoining,
    joinError,
    exitRoom,
    joinRoom,
    isAudioStarted,
    isVideoStarted,
    startLocalMedia,
  } = useTRTCRoom();

  const { isVideoOn, isMicrophoneOn, toggleMicrophone, toggleVideo } =
    useMediaControls({ isVideoStarted });

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

  // Setup remote user event listeners - only run once
  useEffect(() => {
    if (!userId || hasSetupEventListenersRef.current) return;

    hasSetupEventListenersRef.current = true;
    console.log(
      'Setting up remote user event listeners in PatientVideoContainer...'
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
      setTimeout(() => {
        console.log('Patient starting local media');
        startLocalMedia();
      }, 1000);

      // Check for existing remote users
      setTimeout(() => {
        checkExistingRemoteUsers();
      }, 3000); // Increased delay to avoid timing issues
    }
  }, [currentRoomId, isJoining, checkExistingRemoteUsers, startLocalMedia]);

  // Show loading state
  if (isJoining) {
    console.log('Patient is joining, showing loading state');
    return <LoadingState />;
  }

  // Show error state
  if (joinError) {
    return <ErrorState error={joinError} />;
  }

  return (
    <div className="relative">
      {currentRoomId ? (
        <>
          <PatientVideoLayout remoteUsers={remoteUsers} />

          <MediaControls
            isAudioStarted={isAudioStarted}
            isVideoStarted={isVideoStarted}
            isVideoOn={isVideoOn}
            isMicrophoneOn={isMicrophoneOn}
            onToggleMicrophone={toggleMicrophone}
            onToggleVideo={toggleVideo}
            onEndCall={handleEndCall}
          />
        </>
      ) : (
        <div className="flex justify-center items-center h-screen">
          <div className="text-center">
            <h2 className="text-2xl font-semibold mb-4">Patient Video Call</h2>
            <p className="text-gray-600 mb-8">Click below to join the room</p>
            <Button
              type="button"
              onClick={() => joinRoom(userId)}
              variant="outline"
            >
              Join Room
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientVideoContainer;
