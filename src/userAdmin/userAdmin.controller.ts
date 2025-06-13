import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UserAdminService } from './userAdmin.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserAdminService) {}

}
