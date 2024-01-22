import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  MaxLength,
  MinLength,
} from 'class-validator';
import { IsStrongPassword } from './password.validator';

export class CreateUserDto {
  @Length(2, 30)
  @IsString()
  firstName: string;

  @Length(2, 30)
  @IsString()
  lastName: string;

  @IsEmail()
  email: string;

  @IsString()
  role: string;

  @IsString()
  @MinLength(8)
  @MaxLength(20)
  @IsStrongPassword()
  password: string;

  @IsString()
  country: string;

  @IsNumber()
  @IsOptional()
  referrerId: number;

  @IsNumber()
  @IsOptional()
  referralCode: number;
}

export class UpdateProfileDto {
  @IsOptional()
  @IsString()
  firstName: string;

  @IsOptional()
  @IsString()
  email: string;

  @IsOptional()
  @IsString()
  lastName: string;

  @IsOptional()
  @IsString()
  country: string;

  @IsNotEmpty()
  @IsString()
  city: string;

  @IsNotEmpty()
  @IsString()
  bio: string;

  @IsNotEmpty()
  @IsString()
  phone: string;
}

export class SuspendUserDto {
  @IsString()
  @IsNotEmpty()
  status: string;
}
