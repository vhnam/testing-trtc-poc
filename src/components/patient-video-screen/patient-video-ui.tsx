import { PatientVideoState } from '@/hooks/use-patient-video-state';

import { PatientCallStateManager } from './patient-call-state-components';

interface PatientVideoUIProps {
  state: PatientVideoState;
}

export const PatientVideoUI = ({ state }: PatientVideoUIProps) => {
  return <PatientCallStateManager state={state} />;
};
