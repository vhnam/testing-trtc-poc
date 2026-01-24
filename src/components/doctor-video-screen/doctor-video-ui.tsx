import { DoctorVideoState } from '@/hooks/use-doctor-video-state';

import { CallStateManager } from './call-state-components';

interface DoctorVideoUIProps {
  state: DoctorVideoState;
}

export const DoctorVideoUI = ({ state }: DoctorVideoUIProps) => {
  return <CallStateManager state={state} />;
};
