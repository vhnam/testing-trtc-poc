import { BiVideo, BiVideoOff } from 'react-icons/bi';

import { Button } from '@/components/ui/button';

export interface VideoButtonProps {
  isVideoOn: boolean;
  onClick: () => void;
}

const VideoButton = ({ onClick, isVideoOn }: VideoButtonProps) => {
  return (
    <Button type="button" onClick={onClick}>
      {isVideoOn ? <BiVideo /> : <BiVideoOff />}
    </Button>
  );
};

export default VideoButton;
