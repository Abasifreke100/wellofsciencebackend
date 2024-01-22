import { IsEmail, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class LoginDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;
}

export class CheckEmailDto {
  @IsEmail()
  email: string;
}

export class CheckOtpDto {
  @IsNumber()
  code: number;
}
