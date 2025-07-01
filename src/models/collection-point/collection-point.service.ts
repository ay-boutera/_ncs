import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateCollectionPointDto } from './dto/create-collection-point.dto';
import { UpdateCollectionPointDto } from './dto/update-collection-point.dto';

@Injectable()
export class CollectionPointService {
  constructor(private readonly prisma: PrismaService) {}

  public create(createCollectionPointDto: CreateCollectionPointDto) {
    return this.prisma.collectionPoint.create({
      data: createCollectionPointDto,
    });
  }

  public findAll() {
    return this.prisma.collectionPoint.findMany();
  }

  public findOne(id: number) {
    return this.prisma.collectionPoint.findUnique({ where: { id } });
  }

  public update(
    id: number,
    updateCollectionPointDto: UpdateCollectionPointDto,
  ) {
    return this.prisma.collectionPoint.update({
      where: { id },
      data: updateCollectionPointDto,
    });
  }

  public remove(id: number) {
    return this.prisma.collectionPoint.delete({ where: { id } });
  }
}
