const LoadingState = () => {
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <div className="text-lg">Joining room...</div>
      </div>
    </div>
  );
};

export default LoadingState;
