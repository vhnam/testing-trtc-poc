import { useGenerateUserSignature } from '@/queries/video-provider/video-provider.query';
import { useStore } from 'zustand';

import userInfoStore from '@/stores/user-info.store';

import PatientVideoContainer from '@/modules/patient-video-screen/patient-video-container';

const PatientVideoScreen = () => {
  const {
    userInfo: { userId },
  } = useStore(userInfoStore);

  const { data, isLoading } = useGenerateUserSignature(userId);

  if (isLoading) {
    return <div>Loading</div>;
  }

  return (
    <PatientVideoContainer
      sdkAppId={data?.sdkAppId as number}
      userSig={data?.userSig as string}
    />
  );
};

export default PatientVideoScreen;
