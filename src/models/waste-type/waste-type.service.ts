import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { CreateWasteTypeDto } from './dto/create-waste.dto';
import { UpdateWasteTypeDto } from './dto/update-waste.dto';

@Injectable()
export class WasteTypeService {
  constructor(private readonly prisma: PrismaService) {}

  public create(createWasteTypeDto: CreateWasteTypeDto) {
    return this.prisma.wasteType.create({ data: createWasteTypeDto });
  }

  public findAll() {
    return this.prisma.wasteType.findMany();
  }

  public findOne(id: number) {
    return this.prisma.wasteType.findUnique({ where: { id } });
  }

  public update(id: number, data: UpdateWasteTypeDto) {
    return this.prisma.wasteType.update({ where: { id }, data });
  }

  public remove(id: number) {
    return this.prisma.wasteType.delete({ where: { id } });
  }
}
