import { createStore } from 'zustand';
import { persist } from 'zustand/middleware';

import { IUserInfo } from '@/models/UserInfo.model';

type UserInfoState = {
  userInfo: IUserInfo;
};

type UserInfoStoreActions = {
  setUserInfo: (nextPosition: UserInfoState['userInfo']) => void;
  reset: () => void;
};

type UserInfoStore = UserInfoState & UserInfoStoreActions;

const defaultState = {
  userInfo: {
    userId: '',
    role: '',
  },
};

const userInfoStore = createStore<UserInfoStore>()(
  persist(
    (set) => ({
      ...defaultState,
      setUserInfo: (userInfo) => set({ userInfo }),
      reset: () => set(defaultState),
    }),
    {
      name: 'user-info-storage', // unique name for localStorage key
      partialize: (state) => ({ userInfo: state.userInfo }), // only persist userInfo
    }
  )
);

export default userInfoStore;
