import { ReactNode } from 'react';

import { PatientVideoState } from '@/hooks/usePatientVideoState';

import {
  ErrorState,
  LoadingState,
  MediaControls,
  PatientVideoLayout,
} from '@/components';
import { Button } from '@/components/ui/button';

interface CallStateComponentProps {
  state: PatientVideoState;
}

// Loading state component for when joining a room
export const LoadingCallState = () => {
  return <LoadingState />;
};

// Error state component for when there's a join error
export const ErrorCallState = ({ state }: CallStateComponentProps) => {
  return <ErrorState error={state.joinError} />;
};

// Empty state component when no room is active
export const EmptyCallState = ({ state }: CallStateComponentProps) => {
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="text-center">
        <h2 className="text-2xl font-semibold mb-4">Patient Video Call</h2>
        <p className="text-gray-600 mb-8">Click below to join the room</p>
        <Button type="button" onClick={state.handleJoinRoom} variant="outline">
          Join Room
        </Button>
      </div>
    </div>
  );
};

// Active call state component when in a call
export const ActiveCallState = ({ state }: CallStateComponentProps) => {
  return (
    <div className="relative">
      <PatientVideoLayout remoteUsers={state.remoteUsers} />

      <MediaControls
        isAudioStarted={state.isAudioStarted}
        isVideoStarted={state.isVideoStarted}
        isVideoOn={state.isVideoOn}
        isMicrophoneOn={state.isMicrophoneOn}
        onToggleMicrophone={state.toggleMicrophone}
        onToggleVideo={state.toggleVideo}
        onEndCall={state.handleEndCall}
      />
    </div>
  );
};

// Main state manager component that renders the appropriate state
export const PatientCallStateManager = ({
  state,
  children,
}: {
  state: PatientVideoState;
  children?: ReactNode;
}) => {
  // Show loading state
  if (state.isJoining) {
    console.log('Patient is joining, showing loading state');
    return <LoadingCallState />;
  }

  // Show error state
  if (state.joinError) {
    return <ErrorCallState state={state} />;
  }

  // Show active call state or empty state based on room status
  if (state.currentRoomId) {
    return <ActiveCallState state={state} />;
  }

  // Show empty state (no active room)
  return <EmptyCallState state={state} />;
};
