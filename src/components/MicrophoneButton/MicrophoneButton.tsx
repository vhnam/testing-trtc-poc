import { Mic, MicOff } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

export interface MicrophoneButtonProps {
  disabled: boolean;
  isMicrophoneOn: boolean;
  onClick: () => void;
}

const MicrophoneButton = ({
  disabled,
  isMicrophoneOn,
  onClick,
}: MicrophoneButtonProps) => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          disabled={disabled}
          variant="outline"
          type="button"
          onClick={onClick}
        >
          {isMicrophoneOn ? <Mic /> : <MicOff />}
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        {isMicrophoneOn ? 'Turn off microphone' : 'Turn on microphone'}
      </TooltipContent>
    </Tooltip>
  );
};

export default MicrophoneButton;
