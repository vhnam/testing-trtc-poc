import { LOCAL_VIDEO_VIEW, REMOTE_VIDEO_VIEW } from '@/constants/room';

interface PatientVideoLayoutProps {
  remoteUsers: string[];
}

const PatientVideoLayout = ({ remoteUsers }: PatientVideoLayoutProps) => {
  return (
    <div className="relative">
      <div className="w-full h-[calc(100svh-68px)] flex items-center justify-center bg-gray-200 relative">
        {remoteUsers.length === 0 && (
          <div className="absolute">
            <p className="text-gray-800 text-2xl font-semibold">
              The doctor will join shortly
            </p>
          </div>
        )}

        <div id={REMOTE_VIDEO_VIEW} className="size-full [&_video]:align-top" />
      </div>

      <div
        id={LOCAL_VIDEO_VIEW}
        className="absolute top-4 right-4 lg:top-12 lg:right-16 w-[120px] h-[160px] bg-gray-200 rounded-lg overflow-hidden [&_video]:align-top shadow-lg"
      />
    </div>
  );
};

export default PatientVideoLayout;
