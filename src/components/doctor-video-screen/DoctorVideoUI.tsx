import { DoctorVideoState } from '@/hooks/useDoctorVideoState';

import { CallStateManager } from './CallStateComponents';

interface DoctorVideoUIProps {
  state: DoctorVideoState;
}

export const DoctorVideoUI = ({ state }: DoctorVideoUIProps) => {
  return <CallStateManager state={state} />;
};
