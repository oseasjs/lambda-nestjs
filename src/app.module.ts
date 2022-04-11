import { Module } from '@nestjs/common'
import { ApiController } from './api/api.controller'
import { ApiService } from './api/api.service'
import includes from 'lodash/includes'
import { ConfigModule } from '@nestjs/config'
import { ApiModule } from './api/api.module'
import { StandaloneModule } from './standalone/standalone.module'
import { StandaloneService } from './standalone/standalone.service'
import { S3Module } from './s3/s3.module'
import { EventModule } from './event/event.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      ignoreEnvFile: includes(['local'], process.env.NODE_ENV),
      isGlobal: true
    }),
    S3Module,
    EventModule,
    ApiModule,
    StandaloneModule
  ],
  controllers: [ApiController],
  providers: [ApiService, StandaloneService]
})
export class AppModule {}
