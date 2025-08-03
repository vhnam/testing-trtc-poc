import { useRouter } from 'next/router';
import { useCallback, useEffect, useState } from 'react';
import TRTC, { type NetworkQuality, type TRTCStreamType } from 'trtc-sdk-v5';
import { useStore } from 'zustand';

import {
  DEFAULT_ROOM_ID,
  LOCAL_VIDEO_VIEW,
  REMOTE_VIDEO_VIEW,
} from '@/constants/room';

import { genTestUserSig } from '@/utils/generateTestUserSig';

import { type PatientInvitationSchema } from '@/schemas/PatientInvitation.schema';

import userInfoStore from '@/stores/userInfo.store';

import ConfigButton from '@/components/ConfigButton';
import EndCallButton from '@/components/EndCallButton';
import MicrophoneButton from '@/components/MicrophoneButton';
import NetworkStatus from '@/components/NetworkStatus/NetworkStatus';
import TakeScreenshotButton from '@/components/TakeScreenshotButton';
import VideoButton from '@/components/VideoButton';

import DoctorInvitationDialogContainer from '@/modules/doctor-video-screen/doctor-invitation-dialog-container';

const trtc = TRTC.create();

const DoctorVideoContainer = () => {
  const router = useRouter();
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isMicrophoneOn, setIsMicrophoneOn] = useState(true);
  const [isInCall, setIsInCall] = useState(false);
  const [networkQuality, setNetworkQuality] = useState<NetworkQuality>();

  const {
    userInfo: { userId },
  } = useStore(userInfoStore);

  const handleToggleMicrophone = async () => {
    if (!trtc) return;
    await trtc.updateLocalAudio({ mute: isMicrophoneOn });
    setIsMicrophoneOn(!isMicrophoneOn);
  };

  const handleToggleVideo = async () => {
    if (!trtc) return;
    await trtc.updateLocalVideo({ mute: isVideoOn });
    setIsVideoOn(!isVideoOn);
  };

  const handleEndCall = async () => {
    if (!trtc) return;

    try {
      await trtc.exitRoom();
      await trtc.stopLocalAudio();
      await trtc.stopLocalVideo();

      setIsInCall(false);
      router.push('/');
    } catch (error) {
      console.error('Failed to end call:', error);
    }
  };

  const handleRemoteUserEnter = useCallback(
    async (event: { userId: string }) => {
      if (!trtc) return;

      console.log('Remote user entered:', event.userId);
    },
    [trtc]
  );

  const handleRemoteUserExit = useCallback(
    async (event: { userId: string }) => {
      console.log('Remote user exited:', event.userId);

      // Stop remote video for the exiting user
      if (trtc) {
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
      }
    },
    [trtc]
  );

  const handleStartCall = async (data: PatientInvitationSchema) => {
    try {
      if (!trtc || !userId) return;

      setIsInCall(true);

      const { sdkAppId, userSig } = genTestUserSig({
        userId,
      });

      await trtc.enterRoom({
        roomId: DEFAULT_ROOM_ID,
        sdkAppId,
        userId,
        userSig,
      });

      setIsInCall(true);

      // Wait a bit for the DOM to update, then start video
      setTimeout(async () => {
        try {
          await trtc.startLocalVideo({
            view: LOCAL_VIDEO_VIEW,
            option: {
              fillMode: 'cover',
              profile: '720p',
            },
          });
          await trtc.startLocalAudio();
        } catch (error) {
          console.error('Failed to start local video/audio:', error);
        }
      }, 100);
    } catch (error) {
      console.error('Failed to start call:', error);
    }
  };

  const handleRemoteVideoAvailable = useCallback(
    (event: { userId: string; streamType: TRTCStreamType }) => {
      try {
        if (!trtc || !event.userId) return;
        const userId = event.userId;
        const streamType = event.streamType;
        trtc.startRemoteVideo({
          userId,
          streamType,
          view: REMOTE_VIDEO_VIEW,
        });
      } catch (error) {
        console.error('Failed to start video:', error);
      }
    },
    [trtc]
  );

  const handleNetworkQuality = (event: NetworkQuality) => {
    setNetworkQuality(event);
  };

  useEffect(() => {
    if (!trtc || !userId) return;

    trtc.on(TRTC.EVENT.NETWORK_QUALITY, handleNetworkQuality);
    trtc.on(TRTC.EVENT.REMOTE_USER_ENTER, handleRemoteUserEnter);
    trtc.on(TRTC.EVENT.REMOTE_USER_EXIT, handleRemoteUserExit);
    trtc.on(TRTC.EVENT.REMOTE_VIDEO_AVAILABLE, handleRemoteVideoAvailable);

    return () => {
      trtc.off(TRTC.EVENT.NETWORK_QUALITY, handleNetworkQuality);
      trtc.off(TRTC.EVENT.REMOTE_USER_ENTER, handleRemoteUserEnter);
      trtc.off(TRTC.EVENT.REMOTE_USER_EXIT, handleRemoteUserExit);
      trtc.off(TRTC.EVENT.REMOTE_VIDEO_AVAILABLE, handleRemoteVideoAvailable);
      trtc.exitRoom();
    };
  }, [
    handleRemoteUserEnter,
    handleRemoteUserExit,
    handleRemoteVideoAvailable,
    trtc,
    userId,
  ]);

  return (
    <div>
      <div className="flex justify-center w-full h-[calc(100vh-68px)] items-center relative">
        {isInCall && (
          <div className="w-[500px] h-[640px]">
            <div className="w-full h-[calc(100%-38px)] relative">
              <div
                id={LOCAL_VIDEO_VIEW}
                className="absolute left-6 bottom-4 w-[100px] h-[128px] bg-white [&_video]:align-top shadow-lg rounded-lg overflow-hidden"
              />
              <div className="w-full h-full bg-gray-200 rounded-lg overflow-hidden">
                <div
                  id={REMOTE_VIDEO_VIEW}
                  className="w-full h-full [&_video]:align-top"
                />
              </div>
            </div>
            <div className="bg-white grid grid-cols-2">
              <div className="flex justify-between items-center p-2">
                <p className="text-sm">Your network quality</p>
                <NetworkStatus value={networkQuality?.uplinkNetworkQuality} />
              </div>
              <div className="flex justify-between items-center p-2">
                <p className="text-sm">Patient network quality</p>
                <NetworkStatus value={networkQuality?.downlinkNetworkQuality} />
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white p-4 border-solid border-t border-gray-200">
        <div className="flex justify-center">
          {isInCall ? (
            <div className="flex items-center justify-between w-[500px]">
              <ConfigButton onClick={() => {}} />
              <div className="flex gap-4">
                <MicrophoneButton
                  isMicrophoneOn={isMicrophoneOn}
                  onClick={handleToggleMicrophone}
                />
                <VideoButton
                  isVideoOn={isVideoOn}
                  onClick={handleToggleVideo}
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
