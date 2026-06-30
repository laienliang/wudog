export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

export interface UserProfile {
  id: number;
  phone: string;
  nickname: string;
  avatar: string;
  gender: number;
  region: string;
  bio: string;
  createdAt: Date;
}
