import { useDoctorVideoState } from '@/hooks';

import { DoctorVideoUI } from '@/components/doctor-video-screen';

interface DoctorVideoContainerProps {
  sdkAppId: number;
  userSig: string;
}

const DoctorVideoContainer = ({
  sdkAppId,
  userSig,
}: DoctorVideoContainerProps) => {
  const doctorVideoState = useDoctorVideoState({ sdkAppId, userSig });

  return <DoctorVideoUI state={doctorVideoState} />;
};

export default DoctorVideoContainer;
