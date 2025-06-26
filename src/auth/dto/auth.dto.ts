import {
  IsString,
  MinLength,
  Matches,
  IsNotEmpty,
  IsEmail,
  IsOptional,
  Length,
  IsInt,
} from 'class-validator';
import { Match } from '../../common/decorators/match.decorator';

export class LoginDto {
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  password: string;
}

export class RegisterDto {
  @IsOptional()
  @IsString()
  userName: string;

  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  firstName: string;

  @IsNotEmpty()
  @IsString()
  lastName: string;

  @IsString({ message: 'verificationCode must be a string' })
  @IsOptional()
  @Length(6, 6, { message: 'verificationCode must be 6 characters' })
  verificationCode: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  // here we can use regex to validate password strength with Matches decorator
  password: string;

  @IsNotEmpty()
  @Match('password', {
    message: 'from Dto Passwords do not match',
  })
  confirmPassword: string;
}

export class EmailDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;
}

export class VerifyCodeDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  @Length(6, 6, { message: 'Invalid code' })
  code: string;
}

export class changePasswordDto extends LoginDto {
  @IsNotEmpty()
  @Match('password', {
    message: 'from Dto Passwords do not match',
  })
  confirmPassword: string;
}

export class ChangePasswordForLoggedInUserDto {
  @IsNotEmpty()
  @IsInt()
  userId: number;

  @IsNotEmpty()
  @IsString()
  currentPassword: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  newPassword: string;

  @IsNotEmpty()
  @Match('newPassword', {
    message: 'from Dto Passwords do not match',
  })
  confirmPassword: string;
}

