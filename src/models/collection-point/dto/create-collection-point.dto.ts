import { IsString, IsNumber, IsNotEmpty } from 'class-validator';

export class CreateCollectionPointDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @IsNotEmpty()
  latitude: number;

  @IsNumber()
  @IsNotEmpty()
  longitude: number;

  @IsString()
  @IsNotEmpty()
  address: string;
}
