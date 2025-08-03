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
  const [attemptedUsers, setAttemptedUsers] = useState<Set<string>>(new Set());

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
      setAttemptedUsers(new Set());
      router.push('/');
    } catch (error) {
      console.error('Failed to end call:', error);
    }
  };

  const handleRemoteUserEnter = async (event: { userId: string }) => {
    if (!trtc) return;

    console.log('Remote user entered:', event.userId);
    setRemoteUsers((prev) => [...prev, event.userId]);
  };

  const handleRemoteUserExit = async (event: { userId: string }) => {
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

    setRemoteUsers((prev) => prev.filter((id) => id !== event.userId));
    setAttemptedUsers((prev) => {
      const newSet = new Set(prev);
      newSet.delete(event.userId);
      return newSet;
    });
  };

  const attemptStartRemoteVideo = async (userId: string, retryCount = 0) => {
    if (!trtc || retryCount >= 10) return;

    try {
      await trtc.startRemoteVideo({
        userId,
        streamType: 'main' as TRTCStreamType,
        view: REMOTE_VIDEO_VIEW,
      });
      console.log(`Started remote video for user: ${userId}`);
    } catch (error) {
      console.log(
        `Attempt ${retryCount + 1}: Failed to start remote view for user ${userId}, retrying in 1 second...`
      );

      // Retry after 1 second
      setTimeout(() => {
        attemptStartRemoteVideo(userId, retryCount + 1);
      }, 1000);
    }
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
    if (!trtc || !userId) return;

    trtc.on(TRTC.EVENT.REMOTE_USER_ENTER, handleRemoteUserEnter);
    trtc.on(TRTC.EVENT.REMOTE_USER_EXIT, handleRemoteUserExit);

    return () => {
      trtc.off(TRTC.EVENT.REMOTE_USER_ENTER, handleRemoteUserEnter);
      trtc.off(TRTC.EVENT.REMOTE_USER_EXIT, handleRemoteUserExit);
      trtc.exitRoom();
    };
  }, [trtc, userId]);

  useEffect(() => {
    if (!trtc || remoteUsers.length === 0) return;

    const startRemoteVideoForUsers = async () => {
      let retryCount = 0;
      const maxRetries = 10;

      const waitForElement = async (): Promise<HTMLElement | null> => {
        const element = document.getElementById(REMOTE_VIDEO_VIEW);
        if (element) return element;

        if (retryCount < maxRetries) {
          retryCount++;
          await new Promise((resolve) => setTimeout(resolve, 100));
          return waitForElement();
        }

        console.error('Remote video view element not found after retries');
        return null;
      };

      const remoteVideoElement = await waitForElement();
      if (!remoteVideoElement) {
        return;
      }

      for (const userId of remoteUsers) {
        // Only attempt if we haven't tried this user yet
        if (!attemptedUsers.has(userId)) {
          setAttemptedUsers((prev) => new Set([...prev, userId]));
          attemptStartRemoteVideo(userId);
        }
      }
    };

    startRemoteVideoForUsers();
  }, [trtc, remoteUsers, attemptedUsers]);

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
        <div className="w-[592px] h-[698px] relative">
          <div
            id={LOCAL_VIDEO_VIEW}
            className="absolute left-6 bottom-2 w-[100px] h-[128px] bg-white [&_video]:align-top shadow-lg rounded-lg overflow-hidden"
          />
          {remoteUsers.length > 0 && (
            <div
              id={REMOTE_VIDEO_VIEW}
              className="w-[592px] h-[698px] bg-gray-800 rounded-lg overflow-hidden [&_video]:align-top"
            />
          )}
        </div>
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
