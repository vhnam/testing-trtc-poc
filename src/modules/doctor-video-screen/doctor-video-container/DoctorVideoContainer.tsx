import { useRouter } from 'next/router';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useStore } from 'zustand';

import {
  useMediaControls,
  useNetworkQuality,
  useRemoteUsers,
  useTRTCRoom,
} from '@/hooks';

import userInfoStore from '@/stores/userInfo.store';

import {
  AudioVideoConfigurationPanel,
  DoctorVideoLayout,
  EndCallButton,
  LoadingState,
  TakeScreenshotButton,
} from '@/components';
import MicrophoneButton from '@/components/MicrophoneButton';
import VideoButton from '@/components/VideoButton';

import DoctorInvitationDialogContainer from '@/modules/doctor-video-screen/doctor-invitation-dialog-container';

interface DoctorVideoContainerProps {
  sdkAppId: number;
  userSig: string;
}

const DoctorVideoContainer = ({
  sdkAppId,
  userSig,
}: DoctorVideoContainerProps) => {
  const router = useRouter();
  const hasSetupEventListenersRef = useRef(false);
  const [isOpen, setIsOpen] = useState(false);

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
    isVideoStarted,
    isAudioStarted,
  } = useTRTCRoom({
    autoJoin: false,
    showVirtualBackground: false,
    sdkAppId,
    userSig,
  });

  const { isVideoOn, isMicrophoneOn, toggleMicrophone, toggleVideo } =
    useMediaControls({ isVideoStarted });

  const { remoteUsers, setupEventListeners, cleanupEventListeners } =
    useRemoteUsers();

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
      'Setting up remote user event listeners in DoctorVideoContainer...'
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

  // Show loading state
  if (isJoining) {
    return <LoadingState />;
  }

  // Show error state
  if (joinError) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <div className="text-red-600 mb-4">{joinError}</div>
          <button
            onClick={() => router.push('/')}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-center w-full h-[calc(100vh-68px)] items-center relative">
        {currentRoomId && (
          <div className="w-[900px] h-[720px]">
            <DoctorVideoLayout
              remoteUsers={remoteUsers}
              isConfigPanelOpen={isOpen}
            />

            <div className="relative">
              <AudioVideoConfigurationPanel
                isOpen={isOpen}
                networkQuality={networkQuality}
                setIsOpen={setIsOpen}
              />
            </div>
          </div>
        )}
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white p-4 border-solid border-t border-gray-200">
        <div className="flex justify-center">
          {currentRoomId ? (
            <div className="flex items-center justify-between w-[500px]">
              <div>&nbsp;</div>
              <div className="flex gap-4">
                <MicrophoneButton
                  disabled={!isAudioStarted}
                  isMicrophoneOn={isMicrophoneOn}
                  onClick={toggleMicrophone}
                />
                <VideoButton
                  disabled={!isVideoStarted}
                  isVideoOn={isVideoOn}
                  onClick={toggleVideo}
                />
                <TakeScreenshotButton />
              </div>
              <EndCallButton onClick={handleEndCall} />
            </div>
          ) : (
            <DoctorInvitationDialogContainer onAction={handleStartCall} />
          )}
        </div>
      </div>
    </div>
  );
};

export default DoctorVideoContainer;
