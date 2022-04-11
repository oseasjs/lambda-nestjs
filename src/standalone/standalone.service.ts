import { Injectable, Logger } from '@nestjs/common'
import { S3Event } from 'aws-lambda'
import { EventService } from 'src/event/event.service'

@Injectable()
export class StandaloneService {
  private readonly logger = new Logger(StandaloneService.name)

  constructor(private readonly eventService: EventService) {}

  public async process(event: S3Event): Promise<string> {
    this.logger.log(`[Event] event: ${JSON.stringify(event)}`)
    return await this.eventService.process(event)
  }
}
