import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

interface UserSignatureResponse {
  sdkAppId: number;
  userSig: string;
}

interface GenerateUserSignatureParams {
  userId: string;
}

/**
 * Generates a user signature for TRTC authentication
 * @param userId - The user ID to generate signature for
 * @returns Promise containing SDK app ID and user signature
 */
const generateUserSignature = async (
  params: GenerateUserSignatureParams
): Promise<UserSignatureResponse> => {
  const { userId } = params;

  const response = await axios.post('/api/generate-user-sig', { userId });
  return response.data;
};

/**
 * React Query hook for generating user signature
 * @param userId - The user ID to generate signature for
 
 * @returns Query object with loading, error, and data states
 */
export const useGenerateUserSignature = (userId: string) => {
  return useQuery({
    queryKey: ['generateUserSignature', userId],
    queryFn: () => generateUserSignature({ userId }),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};
