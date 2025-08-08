import { LOCAL_VIDEO_VIEW, REMOTE_VIDEO_VIEW } from '@/constants/room';

import { cn } from '@/utils/ui';

interface DoctorVideoLayoutProps {
  remoteUsers: string[];
  isConfigPanelOpen?: boolean;
}

const DoctorVideoLayout = ({
  remoteUsers,
  isConfigPanelOpen = false,
}: DoctorVideoLayoutProps) => {
  return (
    <div className="w-full h-full bg-gray-200 rounded-t-lg overflow-hidden relative">
      {remoteUsers.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center">
          <p className="text-gray-800 text-2xl font-semibold">
            Waiting for patient to join...
          </p>
        </div>
      )}

      <div
        id={REMOTE_VIDEO_VIEW}
        className="w-full h-full [&_video]:align-top"
      />

      <div
        id={LOCAL_VIDEO_VIEW}
        className={cn(
          'absolute left-6 w-[100px] h-[128px] bg-white [&_video]:align-top shadow-lg rounded-lg overflow-hidden',
          {
            'bottom-[342px]': isConfigPanelOpen,
            'bottom-[98px]': !isConfigPanelOpen,
          }
        )}
      />
    </div>
  );
};

export default DoctorVideoLayout;
