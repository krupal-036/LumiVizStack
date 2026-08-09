export interface UserRequest {
  id?: string | number;
  role?: string;
  username?: string;
  email?: string;
  password?: string;
  credits: number;
}
