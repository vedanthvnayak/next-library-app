export interface IUserBase {
  username: string;
  email: string;
  password: string;
  role: string;
  profileimage?: string;
  wallet?: number;
}

export interface IUser extends IUserBase {
  userid: number;
}
