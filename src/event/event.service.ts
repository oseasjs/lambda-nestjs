import { Injectable, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { S3Event } from 'aws-lambda'
import { S3Service } from '../s3/s3.service'
import { REJECTED_FOLDER, TARGET_FOLDER } from '../utils/constants'

@Injectable()
export class EventService {
  private readonly logger = new Logger(EventService.name)

  constructor(private readonly s3Service: S3Service, private readonly configService: ConfigService) {}

  public async process(event: S3Event & { body?: any }): Promise<string> {
    const { Records } = event.body ? JSON.parse(event.body) : event
    this.logger.debug(`Event Records Length: ${JSON.stringify(Records.length)}`)

    for (const record of Records) {
      const objectKey = record.s3.object.key
      this.logger.debug(`objectKey: `, objectKey)

      try {
        // Validation example that move the file to rejected folder
        if (record.s3.object.size === 0) throw new Error('File is empty')
        await this.s3Service.moveTo(TARGET_FOLDER, record)
      } catch (err) {
        this.logger.error(`Failed on processing '${objectKey}' with error: ${err.message}`, err.stack)
        await this.s3Service.moveTo(REJECTED_FOLDER, record)
      }
    }

    return this.configService.get('EVENT_PROCESS_SUCCESS_MESSAGE')
  }
}
