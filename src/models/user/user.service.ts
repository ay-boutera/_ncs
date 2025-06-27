import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  public async findAll() {
    return this.prisma.user.findMany();
  }

  public async findOne(id: number) {
    return this.prisma.user.findUnique({ where: { id } });
  }

  public async create(data: any) {
    return this.prisma.user.create({ data });
  }

  public async update(id: number, data: any) {
    return this.prisma.user.update({ where: { id }, data });
  }

  public async delete(id: number) {
    return this.prisma.user.delete({ where: { id } });
  }
}
