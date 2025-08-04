import MicrophoneButton from '@/components/MicrophoneButton';
import VideoButton from '@/components/VideoButton';

interface MediaControlsProps {
  isVideoOn: boolean;
  isMicrophoneOn: boolean;
  onToggleMicrophone: () => void;
  onToggleVideo: () => void;
}

const MediaControls = ({
  isVideoOn,
  isMicrophoneOn,
  onToggleMicrophone,
  onToggleVideo,
}: MediaControlsProps) => {
  return (
    <div className="bg-white p-4">
      <div className="flex justify-center gap-4">
        <MicrophoneButton
          isMicrophoneOn={isMicrophoneOn}
          onClick={onToggleMicrophone}
        />
        <VideoButton isVideoOn={isVideoOn} onClick={onToggleVideo} />
      </div>
    </div>
  );
};

export default MediaControls;
