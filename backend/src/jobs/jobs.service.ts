import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JobStatus } from '@prisma/client';

@Injectable()
export class JobsService {
  constructor(private readonly prisma: PrismaService) {}

  async createJob(toolSlug: string, inputFile: string, userId?: string) {
    return this.prisma.job.create({
      data: {
        toolSlug,
        inputFile,
        userId,
        status: JobStatus.QUEUED,
        progress: 0,
      },
    });
  }

  async updateJobProgress(id: string, progress: number, status: JobStatus) {
    return this.prisma.job.update({
      where: { id },
      data: { progress, status },
    });
  }

  async completeJob(id: string, outputFile: string) {
    return this.prisma.job.update({
      where: { id },
      data: {
        status: JobStatus.COMPLETED,
        progress: 100,
        outputFile,
      },
    });
  }

  async failJob(id: string, error: string) {
    return this.prisma.job.update({
      where: { id },
      data: {
        status: JobStatus.FAILED,
        error,
      },
    });
  }

  async getJob(id: string) {
    const job = await this.prisma.job.findUnique({ where: { id } });
    if (!job) throw new NotFoundException('Job not found');
    return job;
  }
}
