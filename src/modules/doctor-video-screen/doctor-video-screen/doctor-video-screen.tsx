import { useGenerateUserSignature } from '@/queries/video-provider/video-provider.query';
import { useStore } from 'zustand';

import userInfoStore from '@/stores/user-info.store';

import DoctorVideoContainer from '@/modules/doctor-video-screen/doctor-video-container';

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
