import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class BlogsService {
  constructor(private readonly prisma: PrismaService) {}

  async getAllBlogs(includeUnpublished = false) {
    return this.prisma.blog.findMany({
      where: includeUnpublished ? {} : { published: true },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
        thumbnail: true,
        published: true,
        createdAt: true,
      }
    });
  }

  async getBlogBySlug(slug: string) {
    const blog = await this.prisma.blog.findUnique({
      where: { slug },
    });

    if (!blog) throw new NotFoundException('Blog not found');
    return blog;
  }

  async createBlog(data: any, authorId?: string) {
    return this.prisma.blog.create({
      data: {
        ...data,
        authorId,
      }
    });
  }
}
