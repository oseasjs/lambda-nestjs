import { Injectable, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { EventService } from 'src/event/event.service'

@Injectable()
export class ApiService {
  private readonly logger = new Logger(ApiService.name)

  constructor(private readonly configService: ConfigService, private readonly eventService: EventService) {}

  public async get(param: any): Promise<string> {
    this.logger.log(`[GET] param: ${JSON.stringify(param)}`)
    this.logger.debug(`S3_ENABLED: ${this.configService.get('S3_ENABLED')}`)

    return await this.configService.get('SUCCESS_HTTP_GET_MESSAGE')
  }
  public async post(event: any): Promise<string> {
    this.logger.log(`[POST] body: ${JSON.stringify(event)}`)
    return await this.eventService.process(event)
  }
}
