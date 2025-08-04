import { Phone } from 'lucide-react';

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
      <TooltipTrigger asChild>
        <Button variant="destructive" type="button" onClick={onClick}>
          <Phone />
        </Button>
      </TooltipTrigger>
      <TooltipContent>End call</TooltipContent>
    </Tooltip>
  );
};

export default EndCallButton;
