import { PatientVideoState } from '@/hooks/usePatientVideoState';

import { PatientCallStateManager } from './PatientCallStateComponents';

interface PatientVideoUIProps {
  state: PatientVideoState;
}

export const PatientVideoUI = ({ state }: PatientVideoUIProps) => {
  return <PatientCallStateManager state={state} />;
};
