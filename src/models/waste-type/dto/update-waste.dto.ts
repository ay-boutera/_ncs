import { PartialType } from '@nestjs/mapped-types';
import { CreateWasteTypeDto } from './create-waste.dto';

export class UpdateWasteTypeDto extends PartialType(CreateWasteTypeDto) {}
