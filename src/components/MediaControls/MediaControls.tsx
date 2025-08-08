import EndCallButton from '@/components/EndCallButton';
import MicrophoneButton from '@/components/MicrophoneButton';
import VideoButton from '@/components/VideoButton';

interface MediaControlsProps {
  isAudioStarted: boolean;
  isVideoStarted: boolean;
  isVideoOn: boolean;
  isMicrophoneOn: boolean;
  onToggleMicrophone: () => void;
  onToggleVideo: () => void;
  onEndCall: () => void;
}

const MediaControls = ({
  isAudioStarted,
  isVideoStarted,
  isVideoOn,
  isMicrophoneOn,
  onEndCall,
  onToggleMicrophone,
  onToggleVideo,
}: MediaControlsProps) => {
  return (
    <div className="bg-white p-4">
      <div className="flex justify-center gap-4">
        <MicrophoneButton
          disabled={!isAudioStarted}
          isMicrophoneOn={isMicrophoneOn}
          onClick={onToggleMicrophone}
        />
        <VideoButton
          disabled={!isVideoStarted}
          isVideoOn={isVideoOn}
          onClick={onToggleVideo}
        />
        <EndCallButton onClick={onEndCall} />
      </div>
    </div>
  );
};

export default MediaControls;
