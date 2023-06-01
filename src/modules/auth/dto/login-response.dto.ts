import { IsString } from 'class-validator';

export default class LoginResponse {
  @IsString()
  accessToken: string;
}
