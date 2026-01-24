import { useRouter } from 'next/router';

interface ErrorStateProps {
  error: string;
}

const ErrorState = ({ error }: ErrorStateProps) => {
  const router = useRouter();

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="text-center">
        <div className="text-red-600 mb-4">{error}</div>
        <button
          onClick={() => router.push('/')}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Go Back
        </button>
      </div>
    </div>
  );
};

export default ErrorState;
