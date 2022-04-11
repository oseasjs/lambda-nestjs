import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { S3Module } from '../s3/s3.module'
import { EventService } from './event.service'
import includes from 'lodash/includes'

@Module({
  imports: [
    ConfigModule.forRoot({
      ignoreEnvFile: includes(['local'], process.env.NODE_ENV),
      isGlobal: true
    }),
    S3Module
  ],
  providers: [EventService],
  exports: [EventService]
})
export class EventModule {}
