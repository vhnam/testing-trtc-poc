import dynamic from "next/dynamic";
import Head from "next/head";

const PatientVideoContainer = dynamic(
  () => import("@/modules/patient-video-screen/patient-video-container"),
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
      <PatientVideoContainer />;
    </>
  );
};

export default PatientPage;
