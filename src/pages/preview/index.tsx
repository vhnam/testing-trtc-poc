import dynamic from 'next/dynamic';
import Head from 'next/head';

const MediaPreviewScreen = dynamic(
  () => import('@/modules/media-preview-screen/media-preview-screen'),
  {
    ssr: false,
  }
);

const MediaPreviewPage = () => {
  return (
    <>
      <Head>
        <title>Media Preview</title>
      </Head>
      <MediaPreviewScreen />
    </>
  );
};

export default MediaPreviewPage;
