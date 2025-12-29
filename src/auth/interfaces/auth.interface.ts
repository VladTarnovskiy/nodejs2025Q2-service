export interface IAuthRegister {
  login: string;
}

export interface IAuthLogin {
  accessToken: string;
  refreshToken: string | null;
}
