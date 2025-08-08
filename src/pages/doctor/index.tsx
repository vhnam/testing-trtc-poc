import dynamic from 'next/dynamic';
import Head from 'next/head';

const DoctorVideoScreen = dynamic(
  () => import('@/modules/doctor-video-screen/doctor-video-screen'),
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
      <DoctorVideoScreen />
    </>
  );
};

export default DoctorPage;
