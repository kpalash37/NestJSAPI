import { Injectable } from "@nestjs/common";

@Injectable()
export class AppService {
  getHello(): string {
    return "Greate News Application Connected Successfully!";
  }
}
