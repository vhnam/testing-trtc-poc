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

import userInfoStore from '@/stores/userInfo.store';

import MicrophoneButton from '@/components/MicrophoneButton';
import VideoButton from '@/components/VideoButton';

const PatientVideoContainer = () => {
  const [trtc, setTrtc] = useState<TRTC | null>(null);
  const router = useRouter();
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isMicrophoneOn, setIsMicrophoneOn] = useState(true);
  const [currentRoomId, setCurrentRoomId] = useState<number | null>(null);
  const [isJoining, setIsJoining] = useState(false);
  const [joinError, setJoinError] = useState<string>('');
  const [remoteUsers, setRemoteUsers] = useState<string[]>([]);

  const {
    userInfo: { userId },
  } = useStore(userInfoStore);

  const handleToggleMicrophone = async () => {
    try {
      if (!trtc) return;
      await trtc.updateLocalAudio({ mute: isMicrophoneOn });
      setIsMicrophoneOn(!isMicrophoneOn);
    } catch (error) {
      console.error(`Failed to toggle microphone`, error);
    }
  };

  const handleToggleVideo = async () => {
    try {
      if (!trtc) return;
      await trtc.updateLocalVideo({ mute: isVideoOn });
      setIsVideoOn(!isVideoOn);
    } catch (error) {
      console.error(`Failed to toggle video`, error);
    }
  };

  const handleEndCall = async () => {
    if (!trtc) return;

    try {
      await trtc.exitRoom();
      await trtc.stopLocalAudio();
      await trtc.stopLocalVideo();

      if (remoteUsers.length) {
        await trtc.stopRemoteVideo({
          userId: remoteUsers[0],
          streamType: 'main' as TRTCStreamType,
        });
      }

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
      } finally {
        await handleEndCall();
      }
    }

    setRemoteUsers((prev) => prev.filter((id) => id !== event.userId));
  };

  const joinRoom = async (roomId: number) => {
    if (!trtc || !userId) return;

    try {
      setIsJoining(true);
      setJoinError('');

      const { sdkAppId, userSig } = genTestUserSig({
        userId,
      });

      await trtc.enterRoom({
        roomId,
        sdkAppId,
        userId,
        userSig,
      });

      // Set room ID first so the video container renders
      setCurrentRoomId(roomId);
      setIsJoining(false);

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
      console.error('Failed to join room:', error);
      setJoinError(
        'Failed to join the room. Please check the invitation link.'
      );
      setIsJoining(false);
    }
  };

  const handleRemoteVideoAvailable = (event: {
    userId: string;
    streamType: TRTCStreamType;
  }) => {
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

  useEffect(() => {
    if (!trtc || !userId) return;

    trtc.on(TRTC.EVENT.REMOTE_USER_ENTER, handleRemoteUserEnter);
    trtc.on(TRTC.EVENT.REMOTE_USER_EXIT, handleRemoteUserExit);
    trtc.on(TRTC.EVENT.REMOTE_VIDEO_AVAILABLE, handleRemoteVideoAvailable);

    // if (roomId) {
    //   // Join the specific room from invitation
    //   joinRoom(roomId);
    // } else {
    // Fallback to default room (for direct access)
    joinRoom(DEFAULT_ROOM_ID);
    // }

    return () => {
      trtc.off(TRTC.EVENT.REMOTE_USER_ENTER, handleRemoteUserEnter);
      trtc.off(TRTC.EVENT.REMOTE_USER_EXIT, handleRemoteUserExit);
      trtc.off(TRTC.EVENT.REMOTE_VIDEO_AVAILABLE, handleRemoteVideoAvailable);
      trtc.exitRoom();
    };
  }, [trtc, userId]);

  if (isJoining) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <div className="text-lg">Joining room...</div>
        </div>
      </div>
    );
  }

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
    <div className="relative">
      <div>
        <div className="w-full h-[calc(100svh-68px)] flex items-center justify-center bg-gray-200 relative">
          {remoteUsers.length === 0 && (
            <div className="absolute">
              <p className="text-gray-800 text-2xl font-semibold">
                The doctor will join shorty
              </p>
            </div>
          )}

          <div
            id={REMOTE_VIDEO_VIEW}
            className="w-full h-full [&_video]:align-top"
          />
        </div>

        <div className="bg-white p-4">
          <div className="flex justify-center gap-4">
            <MicrophoneButton
              isMicrophoneOn={isMicrophoneOn}
              onClick={handleToggleMicrophone}
            />
            <VideoButton isVideoOn={isVideoOn} onClick={handleToggleVideo} />
          </div>
        </div>
      </div>

      <div
        id={LOCAL_VIDEO_VIEW}
        className="absolute top-4 right-4 lg:top-12 lg:right-16 w-[120px] h-[160px] bg-gray-800 rounded-lg overflow-hidden [&_video]:align-top shadow-lg"
      />

      {currentRoomId && (
        <div className="top-4 left-4 bg-black bg-opacity-50 text-white p-4 rounded-lg fixed">
          <div className="text-sm">
            <div>Room ID: {currentRoomId}</div>
            <div className="text-xs text-gray-300 mt-1">
              Connected as: {userId}
            </div>
            {remoteUsers.length > 0 && (
              <div className="text-xs text-green-300 mt-1">
                Remote users: {remoteUsers.join(', ')}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientVideoContainer;
