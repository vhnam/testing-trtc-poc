import {
  DEFAULT_ROOM_ID,
  LOCAL_VIDEO_VIEW,
  REMOTE_VIDEO_VIEW,
} from "@/constants/room";
import { genTestUserSig } from "@/utils/generateTestUserSig";
import { useEffect, useState } from "react";
import { useStore } from "zustand";
import userInfoStore from "@/stores/userInfo.store";
import TRTC, { type TRTCStreamType } from "trtc-sdk-v5";
import EndCallButton from "@/components/EndCallButton";
import { useRouter } from "next/router";
import VideoButton from "@/components/VideoButton";
import MicrophoneButton from "@/components/MicrophoneButton";

const PatientVideoContainer = () => {
  const [trtc, setTrtc] = useState<TRTC | null>(null);
  const router = useRouter();
  const [isVideoOn, setIsVideoOn] = useState(false);
  const [isMicrophoneOn, setIsMicrophoneOn] = useState(false);
  const [currentRoomId, setCurrentRoomId] = useState<number | null>(null);
  const [isJoining, setIsJoining] = useState(false);
  const [joinError, setJoinError] = useState<string>("");
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
      await trtc.stopRemoteVideo({
        userId: remoteUsers[0],
        streamType: "main" as TRTCStreamType,
      });

      router.push("/");
    } catch (error) {
      console.error("Failed to end call:", error);
    }
  };

  const handleRemoteUserEnter = async (event: { userId: string }) => {
    if (!trtc) return;

    console.log("Remote user entered:", event.userId);
    setRemoteUsers((prev) => [...prev, event.userId]);
  };

  const handleRemoteUserExit = async (event: { userId: string }) => {
    console.log("Remote user exited:", event.userId);

    // Stop remote video for the exiting user
    if (trtc) {
      try {
        await trtc.stopRemoteVideo({
          userId: event.userId,
          streamType: "main" as TRTCStreamType,
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
  };

  const joinRoom = async (roomId: number) => {
    if (!trtc || !userId) return;

    try {
      setIsJoining(true);
      setJoinError("");

      const { sdkAppId, userSig } = genTestUserSig({
        userId,
      });

      await trtc.enterRoom({
        roomId,
        sdkAppId,
        userId: userId ?? (router.query.invitedBy as string),
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
              fillMode: "cover",
              profile: "720p",
            },
          });
          await trtc.startLocalAudio();
        } catch (error) {
          console.error("Failed to start local video/audio:", error);
        }
      }, 100);
    } catch (error) {
      console.error("Failed to join room:", error);
      setJoinError(
        "Failed to join the room. Please check the invitation link."
      );
      setIsJoining(false);
    }
  };

  useEffect(() => {
    const loadTRTC = async () => {
      try {
        const TRTC = (await import("trtc-sdk-v5")).default;
        const trtcInstance = TRTC.create();
        setTrtc(trtcInstance);
      } catch (error) {
        console.error("Failed to load TRTC SDK:", error);
      }
    };

    loadTRTC();
  }, []);

  useEffect(() => {
    if (!trtc || !userId) return;

    // Set up TRTC event listeners
    trtc.on(TRTC.EVENT.REMOTE_USER_ENTER, handleRemoteUserEnter);
    trtc.on(TRTC.EVENT.REMOTE_USER_EXIT, handleRemoteUserExit);

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
      trtc.exitRoom();
    };
  }, [trtc, userId]);

  // Effect to start remote video when remote users are added and DOM is ready
  useEffect(() => {
    if (!trtc || remoteUsers.length === 0) return;

    const startRemoteVideoForUsers = async () => {
      // Retry mechanism to ensure DOM element exists
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

        console.error("Remote video view element not found after retries");
        return null;
      };

      const remoteVideoElement = await waitForElement();
      if (!remoteVideoElement) {
        return;
      }

      // Start remote video for all remote users
      for (const userId of remoteUsers) {
        try {
          await trtc.startRemoteVideo({
            userId,
            streamType: "main" as TRTCStreamType,
            view: REMOTE_VIDEO_VIEW,
          });
          console.log(`Started remote video for user: ${userId}`);
        } catch (error) {
          console.error(
            `Failed to start remote view for user ${userId}:`,
            error
          );
        }
      }
    };

    startRemoteVideoForUsers();
  }, [trtc, remoteUsers]);

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
            onClick={() => router.push("/")}
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

      {/* Room Info Display */}
      {currentRoomId && (
        <div className="fixed top-4 left-4 bg-black bg-opacity-50 text-white p-4 rounded-lg">
          <div className="text-sm">
            <div>Room ID: {currentRoomId}</div>
            <div className="text-xs text-gray-300 mt-1">
              Connected as: {userId}
            </div>
            {remoteUsers.length > 0 && (
              <div className="text-xs text-green-300 mt-1">
                Remote users: {remoteUsers.join(", ")}
              </div>
            )}
          </div>
        </div>
      )}

      <div className="fixed bottom-6 left-0 right-0">
        <div className="flex justify-center gap-4">
          <MicrophoneButton
            isMicrophoneOn={isMicrophoneOn}
            onClick={handleToggleMicrophone}
          />
          <VideoButton isVideoOn={isVideoOn} onClick={handleToggleVideo} />
          <EndCallButton onClick={handleEndCall} />
        </div>
      </div>
    </div>
  );
};

export default PatientVideoContainer;
