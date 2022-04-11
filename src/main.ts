import { HttpStatus } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import serverlessExpress from '@vendia/serverless-express'
import { Callback, Context, Handler, S3Event } from 'aws-lambda'
import { AppModule } from './app.module'
import { StandaloneService } from './standalone/standalone.service'

let server: Handler

async function bootstrap(): Promise<Handler> {
  const app = await NestFactory.create(AppModule)
  await app.init()

  const expressApp = app.getHttpAdapter().getInstance()
  return serverlessExpress({ app: expressApp })
}

export const api: Handler = async (event: S3Event, context: Context, callback: Callback) => {
  server = server ?? (await bootstrap())
  return server(event, context, callback)
}

export const standalone: Handler = async (event: S3Event) => {
  const context = await NestFactory.createApplicationContext(AppModule)
  const service = context.get(StandaloneService)
  const message = await service.process(event)
  return {
    body: message,
    statusCode: HttpStatus.OK
  }
}
