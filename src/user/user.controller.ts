import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { WebResponse } from '../model/web.model';
import {
  LoginUserRequest,
  RegisterUserRequest,
  UpdateUserRequest,
  UserResponse,
} from '../model/user.model';
import { Auth } from '../common/auth.decorator';
import type { User } from '@prisma/client';
import { AuthGuard } from '../auth/auth.guard';

@Controller('/api/users')
export class UserController {
  constructor(private userService: UserService) {}

  @Post()
  @HttpCode(200)
  async register(
    @Body() req: RegisterUserRequest,
  ): Promise<WebResponse<UserResponse>> {
    const res = await this.userService.register(req);
    return {
      data: res,
    };
  }

  @Post('/login')
  @HttpCode(200)
  async login(
    @Body() req: LoginUserRequest,
  ): Promise<WebResponse<UserResponse>> {
    const res = await this.userService.login(req);
    return {
      data: res,
    };
  }

  @Get('/current')
  @HttpCode(200)
  @UseGuards(AuthGuard)
  async get(@Auth() user: User): Promise<WebResponse<UserResponse>> {
    const res = await this.userService.get(user);
    return {
      data: res,
    };
  }

  @Patch('/current')
  @HttpCode(200)
  @UseGuards(AuthGuard)
  async update(
    @Auth() user: User,
    @Body() req: UpdateUserRequest,
  ): Promise<WebResponse<UserResponse>> {
    const res = await this.userService.update(user, req);
    return {
      data: res,
    };
  }

  @Delete('/current')
  @HttpCode(200)
  @UseGuards(AuthGuard)
  async logout(@Auth() user: User): Promise<WebResponse<boolean>> {
    await this.userService.logout(user);
    return {
      data: true,
    };
  }
}
