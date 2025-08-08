import dynamic from 'next/dynamic';
import Head from 'next/head';

const PatientVideoScreen = dynamic(
  () => import('@/modules/patient-video-screen/patient-video-screen'),
  {
    ssr: false,
  }
);

const PatientPage = () => {
  return (
    <>
      <Head>
        <title>Patient</title>
      </Head>
      <PatientVideoScreen />
    </>
  );
};

export default PatientPage;
