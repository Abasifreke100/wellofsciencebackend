import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsNumberString,
  IsOptional,
  IsString,
} from 'class-validator';
import { StatusEnum } from '../../../../common/constants/user.constants';

export class UpdateTraderAccountDto {
  @IsOptional()
  @IsString()
  trackRecord: string;

  @IsNotEmpty()
  @IsString()
  managedBefore: string;

  @IsNotEmpty()
  @IsString()
  tradingSpecialty: string;

  @IsNotEmpty()
  @IsString()
  riskMitigation: string;

  @IsNotEmpty()
  @IsString()
  techniques: string;

  @IsNotEmpty()
  @IsArray()
  traderType: Array<any>;

  @IsNotEmpty()
  @IsNumberString()
  experience: number;

  @IsOptional()
  @IsString()
  identity: string;

  @IsOptional()
  @IsString()
  address: string;
}

export class ApproveTraderAccountDto {
  @IsNotEmpty()
  @IsEnum(StatusEnum)
  status: string;

  @IsOptional()
  @IsNumber()
  isTradingExperience: number;
}
