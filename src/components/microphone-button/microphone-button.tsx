import { IconMicrophone, IconMicrophoneOff } from '@tabler/icons-react';

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
      <TooltipTrigger
        render={
          <Button
            disabled={disabled}
            variant="outline"
            type="button"
            onClick={onClick}
          >
            {isMicrophoneOn ? <IconMicrophone /> : <IconMicrophoneOff />}
          </Button>
        }
      />
      <TooltipContent>
        {isMicrophoneOn ? 'Turn off microphone' : 'Turn on microphone'}
      </TooltipContent>
    </Tooltip>
  );
};

export default MicrophoneButton;
