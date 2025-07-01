import {
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
  ParseIntPipe,
  Body,
  Req,
} from '@nestjs/common';
import { Roles } from 'src/common/decorators/roles.decorator';
import { UserService } from './user.service';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { RolesGuard } from 'src/common/guards/roles.guard';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @HttpCode(HttpStatus.OK)
  // @UseGuards(AuthGuard, RolesGuard) // AuthGuard MUST come first
  // @Roles('admin', 'superAdmin') // Allow both admin and superAdmin
  @Get('all')
  public async findAll(@Query() query: any) {
    return this.userService.findAll(query);
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard, RolesGuard) // AuthGuard MUST come first
  @Roles('admin', 'superAdmin') // Allow both admin and superAdmin
  @Get(':id')
  public async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.userService.findOne(id);
  }

  @HttpCode(HttpStatus.CREATED)
  @UseGuards(AuthGuard, RolesGuard) // AuthGuard MUST come first
  @Roles('admin', 'superAdmin') // Allow both admin and superAdmin
  @Post('create')
  public async create(@Body() CreateUserDto: CreateUserDto) {
    return this.userService.create(CreateUserDto);
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard, RolesGuard) // AuthGuard MUST come first
  @Roles('admin', 'superAdmin') // Allow both admin and superAdmin
  @Patch(':id')
  public async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.userService.update(id, updateUserDto);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(AuthGuard, RolesGuard) // AuthGuard MUST come first
  @Roles('admin', 'superAdmin') // Allow both admin and superAdmin
  @Delete(':id')
  public async delete(@Param('id', ParseIntPipe) id: number) {
    return this.userService.delete(id);
  }
}

@Controller('userMe')
export class UserMeController {
  constructor(private readonly userService: UserService) {}

  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  @Get('me')
  public async findMe(@Req() req: any) {
    return this.userService.findMe(req.user.id);
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  @Patch('me')
  public async updateMe(@Req() req: any, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.updateMe(req.user.id, updateUserDto);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(AuthGuard, RolesGuard) // AuthGuard MUST come first
  @Roles('user') // Only accessible by user
  @Delete('me')
  public async deleteMe(@Req() req: any) {
    return this.userService.deleteMe(req.user.id);
  }
}
