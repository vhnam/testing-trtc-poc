import { BiPhone } from 'react-icons/bi';

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
          <BiPhone />
        </Button>
      </TooltipTrigger>
      <TooltipContent>End call</TooltipContent>
    </Tooltip>
  );
};

export default EndCallButton;
