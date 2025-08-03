import LibGenerateTestUserSig from "@/libs/lib-generate-test-usersig-es.min.js";

/**
 * Refer to the READEME.md for the SDKAppID、SecretKey
 */
const sdkAppId = parseInt(process.env.NEXT_PUBLIC_SDK_APP_ID as string);
const secretKey = process.env.NEXT_PUBLIC_SDK_SECRET_KEY;

/**
 * Expiration time for the signature, it is recommended not to set it too short.
 * Time unit: seconds
 * Default time: 7 x 24 x 60 x 60 = 604800 = 7 days
 */
const EXPIRED_TIME = 60 * 60 * 24 * 7;

export const genTestUserSig = (params: {
  userId: string;
}): {
  sdkAppId: number;
  userSig: string;
} => {
  const generator = new LibGenerateTestUserSig(
    sdkAppId,
    secretKey,
    EXPIRED_TIME
  );
  const userSig = generator.genTestUserSig(params.userId);

  return {
    sdkAppId,
    userSig,
  };
};
