import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ContactService } from './contact.service';
import { Auth } from '../common/auth.decorator';
import { AuthGuard } from '../auth/auth.guard';
import type { User } from '@prisma/client';
import {
  ContactResponse,
  CreateContactRequest,
  UpdateContactRequest,
} from '../model/contact.model';
import { WebResponse } from '../model/web.model';

@UseGuards(AuthGuard)
@Controller('/api/contacts')
export class ContactController {
  constructor(private contactService: ContactService) {}

  @Post()
  @HttpCode(200)
  async create(
    @Auth() user: User,
    @Body() req: CreateContactRequest,
  ): Promise<WebResponse<ContactResponse>> {
    const res = await this.contactService.create(user, req);
    return {
      data: res,
    };
  }

  @Get('/:contactId')
  @HttpCode(200)
  async get(
    @Auth() user: User,
    @Param('contactId', ParseIntPipe) contactId: number,
  ): Promise<WebResponse<ContactResponse>> {
    const res = await this.contactService.get(user, contactId);
    return {
      data: res,
    };
  }

  @Put('/:contactId')
  @HttpCode(200)
  async update(
    @Auth() user: User,
    @Param('contactId', ParseIntPipe) contactId: number,
    @Body() req: UpdateContactRequest,
  ): Promise<WebResponse<ContactResponse>> {
    req.id = contactId;
    const res = await this.contactService.update(user, req);
    return {
      data: res,
    };
  }

  @Delete('/:contactId')
  @HttpCode(200)
  async remove(
    @Auth() user: User,
    @Param('contactId', ParseIntPipe) contactId: number,
  ): Promise<WebResponse<boolean>> {
    await this.contactService.remove(user, contactId);
    return {
      data: true,
    };
  }
}
