import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePartnerDto } from './dto/create-partner.dto';
import { UpdatePartnerDto } from './dto/update-partner.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PartnerService {
  constructor(private readonly prisma: PrismaService) {}
  public create(createPartnerDto: CreatePartnerDto) {
    return this.prisma.partner.create({
      data: createPartnerDto,
    });
  }

  public findAll() {
    return this.prisma.partner.findMany();
  }

  public findOne(id: number) {
    return this.prisma.partner.findUnique({
      where: { id },
    });
  }

  public async update(id: number, updatePartnerDto: UpdatePartnerDto) {
    try {
      const updatedPartner = await this.prisma.partner.update({
        where: { id },
        data: updatePartnerDto,
      });
      return updatedPartner;
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Partner with ID ${id} not found`);
      }
      throw error;
    }
  }

  public async remove(id: number) {
    try {
      return await this.prisma.partner.delete({
        where: { id },
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Partner with ID ${id} not found`);
      }
      throw error;
    }
  }
}
