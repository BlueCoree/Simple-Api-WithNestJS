import { Module } from '@nestjs/common';
import { CommonModule } from './common/common.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ContactModule } from './contact/contact.module';

@Module({
  imports: [AuthModule, CommonModule, UserModule, ContactModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
