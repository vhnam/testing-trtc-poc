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
    <div>
      <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight">
            Create / Login UserId
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <LoginForm onLogin={handleLogin} />
        </div>
      </div>
    </div>
  );
};

export default LoginContainer;
