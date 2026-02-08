import { HttpException, Inject, Injectable } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { PrismaService } from '../common/prisma.service';
import { Contact, User } from '@prisma/client';
import {
  ContactResponse,
  CreateContactRequest,
  UpdateContactRequest,
} from '../model/contact.model';
import { ValidationService } from '../common/validation.service';
import { ContactValidation } from './contact.validation';

@Injectable()
export class ContactService {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
    private prismaService: PrismaService,
    private validationService: ValidationService,
  ) {}

  toContactResponse(contact: Contact): ContactResponse {
    return {
      id: contact.id,
      first_name: contact.first_name,
      last_name: contact.last_name ?? undefined,
      email: contact.email ?? undefined,
      phone: contact.phone ?? undefined,
    };
  }

  async create(
    user: User,
    req: CreateContactRequest,
  ): Promise<ContactResponse> {
    this.logger.debug(
      `ContactService.create(${JSON.stringify(user)}, ${JSON.stringify(req)})`,
    );
    const createRequest: CreateContactRequest = this.validationService.validate(
      ContactValidation.CREATE,
      req,
    );

    const contact = await this.prismaService.contact.create({
      data: {
        ...createRequest,
        ...{ username: user.username },
      },
    });

    return this.toContactResponse(contact);
  }

  async get(user: User, contactId: number): Promise<ContactResponse> {
    this.logger.debug(
      `ContactService.create(${JSON.stringify(user)}, ${JSON.stringify(contactId)})`,
    );
    const contact = await this.checkContactMustExists(user.username, contactId);

    return this.toContactResponse(contact);
  }

  async checkContactMustExists(
    username: string,
    contactId: number,
  ): Promise<Contact> {
    const contact = await this.prismaService.contact.findFirst({
      where: {
        username,
        id: contactId,
      },
    });

    if (!contact) {
      throw new HttpException('Contact is not found', 404);
    }

    return contact;
  }

  async update(
    user: User,
    req: UpdateContactRequest,
  ): Promise<ContactResponse> {
    this.logger.debug(
      `ContactService.create(${JSON.stringify(user)}, ${JSON.stringify(req)})`,
    );
    const updateRequest = this.validationService.validate(
      ContactValidation.UPDATE,
      req,
    );
    let contact = await this.checkContactMustExists(
      user.username,
      updateRequest.id,
    );

    contact = await this.prismaService.contact.update({
      where: {
        id: contact.id,
        username: contact.username,
      },
      data: updateRequest,
    });

    return this.toContactResponse(contact);
  }

  async remove(user: User, contactId: number): Promise<ContactResponse> {
    await this.checkContactMustExists(user.username, contactId);

    const contact = await this.prismaService.contact.delete({
      where: {
        id: contactId,
        username: user.username,
      },
    });

    return this.toContactResponse(contact);
  }
}
