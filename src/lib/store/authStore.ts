import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  email: string;
  name?: string;
}

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  setUser: (user: User | null) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      user: null,

      login: async (email: string, password: string) => {
        try {
          // TODO: 실제 API 호출로 대체
          // const response = await fetch('/api/auth/login', {
          //   method: 'POST',
          //   headers: { 'Content-Type': 'application/json' },
          //   body: JSON.stringify({ email, password }),
          // });
          // const data = await response.json();

          // 임시 로직: 이메일과 비밀번호가 입력되면 로그인 성공
          if (email && password) {
            const user: User = {
              id: '1',
              email,
              name: email.split('@')[0],
            };
            set({ isAuthenticated: true, user });
            return true;
          }
          return false;
        } catch (error) {
          console.error('Login error:', error);
          return false;
        }
      },

      logout: () => {
        set({ isAuthenticated: false, user: null });
      },

      setUser: (user) => {
        set({ user, isAuthenticated: !!user });
      },
    }),
    {
      name: 'auth-storage', // localStorage key
    },
  ),
);

