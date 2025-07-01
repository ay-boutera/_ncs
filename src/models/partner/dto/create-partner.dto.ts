import {
  IsArray,
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export enum PartnerStatus {
  Active = 'active',
  Inactive = 'inactive',
}

export class CreatePartnerDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsEnum(PartnerStatus)
  status: PartnerStatus;

  @IsNotEmpty()
  @IsArray()
  @IsString({ each: true })
  service: string[];

  @IsNotEmpty()
  @IsString()
  content: string;

  @IsNotEmpty()
  @IsNumber()
  longitude: number;

  @IsNotEmpty()
  @IsNumber()
  latitude: number;

  @IsNotEmpty()
  @IsString()
  address: string;

  @IsNotEmpty()
  @IsNumber()
  credits: number;

  @IsNotEmpty()
  @IsDate()
  startDate: string;

  @IsNotEmpty()
  @IsDate()
  endDate: string;
}
