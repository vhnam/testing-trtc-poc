import { DoctorVideoState } from '@/hooks/use-doctor-video-state';

import { EndCallButton, TakeScreenshotButton } from '@/components';
import MicrophoneButton from '@/components/microphone-button';
import VideoButton from '@/components/video-button';

import DoctorInvitationDialogContainer from '@/modules/doctor-video-screen/doctor-invitation-dialog-container';

interface CallControlsBarProps {
  state: DoctorVideoState;
  showInvitationDialog: boolean;
}

export const CallControlsBar = ({
  state,
  showInvitationDialog,
}: CallControlsBarProps) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white p-4 border-solid border-t border-gray-200">
      <div className="flex justify-center">
        {showInvitationDialog ? (
          <DoctorInvitationDialogContainer onAction={state.handleStartCall} />
        ) : (
          <div className="flex items-center justify-between w-[500px]">
            <div>&nbsp;</div>
            <div className="flex gap-4">
              <MicrophoneButton
                disabled={!state.isAudioStarted}
                isMicrophoneOn={state.isMicrophoneOn}
                onClick={state.toggleMicrophone}
              />
              <VideoButton
                disabled={!state.isVideoStarted}
                isVideoOn={state.isVideoOn}
                onClick={state.toggleVideo}
              />
              <TakeScreenshotButton />
            </div>
            <EndCallButton
              onClick={state.handleEndCall}
              disabled={state.isEndingCall}
            />
          </div>
        )}
      </div>
    </div>
  );
};
