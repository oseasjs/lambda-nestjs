import { Module } from '@nestjs/common'
import { StandaloneService } from './standalone.service'
import { EventService } from 'src/event/event.service'
import { EventModule } from 'src/event/event.module'
import { S3Module } from 'src/s3/s3.module'
import { S3Service } from 'src/s3/s3.service'

@Module({
  imports: [S3Module, EventModule],
  controllers: [],
  providers: [StandaloneService, EventService, S3Service]
})
export class StandaloneModule {}
