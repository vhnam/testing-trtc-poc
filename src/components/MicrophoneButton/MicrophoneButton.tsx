import { BiMicrophone, BiMicrophoneOff } from "react-icons/bi";
import { Button } from "@/components/ui/button";

export interface MicrophoneButtonProps {
  isMicrophoneOn: boolean;
  onClick: () => void;
}

const MicrophoneButton = ({
  isMicrophoneOn,
  onClick,
}: MicrophoneButtonProps) => {
  return (
    <Button type="button" onClick={onClick}>
      {isMicrophoneOn ? <BiMicrophone /> : <BiMicrophoneOff />}
    </Button>
  );
};

export default MicrophoneButton;
