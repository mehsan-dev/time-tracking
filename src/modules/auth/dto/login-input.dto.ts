import { IsNotEmpty, IsString } from 'class-validator';

export default class LoginInput {
  @IsNotEmpty()
  @IsString()
  username: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
