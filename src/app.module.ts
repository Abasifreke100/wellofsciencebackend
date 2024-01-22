import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModule } from '@nestjs/schedule';
import { AppService } from './app.service';
import { environment } from './common/config/environment';
import { AuthModule } from './module/v1/auth/auth.module';
import { UserModule } from './module/v1/user/user.module';
import { ThrottlerModule } from '@nestjs/throttler';
import { SpacesModule } from './module/v1/spaces/spaces.module';
import { PostModule } from './module/v1/post/post.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ThrottlerModule.forRoot({
      ttl: 5,
      limit: 1,
    }),
    ScheduleModule.forRoot(),
    MongooseModule.forRootAsync({
      useFactory: async () => ({
        uri: environment.DB.URL,
        keepAlive: true,
      }),
      inject: [ConfigService],
    }),
    UserModule,
    AuthModule,
    SpacesModule,
    PostModule,
  ],
  controllers: [],
  providers: [AppService],
})
export class AppModule {}
