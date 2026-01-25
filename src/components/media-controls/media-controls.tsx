import EndCallButton from '@/components/end-call-button';
import MicrophoneButton from '@/components/microphone-button';
import VideoButton from '@/components/video-button';

interface MediaControlsProps {
  isAudioStarted: boolean;
  isVideoStarted: boolean;
  isVideoOn: boolean;
  isMicrophoneOn: boolean;
  onToggleMicrophone: () => void;
  onToggleVideo: () => void;
  onEndCall: () => void;
  isEndingCall?: boolean;
}

const MediaControls = ({
  isAudioStarted,
  isVideoStarted,
  isVideoOn,
  isMicrophoneOn,
  onEndCall,
  onToggleMicrophone,
  onToggleVideo,
  isEndingCall = false,
}: MediaControlsProps) => {
  return (
    <div className="bg-white p-4">
      <div className="flex justify-center gap-4">
        <MicrophoneButton
          disabled={!isAudioStarted || isEndingCall}
          isMicrophoneOn={isMicrophoneOn}
          onClick={onToggleMicrophone}
        />
        <VideoButton
          disabled={!isVideoStarted || isEndingCall}
          isVideoOn={isVideoOn}
          onClick={onToggleVideo}
        />
        <EndCallButton onClick={onEndCall} disabled={isEndingCall} />
      </div>
    </div>
  );
};

export default MediaControls;
