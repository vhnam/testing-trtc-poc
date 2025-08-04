import { Settings2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

export interface ConfigButtonProps {
  onClick: () => void;
}

const ConfigButton = ({ onClick }: ConfigButtonProps) => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant="outline" type="button" onClick={onClick}>
          <Settings2 />
        </Button>
      </TooltipTrigger>
      <TooltipContent>Check audio and video</TooltipContent>
    </Tooltip>
  );
};

export default ConfigButton;
