import { IconArrowNarrowDownDashed } from '@tabler/icons-react';
import { useRouter } from 'next/router';
import { ReactNode } from 'react';

import { DoctorVideoState } from '@/hooks/useDoctorVideoState';

import { CallControlsBar } from './CallControlsBar';
import { VideoCallLayout } from './VideoCallLayout';

interface CallStateComponentProps {
  state: DoctorVideoState;
}

// Loading state component for when joining a room
export const LoadingCallState = () => {
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <div className="text-lg">Joining room...</div>
      </div>
    </div>
  );
};

// Error state component for when there's a join error
export const ErrorCallState = ({ state }: CallStateComponentProps) => {
  const router = useRouter();

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="text-center">
        <div className="text-red-600 mb-4">{state.joinError}</div>
        <button
          onClick={() => router.push('/')}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Go Back
        </button>
      </div>
    </div>
  );
};

// Empty state component when no room is active
export const EmptyCallState = ({ state }: CallStateComponentProps) => {
  return (
    <div>
      <div className="flex justify-center w-full h-[calc(100vh-68px)] items-center relative">
        <div className="flex flex-col justify-center items-center h-screen">
          <div className="text-center">
            <div className="flex items-center justify-center mb-8">
              <div className="animate-bounce border border-primary/20 rounded-full p-2 bg-accent">
                <IconArrowNarrowDownDashed className="size-16 mx-auto opacity-80" />
              </div>
            </div>
            <p className="text-muted-foreground mb-8">
              Click below to join the room
            </p>
          </div>
        </div>
      </div>

      <CallControlsBar state={state} showInvitationDialog={true} />
    </div>
  );
};

// Active call state component when in a call
export const ActiveCallState = ({ state }: CallStateComponentProps) => {
  return (
    <div>
      <div className="flex justify-center w-full h-[calc(100vh-68px)] items-center relative">
        <div className="w-240 h-180">
          <VideoCallLayout
            remoteUsers={state.remoteUsers}
            networkQuality={state.networkQuality}
          />
        </div>
      </div>

      <CallControlsBar state={state} showInvitationDialog={false} />
    </div>
  );
};

// Main state manager component that renders the appropriate state
export const CallStateManager = ({
  state,
  children,
}: {
  state: DoctorVideoState;
  children?: ReactNode;
}) => {
  // Show loading state
  if (state.isJoining) {
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
