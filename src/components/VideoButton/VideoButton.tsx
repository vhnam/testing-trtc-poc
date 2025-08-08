import { Video, VideoOff } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

export interface VideoButtonProps {
  disabled?: boolean;
  isVideoOn: boolean;
  onClick: () => void;
}

const VideoButton = ({
  disabled = false,
  onClick,
  isVideoOn,
}: VideoButtonProps) => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          disabled={disabled}
          variant="outline"
          type="button"
          onClick={onClick}
        >
          {isVideoOn ? <Video /> : <VideoOff />}
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        {isVideoOn ? 'Turn off video' : 'Turn on video'}
      </TooltipContent>
    </Tooltip>
  );
};

export default VideoButton;
