import { Controller, Post, Param, Body, Request } from '@nestjs/common';
import { ToolsService } from './tools.service';

@Controller('api/tools')
export class ToolsController {
  constructor(private readonly toolsService: ToolsService) {}

  @Post(':slug/process')
  async processTool(
    @Param('slug') slug: string,
    @Body('files') files: string[],
    @Body('config') config: any,
    @Request() req: any
  ) {
    const userId = req.user?.id; // Optional
    return this.toolsService.processTool(slug, files, config, userId);
  }
}
