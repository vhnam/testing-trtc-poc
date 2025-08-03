import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import TRTC, { type TRTCStreamType } from 'trtc-sdk-v5';
import { useStore } from 'zustand';

import {
  DEFAULT_ROOM_ID,
  LOCAL_VIDEO_VIEW,
  REMOTE_VIDEO_VIEW,
} from '@/constants/room';

import { genTestUserSig } from '@/utils/generateTestUserSig';

import { type PatientInvitationSchema } from '@/schemas/PatientInvitation.schema';

import userInfoStore from '@/stores/userInfo.store';

import EndCallButton from '@/components/EndCallButton';
import MicrophoneButton from '@/components/MicrophoneButton';
import VideoButton from '@/components/VideoButton';

import DoctorInvitationDialogContainer from '@/modules/doctor-video-screen/doctor-invitation-dialog-container';

const DoctorVideoContainer = () => {
  const [trtc, setTrtc] = useState<TRTC | null>(null);
  const router = useRouter();
  const [isVideoOn, setIsVideoOn] = useState(false);
  const [isMicrophoneOn, setIsMicrophoneOn] = useState(false);
  const [isInCall, setIsInCall] = useState(false);
  const [remoteUsers, setRemoteUsers] = useState<string[]>([]);

  const {
    userInfo: { userId },
  } = useStore(userInfoStore);

  const handleToggleMicrophone = async () => {
    if (!trtc) return;
    await trtc.updateLocalAudio({ mute: !isMicrophoneOn });
    setIsMicrophoneOn(!isMicrophoneOn);
  };

  const handleToggleVideo = async () => {
    if (!trtc) return;
    await trtc.updateLocalVideo({ mute: !isVideoOn });
    setIsVideoOn(!isVideoOn);
  };

  const handleEndCall = async () => {
    if (!trtc) return;

    try {
      await trtc.exitRoom();
      await trtc.stopLocalAudio();
      await trtc.stopLocalVideo();

      setIsInCall(false);

      setRemoteUsers([]);
      router.push('/');
    } catch (error) {
      console.error('Failed to end call:', error);
    }
  };

  const handleRemoteUserEnter = async (event: { userId: string }) => {
    if (!trtc) return;

    console.log('Remote user entered:', event.userId);
    setRemoteUsers((prev) => [...prev, event.userId]);

    try {
      await trtc.startRemoteVideo({
        userId: event.userId,
        streamType: 'main' as TRTCStreamType,
        view: REMOTE_VIDEO_VIEW,
      });
    } catch (error) {
      console.error('Failed to start remote view:', error);
    }
  };

  const handleRemoteUserExit = (event: { userId: string }) => {
    console.log('Remote user exited:', event.userId);
    setRemoteUsers((prev) => prev.filter((id) => id !== event.userId));
  };

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

  useEffect(() => {
    const loadTRTC = async () => {
      try {
        const TRTC = (await import('trtc-sdk-v5')).default;
        const trtcInstance = TRTC.create();
        setTrtc(trtcInstance);
      } catch (error) {
        console.error('Failed to load TRTC SDK:', error);
      }
    };

    loadTRTC();
  }, []);

  return (
    <div>
      <div className="flex justify-center w-full h-screen items-center relative">
        {/* Local Video View */}
        <div
          id={LOCAL_VIDEO_VIEW}
          className="w-[1280px] h-[720px] bg-white [&_video]:align-top"
        />

        {/* Remote Video View - positioned as overlay */}
        {remoteUsers.length > 0 && (
          <div
            id={REMOTE_VIDEO_VIEW}
            className="absolute top-4 right-4 w-64 h-48 bg-gray-800 rounded-lg overflow-hidden [&_video]:align-top"
          />
        )}
      </div>

      <div className="fixed bottom-6 left-0 right-0">
        <div className="flex justify-center gap-4">
          {isInCall ? (
            <>
              <MicrophoneButton
                isMicrophoneOn={isMicrophoneOn}
                onClick={handleToggleMicrophone}
              />
              <VideoButton isVideoOn={isVideoOn} onClick={handleToggleVideo} />
              <EndCallButton onClick={handleEndCall} />
            </>
          ) : (
            <DoctorInvitationDialogContainer onAction={handleStartCall} />
          )}
        </div>
      </div>
    </div>
  );
};

export default DoctorVideoContainer;
