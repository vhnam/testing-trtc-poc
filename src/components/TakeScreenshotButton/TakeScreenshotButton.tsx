import { IconCamera } from '@tabler/icons-react';
import { useState } from 'react';
import { toast } from 'sonner';

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
      toast.success('Screenshot captured successfully!', {
        description: 'The image has been downloaded to your device.',
        duration: 3000,
      });
    } catch (error) {
      console.error('Failed to take screenshot:', error);
      toast.error('Failed to take screenshot', {
        description: 'Please try again or check if the video is available.',
        duration: 4000,
      });
    } finally {
      setIsCapturing(false);
    }
  };

  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <Button
            variant="outline"
            type="button"
            onClick={handleTakeScreenshot}
            disabled={isCapturing}
          >
            <IconCamera className={isCapturing ? 'animate-pulse' : ''} />
          </Button>
        }
      />
      <TooltipContent>
        {isCapturing ? 'Capturing...' : 'Take a screenshot'}
      </TooltipContent>
    </Tooltip>
  );
};

export default TakeScreenshotButton;
