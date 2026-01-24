import { useState } from 'react';
import { NetworkQuality } from 'trtc-sdk-v5';

import { AudioVideoConfigurationPanel, DoctorVideoLayout } from '@/components';

interface VideoCallLayoutProps {
  remoteUsers: string[];
  networkQuality?: NetworkQuality;
}

export const VideoCallLayout = ({
  remoteUsers,
  networkQuality,
}: VideoCallLayoutProps) => {
  const [isConfigPanelOpen, setIsConfigPanelOpen] = useState(false);

  return (
    <>
      <DoctorVideoLayout
        remoteUsers={remoteUsers}
        isConfigPanelOpen={isConfigPanelOpen}
      />

      <div className="relative">
        <AudioVideoConfigurationPanel
          isOpen={isConfigPanelOpen}
          networkQuality={networkQuality}
          setIsOpen={setIsConfigPanelOpen}
        />
      </div>
    </>
  );
};
