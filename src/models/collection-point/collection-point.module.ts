import { Module } from '@nestjs/common';
import { CollectionPointService } from './collection-point.service';
import { CollectionPointController } from './collection-point.controller';

@Module({
  providers: [CollectionPointService],
  controllers: [CollectionPointController]
})
export class CollectionPointModule {}
