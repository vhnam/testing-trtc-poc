import { BiMicrophone, BiMicrophoneOff } from 'react-icons/bi';

import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

export interface MicrophoneButtonProps {
  isMicrophoneOn: boolean;
  onClick: () => void;
}

const MicrophoneButton = ({
  isMicrophoneOn,
  onClick,
}: MicrophoneButtonProps) => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant="outline" type="button" onClick={onClick}>
          {isMicrophoneOn ? <BiMicrophone /> : <BiMicrophoneOff />}
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        {isMicrophoneOn ? 'Turn off microphone' : 'Turn on microphone'}
      </TooltipContent>
    </Tooltip>
  );
};

export default MicrophoneButton;
