import { BiPhone } from "react-icons/bi";
import { Button } from "@/components/ui/button";

export interface EndCallButtonProps {
  onClick: () => void;
}

const EndCallButton = ({ onClick }: EndCallButtonProps) => {
  return (
    <Button variant="destructive" type="button" onClick={onClick}>
      <BiPhone />
    </Button>
  );
};

export default EndCallButton;
