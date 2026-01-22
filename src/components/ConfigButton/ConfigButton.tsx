import { IconSettings } from '@tabler/icons-react';

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
      <TooltipTrigger
        render={
          <Button variant="outline" type="button" onClick={onClick}>
            <IconSettings />
          </Button>
        }
      />
      <TooltipContent>Check audio and video</TooltipContent>
    </Tooltip>
  );
};

export default ConfigButton;
