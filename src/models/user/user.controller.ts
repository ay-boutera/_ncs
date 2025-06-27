import {
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { Roles } from 'src/common/decorators/roles.decorator';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @HttpCode(HttpStatus.OK)
  @Roles('admin') // Only accessible by admin and superadmin roles
  @Get('all')
  public async findAll() {
    return this.userService.findAll();
  }

  @HttpCode(HttpStatus.OK)
  @Roles('admin') // Only accessible by admin and superadmin roles
  @Get(':id')
  public async findOne(@Param('id') id: number) {
    return this.userService.findOne(id);
  }

  @HttpCode(HttpStatus.CREATED)
  @Roles('admin') // Only accessible by admin and superadmin roles
  @Post('create')
  public async create(CreateUserDto: CreateUserDto) {
    this.userService.create(CreateUserDto);
  }

  @HttpCode(HttpStatus.OK)
  @Patch(':id')
  public async update(@Param('id') id: number, data: any) {
    return this.userService.update(id, data);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  public async delete(@Param('id') id: number) {
    return this.userService.delete(id);
  }

  @HttpCode(HttpStatus.OK)
  @Get('profile')
  public async profile() {
    // This method should return the profile of the logged-in user.
    // Implementation depends on how you handle authentication.
    // For example, you might want to use a guard to get the user from the request.
    return { message: 'User profile data' };
  }
}
