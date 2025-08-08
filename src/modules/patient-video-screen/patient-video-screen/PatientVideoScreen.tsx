import { useGenerateUserSignature } from '@/queries/videoProvider/videoProvider.query';
import { useStore } from 'zustand';

import userInfoStore from '@/stores/userInfo.store';

import PatientVideoContainer from '../patient-video-container';

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
