import { Module } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from './../config';
import { AuthModule } from './../auth';
import { MailerModule } from '@nestjs-modules/mailer';
import { CustomerModule } from 'modules/customer';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          type: configService.get('DB_TYPE'),
          host: configService.get('DB_HOST'),
          port: configService.get('DB_PORT'),
          username: configService.get('DB_USERNAME'),
          password: configService.get('DB_PASSWORD'),
          database: configService.get('DB_DATABASE'),
          entities: [__dirname + './../**/**.entity{.ts,.js}'],
          synchronize: configService.isEnv('dev'),
        } as TypeOrmModuleAsyncOptions;
      },
    }),
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          transport: {
            host: configService.get('SMTP_HOST'),
            port: configService.get('SMTP_PORT'),
            secure: false,
            auth: {
              user: configService.get('SMTP_USERNAME'),
              pass: configService.get('SMTP_PASS')
            },
          },
          defaults: {
            from:configService.get('SMTP_USERNAME')
          }
        }
      }
    }),
    ConfigModule,
    AuthModule,
    CustomerModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
