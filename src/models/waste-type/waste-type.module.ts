import { Module } from '@nestjs/common';
import { WasteTypeService } from './waste-type.service';
import { WasteTypeController } from './waste-type.controller';

@Module({
  providers: [WasteTypeService],
  controllers: [WasteTypeController]
})
export class WasteTypeModule {}
