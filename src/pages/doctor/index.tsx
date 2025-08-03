import Head from 'next/head';

import DoctorVideoContainer from '@/modules/doctor-video-screen/doctor-video-container';

const DoctorPage = () => {
  return (
    <>
      <Head>
        <title>Doctor</title>
      </Head>
      <DoctorVideoContainer />
    </>
  );
};

export default DoctorPage;
