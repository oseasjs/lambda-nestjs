import { S3Event } from 'aws-lambda'
import { EventService } from './event.service'
import { Test, TestingModule } from '@nestjs/testing'
import includes from 'lodash/includes'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { S3Service } from '../s3/s3.service'

jest.mock('axios')

jest.mock('aws-sdk', () => {
  return {
    S3: jest.fn().mockImplementation(() => ({
      copyObject: jest.fn().mockReturnValue({ promise: jest.fn() }),
      deleteObject: jest.fn().mockReturnValue({ promise: jest.fn() }),
    }))
  }
})

const fileName = 'file.json'
const filePath = 'source/sub-folder/'

describe('EventService', () => {
  let service: EventService
  let configService: ConfigService

  const s3Event = {
    Records: [
      {
        s3: {
          bucket: {
            name: 'bucketName'
          },
          object: {
            key: filePath + fileName
          }
        }
      }
    ]
  } as S3Event

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          ignoreEnvFile: includes(['local'], process.env.NODE_ENV),
          isGlobal: true
        }),
      ],
      providers: [EventService, S3Service],
    }).compile()

    service = module.get<EventService>(EventService)
    configService = module.get<ConfigService>(ConfigService)
  })

  describe('Event Process Successfully', () => {
    it('should return an success message for s3 request payload', async () => {
      expect(await service.process(s3Event)).toEqual(configService.get('EVENT_PROCESS_SUCCESS_MESSAGE'))
    })
    it('should return an success message for POST request payload', async () => {
      const postBody = {
        body: JSON.stringify({
          ...s3Event
        })
      } as any
      expect(await service.process(postBody)).toEqual(configService.get('EVENT_PROCESS_SUCCESS_MESSAGE'))
    })
  })
})
