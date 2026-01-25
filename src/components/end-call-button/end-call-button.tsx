import { IconPhone } from '@tabler/icons-react';

import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

export interface EndCallButtonProps {
  onClick: () => void;
  disabled?: boolean;
}

const EndCallButton = ({ onClick, disabled = false }: EndCallButtonProps) => {
  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <Button
            variant="destructive"
            type="button"
            onClick={onClick}
            disabled={disabled}
          >
            <IconPhone />
          </Button>
        }
      />
      <TooltipContent>
        {disabled ? 'Ending call...' : 'End call'}
      </TooltipContent>
    </Tooltip>
  );
};

export default EndCallButton;
