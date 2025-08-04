import { Camera } from 'lucide-react';
import { useState } from 'react';

import { REMOTE_VIDEO_VIEW } from '@/constants/room';

import { downloadScreenshot } from '@/utils/screenshot';

import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

const TakeScreenshotButton = () => {
  const [isCapturing, setIsCapturing] = useState(false);

  const handleTakeScreenshot = async () => {
    setIsCapturing(true);
    try {
      await downloadScreenshot(REMOTE_VIDEO_VIEW);
    } catch (error) {
      console.error('Failed to take screenshot:', error);
      // You could add a toast notification here for better UX
    } finally {
      setIsCapturing(false);
    }
  };

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="outline"
          type="button"
          onClick={handleTakeScreenshot}
          disabled={isCapturing}
        >
          <Camera className={isCapturing ? 'animate-pulse' : ''} />
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        {isCapturing ? 'Capturing...' : 'Take a screenshot'}
      </TooltipContent>
    </Tooltip>
  );
};

export default TakeScreenshotButton;
