export interface User {
  id: string;
  username: string;
  email: string;
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