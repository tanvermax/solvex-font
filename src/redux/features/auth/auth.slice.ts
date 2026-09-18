// redux/features/auth/auth.slice.ts
import type { IUser } from '@/components/navbar-components/user-menu';
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  user: IUser | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

// 🔥 localStorage থেকে ডেটা লোড করার ফাংশন
const loadAuthFromStorage = (): Partial<AuthState> => {
  try {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    
    // console.log("🔍 Loading auth from localStorage:", { token, userStr });
    
    if (token && userStr) {
      const user = JSON.parse(userStr);
      console.log("✅ Auth loaded from localStorage:", { user, token });
      return { 
        user, 
        token, 
        isAuthenticated: true,
        isLoading: false 
      };
    }
  } catch (error) {
    console.error('❌ Error loading auth from localStorage:', error);
    // 🔥 যদি error হয়, localStorage clean করুন
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
  return { isLoading: false };
};

// 🔥 Initial state - localStorage থেকে লোড করুন
const initialState: AuthState = {
  user: null,
  token: null,
  isLoading: false,
  isAuthenticated: false,
  ...loadAuthFromStorage(),
};

console.log("🔍 Initial Auth State from localStorage:", initialState);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<{ user: IUser; token: string }>) => {
      // console.log("🔥 setUser called with:", action.payload);
      
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      state.isLoading = false;
      
      // 🔥 Save to localStorage
      localStorage.setItem('token', action.payload.token);
      localStorage.setItem('user', JSON.stringify(action.payload.user));
      
      console.log("✅ Auth state updated and saved to localStorage");
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    logout: (state) => {
      // console.log("🔥 logout called");
      
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.isLoading = false;
      
      // 🔥 Clear localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // 🔥 Clear cookies
      document.cookie.split(";").forEach((c) => {
        document.cookie = c
          .replace(/^ +/, "")
          .replace(/=.*/, `=;expires=${new Date(0).toUTCString()};path=/`);
      });
      
      // console.log("✅ Logout: Auth state cleared");
    },
    // 🔥 নতুন: localStorage থেকে রিলোড করার জন্য
    rehydrate: (state) => {
      const saved = loadAuthFromStorage();
      if (saved.user && saved.token) {
        state.user = saved.user;
        state.token = saved.token;
        state.isAuthenticated = true;
        state.isLoading = false;
        // console.log("✅ Auth rehydrated from localStorage");
      }
    },
  },
});

export const { setUser, setLoading, logout, rehydrate } = authSlice.actions;
export default authSlice.reducer;

// Selectors
export const useCurrentToken = (state: { auth: AuthState }) => state.auth.token;
export const useCurrentUser = (state: { auth: AuthState }) => state.auth.user;
export const useIsAuthenticated = (state: { auth: AuthState }) => state.auth.isAuthenticated;