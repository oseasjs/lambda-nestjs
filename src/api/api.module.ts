import { Module } from '@nestjs/common'
import { ApiController } from './api.controller'
import { ApiService } from './api.service'
import includes from 'lodash/includes'
import { ConfigModule } from '@nestjs/config'
import { EventModule } from 'src/event/event.module'
import { EventService } from 'src/event/event.service'
import { S3Service } from 'src/s3/s3.service'

@Module({
  imports: [
    ConfigModule.forRoot({
      ignoreEnvFile: includes(['local'], process.env.NODE_ENV),
      isGlobal: true
    }),
    S3Service,
    EventModule
  ],
  controllers: [ApiController],
  providers: [ApiService, EventService, S3Service]
})
export class ApiModule {}
