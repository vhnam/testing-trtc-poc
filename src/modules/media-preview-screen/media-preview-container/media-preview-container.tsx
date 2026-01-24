import { useRouter } from 'next/router';
import { useCallback, useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import TRTC from 'trtc-sdk-v5';

import { LOCAL_VIDEO_VIEW } from '@/constants/room';

import { useMediaPermissions } from '@/hooks';

import { Button } from '@/components/ui/button';

const MediaPreviewContainer = () => {
  const router = useRouter();
  const [isVideoStarted, setIsVideoStarted] = useState(false);
  const [isAudioStarted, setIsAudioStarted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const { permissions, requestPermissions } = useMediaPermissions();

  const [trtc, setTrtc] = useState<TRTC | null>(null);
  const videoRef = useRef<HTMLDivElement>(null);

  // Initialize TRTC only on client side
  useEffect(() => {
    if (typeof window !== 'undefined') {
      import('@/utils/trtc').then(({ getTRTCInstance }) => {
        setTrtc(getTRTCInstance());
      });
    }
  }, []);

  // Start local video preview
  const startVideoPreview = useCallback(async () => {
    if (isVideoStarted || !videoRef.current || !trtc) return;

    try {
      setIsLoading(true);
      setError('');

      // Create video element if it doesn't exist
      if (!document.getElementById(LOCAL_VIDEO_VIEW)) {
        const videoElement = document.createElement('div');
        videoElement.id = LOCAL_VIDEO_VIEW;
        videoElement.className = 'w-full h-full bg-gray-900 rounded-lg';
        videoRef.current.appendChild(videoElement);
      }

      await trtc.startLocalVideo({
        view: LOCAL_VIDEO_VIEW,
        option: {
          fillMode: 'cover',
          profile: '720p',
        },
        publish: false,
      });

      setIsVideoStarted(true);
      toast.success('Camera preview started');
    } catch (error) {
      console.error('Failed to start video preview:', error);
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      setError(`Failed to start camera: ${errorMessage}`);
      toast.error('Failed to start camera preview');
    } finally {
      setIsLoading(false);
    }
  }, [isVideoStarted, trtc]);

  // Start local audio preview
  const startAudioPreview = useCallback(async () => {
    if (isAudioStarted || !trtc) return;

    try {
      setIsLoading(true);
      setError('');

      await trtc.startLocalAudio({
        publish: false,
      });
      setIsAudioStarted(true);
      toast.success('Microphone preview started');
    } catch (error) {
      console.error('Failed to start audio preview:', error);
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      setError(`Failed to start microphone: ${errorMessage}`);
      toast.error('Failed to start microphone preview');
    } finally {
      setIsLoading(false);
    }
  }, [isAudioStarted, trtc]);

  // Stop video preview
  const stopVideoPreview = useCallback(async () => {
    if (!isVideoStarted || !trtc) return;

    try {
      await trtc.stopLocalVideo();
      setIsVideoStarted(false);
      toast.info('Camera preview stopped');
    } catch (error) {
      console.error('Error stopping video preview:', error);
    }
  }, [isVideoStarted, trtc]);

  // Stop audio preview
  const stopAudioPreview = useCallback(async () => {
    if (!isAudioStarted || !trtc) return;

    try {
      await trtc.stopLocalAudio();
      setIsAudioStarted(false);
      toast.info('Microphone preview stopped');
    } catch (error) {
      console.error('Error stopping audio preview:', error);
    }
  }, [isAudioStarted, trtc]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (isVideoStarted && trtc) {
        trtc.stopLocalVideo().catch(console.error);
      }
      if (isAudioStarted && trtc) {
        trtc.stopLocalAudio().catch(console.error);
      }
    };
  }, [isVideoStarted, isAudioStarted, trtc]);

  const getPermissionStatus = (permission: PermissionState | null) => {
    switch (permission) {
      case 'granted':
        return { text: 'Granted', color: 'text-green-600' };
      case 'denied':
        return { text: 'Denied', color: 'text-red-600' };
      case 'prompt':
        return { text: 'Not requested', color: 'text-yellow-600' };
      default:
        return { text: 'Unknown', color: 'text-gray-600' };
    }
  };

  const cameraStatus = getPermissionStatus(permissions.camera);
  const microphoneStatus = getPermissionStatus(permissions.microphone);

  // Show loading state while TRTC is initializing
  if (!trtc) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Initializing media preview...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full bg-white rounded-lg shadow-lg p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Media Preview & Permissions
          </h1>
          <p className="text-gray-600">
            Test your camera and microphone before joining a video call
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-8">
          {/* Camera Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Camera</h2>
              <span className={`font-medium ${cameraStatus.color}`}>
                {cameraStatus.text}
              </span>
            </div>

            <div className="relative">
              <div
                ref={videoRef}
                className="w-full h-64 bg-gray-900 rounded-lg flex items-center justify-center"
              >
                {!isVideoStarted && (
                  <div className="text-center text-white">
                    <div className="text-4xl mb-2">📹</div>
                    <p>Camera preview will appear here</p>
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                onClick={startVideoPreview}
                disabled={
                  isLoading ||
                  isVideoStarted ||
                  permissions.camera !== 'granted'
                }
                variant="outline"
                className="flex-1"
              >
                {isLoading ? 'Starting...' : 'Start Camera'}
              </Button>
              <Button
                onClick={stopVideoPreview}
                disabled={!isVideoStarted}
                variant="outline"
                className="flex-1"
              >
                Stop Camera
              </Button>
            </div>
          </div>

          {/* Microphone Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">
                Microphone
              </h2>
              <span className={`font-medium ${microphoneStatus.color}`}>
                {microphoneStatus.text}
              </span>
            </div>

            <div className="w-full h-64 bg-gray-100 rounded-lg flex items-center justify-center">
              <div className="text-center text-gray-600">
                <div className="text-4xl mb-2">🎤</div>
                <p>Microphone status indicator</p>
                {isAudioStarted && (
                  <div className="mt-4">
                    <div className="w-8 h-8 bg-green-500 rounded-full mx-auto animate-pulse"></div>
                    <p className="text-sm text-green-600 mt-2">Audio Active</p>
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                onClick={startAudioPreview}
                disabled={
                  isLoading ||
                  isAudioStarted ||
                  permissions.microphone !== 'granted'
                }
                variant="outline"
                className="flex-1"
              >
                {isLoading ? 'Starting...' : 'Test Microphone'}
              </Button>
              <Button
                onClick={stopAudioPreview}
                disabled={!isAudioStarted}
                variant="outline"
                className="flex-1"
              >
                Stop Microphone
              </Button>
            </div>
          </div>
        </div>

        <div className="space-y-4 mt-8">
          {(permissions.camera === 'prompt' ||
            permissions.microphone === 'prompt') && (
            <div className="flex justify-center gap-4">
              <Button
                onClick={requestPermissions}
                variant="default"
                className="px-8"
              >
                Request Permissions
              </Button>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-center gap-4">
            <Button
              onClick={() => router.push('/')}
              variant="outline"
              className="px-8"
            >
              Back to Home
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MediaPreviewContainer;
