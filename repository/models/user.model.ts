export interface IUserBase {
  username: string;
  email: string;
  password: string;
  role: string;
  profileimage?: string;
}

export interface IUser extends IUserBase {
  userid: number;
}
