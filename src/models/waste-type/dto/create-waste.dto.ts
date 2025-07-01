import { IsString, IsNotEmpty } from 'class-validator';

export class CreateWasteTypeDto {
  @IsString()
  @IsNotEmpty()
  name: string;
}
