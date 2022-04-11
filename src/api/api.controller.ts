import { Body, Controller, Get, Post, Query } from '@nestjs/common'
import { ApiService } from './api.service'

@Controller('/api')
export class ApiController {
  constructor(private readonly apiService: ApiService) {}

  @Get()
  public async get(@Query() query: any = {}): Promise<string> {
    return await this.apiService.get(query)
  }
  @Post()
  public async post(@Body() body: any): Promise<string> {
    return await this.apiService.post(body)
  }
}
