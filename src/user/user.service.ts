import { HttpException, Inject, Injectable } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { PrismaService } from '../common/prisma.service';
import { ValidationService } from '../common/validation.service';
import {
  LoginUserRequest,
  RegisterUserRequest,
  UpdateUserRequest,
  UserResponse,
} from '../model/user.model';
import { Logger } from 'winston';
import { UserValidation } from './user.validation';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(
    private validationService: ValidationService,
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
    private prismaService: PrismaService,
    private jwtService: JwtService,
  ) {}

  async register(req: RegisterUserRequest): Promise<UserResponse> {
    this.logger.debug(`Register new user ${JSON.stringify(req)}`);
    const registerRequest: RegisterUserRequest =
      this.validationService.validate(UserValidation.REGISTER, req);

    const totalUserWithSameUsername = await this.prismaService.user.count({
      where: {
        username: registerRequest.username,
      },
    });

    if (totalUserWithSameUsername != 0) {
      throw new HttpException('Username already exists', 400);
    }
    registerRequest.password = await bcrypt.hash(registerRequest.password, 10);

    const user = await this.prismaService.user.create({
      data: registerRequest,
    });

    return {
      username: user.username,
      name: user.name,
    };
  }

  async login(req: LoginUserRequest): Promise<UserResponse> {
    this.logger.debug(`UserService.login(${JSON.stringify(req)})`);
    const loginRequest: LoginUserRequest = this.validationService.validate(
      UserValidation.LOGIN,
      req,
    );

    let user = await this.prismaService.user.findUnique({
      where: {
        username: loginRequest.username,
      },
    });

    if (!user) {
      throw new HttpException('Username or password is invalid', 401);
    }

    const isPasswordValid = await bcrypt.compare(
      loginRequest.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new HttpException('Username or password is invalid', 401);
    }

    const payload = { username: user.username, name: user.name };
    const token = await this.jwtService.signAsync(payload);

    user = await this.prismaService.user.update({
      where: {
        username: loginRequest.username,
      },
      data: {
        token,
      },
    });

    return {
      username: user.username,
      name: user.name,
      token: user.token ?? undefined,
    };
  }

  async get(user: User): Promise<UserResponse> {
    return {
      username: user.username,
      name: user.name,
    };
  }

  async update(user: User, req: UpdateUserRequest): Promise<UserResponse> {
    this.logger.debug(
      `UserSerive.update(${JSON.stringify(user)}, ${JSON.stringify(req)})`,
    );

    const updateRequest: UpdateUserRequest = this.validationService.validate(
      UserValidation.UPDATE,
      req,
    );

    const updateData: { name?: string; password?: string } = {};

    if (updateRequest.name) {
      updateData.name = updateRequest.name;
    }
    if (updateRequest.password) {
      updateData.password = await bcrypt.hash(updateRequest.password, 10);
    }

    const res = await this.prismaService.user.update({
      where: {
        username: user.username,
      },
      data: updateData,
    });

    return {
      name: res.name,
      username: res.username,
    };
  }

  async logout(user: User): Promise<UserResponse> {
    const res = await this.prismaService.user.update({
      where: {
        username: user.username,
      },
      data: {
        token: null,
      },
    });

    return {
      username: res.username,
      name: res.name,
    };
  }
}
