export interface User {
  id: string;
  username: string;
  email: string;
  profilePicUrl?: string;
  phone?: string;
  gender?: 'male' | 'female' | 'other';
}

export interface AuthState {
  token: string | null;
  user: User | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

export interface UserRegisterRequest {
  username: string;
  email: string;
  password: string;
  phone?: string;
  gender?: 'male' | 'female' | 'other';
  profilePicUrl?: string;
}

export interface UserLoginRequest {
  username: string;
  password: string;
}

export interface UserLoginResponse {
  access_token: string;
}

export interface UserProfileResponse extends User {}

export interface UserAvatarProps {
  profilePicUrl?: string;
  username?: string;
  size?: number;
  sx?: object;
} 