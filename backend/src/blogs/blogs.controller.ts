import { Controller, Get, Param, Post, Body, Request, UseGuards } from '@nestjs/common';
import { BlogsService } from './blogs.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('api/blogs')
export class BlogsController {
  constructor(private readonly blogsService: BlogsService) {}

  @Get()
  async getBlogs() {
    return this.blogsService.getAllBlogs();
  }

  @Get(':slug')
  async getBlog(@Param('slug') slug: string) {
    return this.blogsService.getBlogBySlug(slug);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async createBlog(@Body() data: any, @Request() req: any) {
    return this.blogsService.createBlog(data, req.user?.id);
  }
}
