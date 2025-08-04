import { useRouter } from 'next/router';
import { useCallback, useEffect, useRef, useState } from 'react';
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

const trtc = TRTC.create();

const PatientVideoContainer = () => {
  const router = useRouter();
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isMicrophoneOn, setIsMicrophoneOn] = useState(true);
  const [currentRoomId, setCurrentRoomId] = useState<number | null>(null);
  const [isJoining, setIsJoining] = useState(false);
  const [isVideoStarted, setIsVideoStarted] = useState(false);
  const [isAudioStarted, setIsAudioStarted] = useState(false);
  const [joinError, setJoinError] = useState<string>('');
  const [remoteUsers, setRemoteUsers] = useState<string[]>([]);

  const routerRef = useRef(router);
  const remoteUsersRef = useRef(remoteUsers);
  const videoStartTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const hasJoinedRef = useRef(false);

  // Update refs when state changes
  useEffect(() => {
    routerRef.current = router;
    remoteUsersRef.current = remoteUsers;
  });

  const {
    userInfo: { userId },
  } = useStore(userInfoStore);

  const handleToggleMicrophone = async () => {
    try {
      await trtc.updateLocalAudio({ mute: isMicrophoneOn });
      setIsMicrophoneOn(!isMicrophoneOn);
    } catch (error) {
      console.error(`Failed to toggle microphone`, error);
    }
  };

  const handleToggleVideo = async () => {
    try {
      await trtc.updateLocalVideo({ mute: isVideoOn });
      setIsVideoOn(!isVideoOn);
    } catch (error) {
      console.error(`Failed to toggle video`, error);
    }
  };

  const handleEndCall = useCallback(async () => {
    try {
      // Stop video and audio if they're running
      if (isVideoStarted) {
        try {
          await trtc.stopLocalVideo();
        } catch (error) {
          console.log('Error stopping local video:', error);
        }
      }

      if (isAudioStarted) {
        try {
          await trtc.stopLocalAudio();
        } catch (error) {
          console.log('Error stopping local audio:', error);
        }
      }

      await trtc.exitRoom();

      // Reset room state

      setIsVideoStarted(false);
      setIsAudioStarted(false);
      setCurrentRoomId(null);
      setRemoteUsers([]);

      routerRef.current.push('/');
    } catch (error) {
      console.error('Failed to end call:', error);
    }
  }, [isVideoStarted, isAudioStarted]);

  const handleRemoteUserEnter = async (event: { userId: string }) => {
    console.log('Remote user entered:', event.userId);
    setRemoteUsers((prev) => [...prev, event.userId]);
  };

  const handleRemoteUserExit = useCallback(
    async (event: { userId: string }) => {
      console.log('Remote user exited:', event.userId);

      // Stop remote video for the exiting user
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

      setRemoteUsers((prev) => prev.filter((id) => id !== event.userId));

      // End call after a short delay to allow state updates
      setTimeout(() => {
        handleEndCall();
      }, 100);
    },
    []
  );

  const joinRoom = useCallback(
    async (roomId: number) => {
      if (!userId) {
        console.log('No userId available, skipping join room');
        return;
      }

      console.log('Attempting to join room:', roomId, 'with userId:', userId);

      try {
        setIsJoining(true);
        setJoinError('');

        // Exit any existing room first to prevent "already start" error
        try {
          console.log('Exiting existing room...');
          await trtc.exitRoom();

          console.log('Successfully exited existing room');
        } catch (error) {
          // Ignore errors when exiting room that doesn't exist
          console.log('No existing room to exit or error during exit:', error);
        }

        const { sdkAppId, userSig } = genTestUserSig({
          userId,
        });

        console.log('Entering room with sdkAppId:', sdkAppId);
        await trtc.enterRoom({
          roomId,
          sdkAppId,
          userId,
          userSig,
        });

        console.log('Successfully entered room');

        // Set room ID first so the video container renders
        setCurrentRoomId(roomId);

        hasJoinedRef.current = true;
        setIsJoining(false);

        // Wait a bit for the DOM to update, then start video
        // Clear any existing timeout to prevent multiple calls
        if (videoStartTimeoutRef.current) {
          clearTimeout(videoStartTimeoutRef.current);
        }

        videoStartTimeoutRef.current = setTimeout(async () => {
          try {
            console.log('Starting local video and audio...');

            // Only start video if not already started
            if (!isVideoStarted) {
              // Check if the local video view element exists
              const localVideoElement =
                document.getElementById(LOCAL_VIDEO_VIEW);
              if (!localVideoElement) {
                console.log(
                  'Local video view element not found, retrying in 100ms...'
                );
                // Retry after a short delay to allow DOM to render
                setTimeout(() => {
                  // Retry the video start
                  if (!isVideoStarted) {
                    trtc
                      .startLocalVideo({
                        view: LOCAL_VIDEO_VIEW,
                        option: {
                          fillMode: 'cover',
                          profile: '720p',
                        },
                      })
                      .then(() => {
                        setIsVideoStarted(true);
                        console.log(
                          'Successfully started local video on retry'
                        );
                      })
                      .catch((error) => {
                        console.error(
                          'Failed to start local video on retry:',
                          error
                        );
                      });
                  }
                }, 100);
                return;
              }

              await trtc.startLocalVideo({
                view: LOCAL_VIDEO_VIEW,
                option: {
                  fillMode: 'cover',
                  profile: '720p',
                },
              });
              setIsVideoStarted(true);
              console.log('Successfully started local video');
            }

            // Only start audio if not already started
            if (!isAudioStarted) {
              await trtc.startLocalAudio();
              setIsAudioStarted(true);
              console.log('Successfully started local audio');
            }
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
    },
    [userId]
  );

  const handleRemoteVideoAvailable = (event: {
    userId: string;
    streamType: TRTCStreamType;
  }) => {
    try {
      if (!event.userId) return;

      const userId = event.userId;
      const streamType = event.streamType;

      // Check if the remote video view element exists
      const remoteVideoElement = document.getElementById(REMOTE_VIDEO_VIEW);
      if (!remoteVideoElement) {
        console.log(
          'Remote video view element not found, retrying in 100ms...'
        );
        // Retry after a short delay to allow DOM to render
        setTimeout(() => {
          handleRemoteVideoAvailable(event);
        }, 100);
        return;
      }

      console.log('Starting remote video for user:', userId);
      trtc.startRemoteVideo({
        userId,
        streamType,
        view: REMOTE_VIDEO_VIEW,
      });
      console.log('Successfully started remote video for user:', userId);
    } catch (error) {
      console.error('Failed to start remote video:', error);
    }
  };

  useEffect(() => {
    if (!userId || hasJoinedRef.current) return;

    console.log('Setting up TRTC event listeners and joining room...');

    // Setup event listeners
    trtc.on(TRTC.EVENT.REMOTE_USER_ENTER, handleRemoteUserEnter);
    trtc.on(TRTC.EVENT.REMOTE_USER_EXIT, handleRemoteUserExit);
    trtc.on(TRTC.EVENT.REMOTE_VIDEO_AVAILABLE, handleRemoteVideoAvailable);

    // Join the default room with a small delay to ensure TRTC is ready and DOM is rendered
    const joinTimeout = setTimeout(() => {
      // Check if video containers are rendered before joining
      const localVideoElement = document.getElementById(LOCAL_VIDEO_VIEW);
      const remoteVideoElement = document.getElementById(REMOTE_VIDEO_VIEW);

      if (!localVideoElement || !remoteVideoElement) {
        console.log('Video containers not ready, retrying in 200ms...');
        setTimeout(() => {
          joinRoom(DEFAULT_ROOM_ID);
        }, 200);
        return;
      }

      console.log('Video containers ready, joining room...');
      joinRoom(DEFAULT_ROOM_ID);
    }, 100);

    return () => {
      clearTimeout(joinTimeout);

      // Clear video start timeout
      if (videoStartTimeoutRef.current) {
        clearTimeout(videoStartTimeoutRef.current);
        videoStartTimeoutRef.current = null;
      }

      // Clean up event listeners
      trtc.off(TRTC.EVENT.REMOTE_USER_ENTER, handleRemoteUserEnter);
      trtc.off(TRTC.EVENT.REMOTE_USER_EXIT, handleRemoteUserExit);
      trtc.off(TRTC.EVENT.REMOTE_VIDEO_AVAILABLE, handleRemoteVideoAvailable);

      // Clean up room state only when component unmounts
      try {
        trtc.exitRoom();
      } catch (error) {
        console.log('Error during cleanup exitRoom:', error);
      }

      hasJoinedRef.current = false;
      setIsVideoStarted(false);
      setIsAudioStarted(false);
      setCurrentRoomId(null);
      setRemoteUsers([]);
    };
  }, [userId]);

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
