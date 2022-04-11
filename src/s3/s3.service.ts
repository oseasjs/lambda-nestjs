import { Injectable, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { S3EventRecord } from 'aws-lambda'
import { S3 } from 'aws-sdk'
import { SOURCE_FOLDER } from '../utils/constants'

@Injectable()
export class S3Service {
  private readonly logger = new Logger(S3Service.name)
  private s3: S3 = new S3()

  constructor(private readonly configService: ConfigService) {}

  public async moveTo(folder: string, eventRecord: S3EventRecord): Promise<void> {
    this.logger.debug(`S3_ENABLED: ${this.isS3Enabled()}`)
    if (!this.isS3Enabled()) return

    const Bucket = eventRecord.s3.bucket.name
    const Key = decodeURIComponent(eventRecord.s3.object.key)

    const source = encodeURI(`${Bucket}/${Key}`)
    const target = Key.replace(SOURCE_FOLDER, folder)

    await this.s3
      .copyObject({
        Bucket,
        CopySource: source,
        Key: target,
        ACL: 'bucket-owner-full-control'
      })
      .promise()

    await this.s3.deleteObject({ Bucket, Key }).promise()
    this.logger.debug(`[S3Bucket] Moved from '${source}' to '${target}' successfully.`)
  }

  private isS3Enabled(): boolean {
    return this.configService.get('S3_ENABLED') === 'true'
  }
}
