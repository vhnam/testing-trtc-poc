import { useCallback, useEffect, useState } from 'react';

interface MediaPermissions {
  camera: PermissionState | null;
  microphone: PermissionState | null;
}

interface UseMediaPermissionsReturn {
  permissions: MediaPermissions;
  checkPermissions: () => Promise<void>;
  requestPermissions: () => Promise<boolean>;
  isLoading: boolean;
  error: string | null;
}

export const useMediaPermissions = (): UseMediaPermissionsReturn => {
  const [permissions, setPermissions] = useState<MediaPermissions>({
    camera: null,
    microphone: null,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const checkPermissions = useCallback(async () => {
    try {
      setError(null);

      if ('permissions' in navigator) {
        const [cameraPermission, microphonePermission] = await Promise.all([
          navigator.permissions.query({ name: 'camera' as PermissionName }),
          navigator.permissions.query({ name: 'microphone' as PermissionName }),
        ]);

        setPermissions({
          camera: cameraPermission.state,
          microphone: microphonePermission.state,
        });
      } else {
        // Fallback for browsers that don't support permissions API
        setPermissions({
          camera: 'prompt',
          microphone: 'prompt',
        });
      }
    } catch (error) {
      console.error('Error checking permissions:', error);
      setError('Failed to check permissions');
      setPermissions({
        camera: 'prompt',
        microphone: 'prompt',
      });
    }
  }, []);

  const requestPermissions = useCallback(async (): Promise<boolean> => {
    try {
      setIsLoading(true);
      setError(null);

      // Request camera permission
      const cameraStream = await navigator.mediaDevices.getUserMedia({
        video: true,
      });
      cameraStream.getTracks().forEach((track) => track.stop());

      // Request microphone permission
      const audioStream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });
      audioStream.getTracks().forEach((track) => track.stop());

      // Recheck permissions
      await checkPermissions();
      return true;
    } catch (error) {
      console.error('Failed to request permissions:', error);
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      setError(`Failed to get permissions: ${errorMessage}`);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [checkPermissions]);

  // Check permissions on mount
  useEffect(() => {
    checkPermissions();
  }, [checkPermissions]);

  return {
    permissions,
    checkPermissions,
    requestPermissions,
    isLoading,
    error,
  };
};
