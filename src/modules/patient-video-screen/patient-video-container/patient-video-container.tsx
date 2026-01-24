import { usePatientVideoState } from '@/hooks';

import { PatientVideoUI } from '@/components/patient-video-screen';

interface PatientVideoContainerProps {
  sdkAppId: number;
  userSig: string;
}

const PatientVideoContainer = ({
  sdkAppId,
  userSig,
}: PatientVideoContainerProps) => {
  const patientVideoState = usePatientVideoState({ sdkAppId, userSig });

  return <PatientVideoUI state={patientVideoState} />;
};

export default PatientVideoContainer;
