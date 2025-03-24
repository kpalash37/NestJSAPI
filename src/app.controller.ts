import { Controller, Get } from "@nestjs/common";
import { AppService } from "./app.service";
import { ApiOperation, ApiTags } from "@nestjs/swagger";

@ApiTags('App Testing')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  
  @Get()
  @ApiOperation({ summary: "Application Testing Purpose!" })
  getHello(): string {
    return this.appService.getHello();
  }
}
