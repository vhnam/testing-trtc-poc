import { IconPhone } from '@tabler/icons-react';

import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

export interface EndCallButtonProps {
  onClick: () => void;
}

const EndCallButton = ({ onClick }: EndCallButtonProps) => {
  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <Button variant="destructive" type="button" onClick={onClick}>
            <IconPhone />
          </Button>
        }
      />
      <TooltipContent>End call</TooltipContent>
    </Tooltip>
  );
};

export default EndCallButton;
