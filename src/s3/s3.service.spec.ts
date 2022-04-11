import { S3Service } from './s3.service'
import { Test, TestingModule } from '@nestjs/testing'
import { S3EventRecord } from 'aws-lambda'
import { SOURCE_FOLDER, TARGET_FOLDER } from '../utils/constants'
import { ConfigModule } from '@nestjs/config'
import includes from 'lodash/includes'

jest.mock('aws-sdk', () => {
  return {
    S3: jest.fn().mockImplementation(() => ({
      copyObject: jest.fn().mockReturnValue({ promise: jest.fn() }),
      deleteObject: jest.fn().mockReturnValue({ promise: jest.fn() }),
    }))
  }
})

const eventRecord = {
  s3: {
    bucket: {
      name: 'bucketName'
    },
    object: {
      key: `${SOURCE_FOLDER}/file.json`
    }
  }
} as S3EventRecord

describe('S3Service', () => {
  let service: S3Service

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          ignoreEnvFile: includes(['local'], process.env.NODE_ENV),
          isGlobal: true
        }),
      ],
      providers: [S3Service],
    }).compile()

    service = module.get<S3Service>(S3Service)
  })

  describe('S3Service move file between in s3 bucket subfolders', () => {
    it('Move file from SOURCE folder to TARGET folder on S3 Bucket successfully', async () => {
      await expect(service.moveTo(TARGET_FOLDER, eventRecord)).resolves.not.toThrow()
    })
  })
})
