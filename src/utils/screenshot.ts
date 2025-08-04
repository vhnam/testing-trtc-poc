/**
 * Captures a screenshot from a video element within a container
 * @param elementId - The ID of the container element that contains the video
 * @returns Promise<Blob | null> - A blob containing the screenshot image, or null if capture failed
 */
export const captureScreenshot = async (
  elementId: string
): Promise<Blob | null> => {
  try {
    const videoContainer = document.getElementById(elementId);
    if (!videoContainer) {
      console.error(`Video container with id '${elementId}' not found`);
      return null;
    }

    const video = videoContainer.querySelector('video') as HTMLVideoElement;
    if (!video) {
      console.error('Video element not found in container');
      return null;
    }

    // Check if video is ready and has dimensions
    if (video.videoWidth === 0 || video.videoHeight === 0) {
      console.error('Video is not ready or has no dimensions');
      return null;
    }

    const { videoHeight, videoWidth } = video;

    const canvas = document.createElement('canvas');
    canvas.width = videoWidth;
    canvas.height = videoHeight;
    const context = canvas.getContext('2d');

    if (!context) {
      console.error('Could not get canvas context');
      return null;
    }

    context.drawImage(video, 0, 0, videoWidth, videoHeight);

    return new Promise((resolve) => {
      canvas.toBlob(
        (blob) => {
          resolve(blob);
        },
        'image/png',
        0.95
      ); // Higher quality PNG
    });
  } catch (error) {
    console.error('Error capturing screenshot:', error);
    return null;
  }
};

/**
 * Captures a screenshot and automatically downloads it as a PNG file
 * @param elementId - The ID of the container element that contains the video
 * @returns Promise<void>
 */
export const downloadScreenshot = async (elementId: string): Promise<void> => {
  const blob = await captureScreenshot(elementId);

  if (!blob) {
    console.error('Failed to capture screenshot');
    return;
  }

  // Create download link
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;

  // Generate filename with timestamp
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  link.download = `screenshot-${timestamp}.png`;

  // Trigger download
  document.body.appendChild(link);
  link.click();

  // Cleanup
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
