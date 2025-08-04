import { Video, VideoOff } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

export interface VideoButtonProps {
  isVideoOn: boolean;
  onClick: () => void;
}

const VideoButton = ({ onClick, isVideoOn }: VideoButtonProps) => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant="outline" type="button" onClick={onClick}>
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
