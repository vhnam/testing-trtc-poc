import { useGenerateUserSignature } from '@/queries/videoProvider/videoProvider.query';
import { useStore } from 'zustand';

import userInfoStore from '@/stores/userInfo.store';

import DoctorVideoContainer from '../doctor-video-container';

const DoctorVideoScreen = () => {
  const {
    userInfo: { userId },
  } = useStore(userInfoStore);

  const { data, isLoading } = useGenerateUserSignature(userId);

  if (isLoading) {
    return <div>Loading</div>;
  }

  return (
    <DoctorVideoContainer
      sdkAppId={data?.sdkAppId as number}
      userSig={data?.userSig as string}
    />
  );
};

export default DoctorVideoScreen;
