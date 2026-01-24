import { useRouter } from 'next/router';
import { useStore } from 'zustand';

import { LoginSchema } from '@/schemas/Login.schema';

import userInfoStore from '@/stores/userInfo.store';

import LoginForm from '@/modules/login-screen/login-form';

const LoginContainer = () => {
  const router = useRouter();

  const { setUserInfo } = useStore(userInfoStore);

  const handleLogin = (data: LoginSchema) => {
    setUserInfo(data);
    router.push(data.role === 'doctor' ? '/doctor' : '/patient');
  };

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm space-y-6">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <h2 className="text-center text-2xl/9 font-bold tracking-tight">
            Welcome
          </h2>
        </div>

        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <LoginForm onLogin={handleLogin} />
        </div>
      </div>
    </div>
  );
};

export default LoginContainer;
