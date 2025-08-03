import dynamic from 'next/dynamic';
import Head from 'next/head';

const DoctorVideoContainer = dynamic(
  () => import('@/modules/doctor-video-screen/doctor-video-container'),
  {
    ssr: false,
  }
);

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
