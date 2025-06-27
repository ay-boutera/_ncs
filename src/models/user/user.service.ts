import {
  BadRequestException,
  HttpException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';
import { error } from 'console';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  public async findAll(query: any) {
    // You can implement pagination, filtering, and sorting based on the query parameters
    const { page = 1, limit = 10 } = query;
    const skip = (page - 1) * limit;
    const take = limit;
    const users = await this.prisma.user.findMany({
      skip,
      take,
      orderBy: { createdAt: 'desc' }, // Example sorting by creation date
    });
    const total = await this.prisma.user.count();
    return {
      message: 'Users retrieved successfully',
      total,
      data: users,
    };
  }

  public async findOne(id: number) {
    return this.prisma.user.findUnique({ where: { id } });
  }

  public async create(createUserDto: CreateUserDto) {
    // Check if user exists first (outside try-catch)
    const existingUser = await this.prisma.user.findUnique({
      where: { email: createUserDto.email },
    });

    // If user exists, throw an error
    if (existingUser) {
      throw new BadRequestException('User with this email already exists');
    }

    try {
      const passwordHash = bcrypt.hashSync(createUserDto.password, 10);
      const newUser = await this.prisma.user.create({
        data: {
          ...createUserDto,
          password: passwordHash,
        },
      });

      return {
        message: 'user created successfully',
        data: newUser,
      };
    } catch (error) {
      // Handle Prisma unique constraint error
      if (error.code === 'P2002' && error.meta?.target?.includes('email')) {
        throw new BadRequestException('User with this email already exists');
      }

      throw new HttpException(
        {
          message: 'An unexpected error occurred while creating the user.',
          error: error?.message || 'Internal server error',
          statusCode: 500,
          timestamp: new Date().toISOString(),
        },
        500,
      );
    }
  }

  public async update(id: number, updateUserDto: UpdateUserDto) {
    if (!updateUserDto || Object.keys(updateUserDto).length === 0) {
      throw new BadRequestException(
        'Request body cannot be empty. Please provide at least one field to update.',
      );
    }

    if (updateUserDto.password) {
      throw new BadRequestException({
        message:
          'Password update is not allowed through this endpoint. Please use the change password feature.',
        error: 'PasswordUpdateNotAllowed',
        statusCode: 400,
      });
    }
    const dataToUpdate: UpdateUserDto = { ...updateUserDto };
    delete dataToUpdate.password;

    try {
      const updatedUser = await this.prisma.user.update({
        where: { id },
        data: dataToUpdate,
      });
      return {
        message: 'User updated successfully',
        data: updatedUser,
      };
    } catch (error) {
      console.log('Update error:', error); // Debug log to see what error we're getting

      // Handle Prisma unique constraint errors
      if (error.code === 'P2002' && error.meta?.target) {
        const target = error.meta.target;
        if (target.includes('email')) {
          throw new BadRequestException('User with this email already exists');
        }
        if (target.includes('userName')) {
          throw new BadRequestException(
            'User with this username already exists',
          );
        }
        // Generic unique constraint error if we can't identify the specific field
        throw new BadRequestException(
          'A user with this information already exists',
        );
      }

      // Handle case where user with given ID doesn't exist
      if (error.code === 'P2025') {
        throw new NotFoundException(`User with ID ${id} not found`);
      }

      // Handle generic Prisma record not found (sometimes comes as different error)
      if (
        error.message &&
        error.message.includes('Record to update not found')
      ) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }

      throw new HttpException(
        {
          message: 'An unexpected error occurred while updating the user.',
          error: error?.message || 'Internal server error',
          statusCode: 500,
          timestamp: new Date().toISOString(),
        },
        500,
      );
    }
  }

  public async delete(id: number) {
    try {
      await this.prisma.user.delete({
        where: { id },
      });

      // Return nothing for 204 No Content response
      return;
    } catch (error) {
      console.log('Delete error:', error); // Debug log

      // Handle case where user with given ID doesn't exist
      if (error.code === 'P2025') {
        throw new NotFoundException(`User with ID ${id} not found`);
      }

      // Handle foreign key constraint violations (if user has related records)
      if (error.code === 'P2003') {
        throw new BadRequestException(
          'Cannot delete user because they have associated records. Please remove related data first.',
        );
      }

      // Handle generic Prisma record not found (alternative error pattern)
      if (
        error.message &&
        error.message.includes('Record to delete does not exist')
      ) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }

      throw new HttpException(
        {
          message: 'An unexpected error occurred while deleting the user.',
          error: error?.message || 'Internal server error',
          statusCode: 500,
          timestamp: new Date().toISOString(),
        },
        500,
      );
    }
  }

  // ===================== For All Users =====================
  public async findMe(userId: number) {
    if (!userId) {
      throw new BadRequestException('User ID is required');
    }

    console.log('Finding user with ID:', userId);
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        userName: true,
        firstName: true,
        lastName: true,
        createdAt: true,
        updatedAt: true,
        picture: true, // Optional, can be a URL or base64 string
        // Add other fields you want to return, but exclude password
        // password: false is implicit when using select
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return {
      message: 'User retrieved successfully',
      data: user,
    };
  }

  public async updateMe(userId: number, updateUserDto: UpdateUserDto) {
    if (!userId) {
      throw new BadRequestException('User ID is required');
    }

    if (!updateUserDto || Object.keys(updateUserDto).length === 0) {
      throw new BadRequestException(
        'Request body cannot be empty. Please provide at least one field to update.',
      );
    }

    if (updateUserDto.password) {
      throw new BadRequestException({
        message:
          'Password update is not allowed through this endpoint. Please use the change password feature.',
        error: 'PasswordUpdateNotAllowed',
        statusCode: 400,
      });
    }
    const dataToUpdate: UpdateUserDto = { ...updateUserDto };
    delete dataToUpdate.password;

    try {
      const updatedUser = await this.prisma.user.update({
        where: { id: userId },
        data: dataToUpdate,
      });

      return {
        message: 'User updated successfully',
        data: updatedUser,
      };
    } catch (error) {
      console.log('Update error:', error); // Debug log to see what error we're getting

      // Handle Prisma unique constraint errors
      if (error.code === 'P2002' && error.meta?.target) {
        const target = error.meta.target;
        if (target.includes('email')) {
          throw new BadRequestException('User with this email already exists');
        }
        if (target.includes('userName')) {
          throw new BadRequestException(
            'User with this username already exists',
          );
        }
        // Generic unique constraint error if we can't identify the specific field
        throw new BadRequestException(
          'A user with this information already exists',
        );
      }

      // Handle case where user with given ID doesn't exist
      if (error.code === 'P2025') {
        throw new NotFoundException(`User with ID ${userId} not found`);
      }

      // Handle generic Prisma record not found (sometimes comes as different error)
      if (
        error.message &&
        error.message.includes('Record to update not found')
      ) {
        throw new NotFoundException(`User with ID ${userId} not found`);
      }

      throw new HttpException(
        {
          message: 'An unexpected error occurred while updating the user.',
          error: error?.message || 'Internal server error',
          statusCode: 500,
          timestamp: new Date().toISOString(),
        },
        500,
      );
    }
  }

  public async deleteMe(userId: number) {
    if (!userId) {
      throw new BadRequestException('User ID is required');
    }

    try {
      const updatedUser = await this.prisma.user.update({
        where: { id: userId },
        data: {
          isActive: false,
        },
      });

      return;
    } catch (error) {
      console.log('Delete error:', error); // Debug log

      // Handle case where user with given ID doesn't exist
      if (error.code === 'P2025') {
        throw new NotFoundException(`User with ID ${userId} not found`);
      }

      // Handle generic Prisma record not found (alternative error pattern)
      if (
        error.message &&
        error.message.includes('Record to update not found')
      ) {
        throw new NotFoundException(`User with ID ${userId} not found`);
      }

      throw new HttpException(
        {
          message:
            'An unexpected error occurred while deactivating the account.',
          error: error?.message || 'Internal server error',
          statusCode: 500,
          timestamp: new Date().toISOString(),
        },
        500,
      );
    }
  }
}
