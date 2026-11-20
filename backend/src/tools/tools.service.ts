import { Injectable, BadRequestException } from '@nestjs/common';
import { JobsService } from '../jobs/jobs.service';
import { PDFDocument } from 'pdf-lib';
import * as fs from 'fs';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { JobStatus } from '@prisma/client';
import sharp from 'sharp';
import * as ffmpegStaticTypes from 'fluent-ffmpeg';
const ffmpeg = require('fluent-ffmpeg');
const ffmpegStatic = require('ffmpeg-static');
ffmpeg.setFfmpegPath(ffmpegStatic);
@Injectable()
export class ToolsService {
  constructor(private readonly jobsService: JobsService) {}

  async processTool(toolSlug: string, filePaths: string[], config?: any, userId?: string) {
    if (toolSlug === 'merge-pdf') {
      return this.handleMergePdf(filePaths, userId);
    }
    
    if (toolSlug === 'split-pdf') {
      return this.handleSplitPdf(filePaths, userId);
    }
    
    if (toolSlug === 'image-resize') {
      return this.handleImageResize(filePaths, config, userId);
    }

    if (toolSlug === 'image-convert') {
      return this.handleImageConvert(filePaths, config, userId);
    }

    if (toolSlug === 'video-to-audio') {
      return this.handleVideoToAudio(filePaths, userId);
    }
    
    throw new BadRequestException(`Tool ${toolSlug} not supported`);
  }

  private async handleMergePdf(filePaths: string[], userId?: string) {
    if (filePaths.length < 2) {
      throw new BadRequestException('At least two files are required for merge');
    }

    const inputFilesJoined = filePaths.join(',');
    const job = await this.jobsService.createJob('merge-pdf', inputFilesJoined, userId);

    this.executeMergePdf(job.id, filePaths).catch(err => {
      console.error(`Job ${job.id} failed:`, err);
    });

    return { jobId: job.id, message: 'Job started' };
  }

  private async executeMergePdf(jobId: string, filePaths: string[]) {
    try {
      await this.jobsService.updateJobProgress(jobId, 10, JobStatus.PROCESSING);

      const mergedPdf = await PDFDocument.create();
      const uploadDir = path.join(process.cwd(), 'uploads');
      
      let progress = 10;
      const progressStep = 70 / filePaths.length;

      for (const relativePath of filePaths) {
        const fullPath = path.join(uploadDir, relativePath);
        if (!fs.existsSync(fullPath)) throw new Error(`File not found: ${relativePath}`);

        const pdfBytes = fs.readFileSync(fullPath);
        const pdf = await PDFDocument.load(pdfBytes);
        const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
        copiedPages.forEach((page) => mergedPdf.addPage(page));
        
        progress += progressStep;
        await this.jobsService.updateJobProgress(jobId, Math.round(progress), JobStatus.PROCESSING);
      }

      await this.jobsService.updateJobProgress(jobId, 90, JobStatus.PROCESSING);
      
      const mergedPdfBytes = await mergedPdf.save();
      
      const outputFilename = `merged_${uuidv4()}.pdf`;
      const outputDir = path.join(uploadDir, 'processed');
      if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });
      
      const outputPath = path.join(outputDir, outputFilename);
      fs.writeFileSync(outputPath, mergedPdfBytes);
      
      const relativeOutputPath = `uploads/processed/${outputFilename}`;
      await this.jobsService.completeJob(jobId, relativeOutputPath);
      
    } catch (error: any) {
      await this.jobsService.failJob(jobId, error.message || 'Unknown error during merge');
    }
  }

  private async handleImageResize(filePaths: string[], config: any, userId?: string) {
    if (filePaths.length !== 1) throw new BadRequestException('Only one file supported for resize currently');
    if (!config?.width && !config?.height) throw new BadRequestException('Width or height is required');

    const job = await this.jobsService.createJob('image-resize', filePaths[0], userId);

    this.executeImageResize(job.id, filePaths[0], config).catch(err => {
      console.error(`Job ${job.id} failed:`, err);
    });

    return { jobId: job.id, message: 'Job started' };
  }

  private async executeImageResize(jobId: string, filePath: string, config: any) {
    try {
      await this.jobsService.updateJobProgress(jobId, 10, JobStatus.PROCESSING);

      const uploadDir = path.join(process.cwd(), 'uploads');
      const fullPath = path.join(uploadDir, filePath);
      
      if (!fs.existsSync(fullPath)) throw new Error(`File not found: ${filePath}`);

      const ext = path.extname(filePath);
      const outputFilename = `resized_${uuidv4()}${ext}`;
      const outputDir = path.join(uploadDir, 'processed');
      if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });
      
      const outputPath = path.join(outputDir, outputFilename);

      await this.jobsService.updateJobProgress(jobId, 50, JobStatus.PROCESSING);

      const width = config.width ? parseInt(config.width, 10) : undefined;
      const height = config.height ? parseInt(config.height, 10) : undefined;

      await sharp(fullPath)
        .resize({ width, height, fit: 'inside' })
        .toFile(outputPath);

      await this.jobsService.updateJobProgress(jobId, 90, JobStatus.PROCESSING);
      
      const relativeOutputPath = `uploads/processed/${outputFilename}`;
      await this.jobsService.completeJob(jobId, relativeOutputPath);
    } catch (error: any) {
      await this.jobsService.failJob(jobId, error.message || 'Unknown error during resize');
    }
  }

  private async handleImageConvert(filePaths: string[], config: any, userId?: string) {
    if (filePaths.length !== 1) throw new BadRequestException('Only one file supported for convert currently');
    if (!config?.format) throw new BadRequestException('Format is required');

    const job = await this.jobsService.createJob('image-convert', filePaths[0], userId);

    this.executeImageConvert(job.id, filePaths[0], config).catch(err => {
      console.error(`Job ${job.id} failed:`, err);
    });

    return { jobId: job.id, message: 'Job started' };
  }

  private async executeImageConvert(jobId: string, filePath: string, config: any) {
    try {
      await this.jobsService.updateJobProgress(jobId, 10, JobStatus.PROCESSING);

      const uploadDir = path.join(process.cwd(), 'uploads');
      const fullPath = path.join(uploadDir, filePath);
      
      if (!fs.existsSync(fullPath)) throw new Error(`File not found: ${filePath}`);

      const format = config.format.toLowerCase();
      const validFormats = ['jpeg', 'jpg', 'png', 'webp', 'avif', 'tiff'];
      if (!validFormats.includes(format)) throw new Error(`Unsupported format: ${format}`);

      const outputFilename = `converted_${uuidv4()}.${format === 'jpg' ? 'jpeg' : format}`;
      const outputDir = path.join(uploadDir, 'processed');
      if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });
      
      const outputPath = path.join(outputDir, outputFilename);

      await this.jobsService.updateJobProgress(jobId, 50, JobStatus.PROCESSING);

      await sharp(fullPath)
        .toFormat(format === 'jpg' ? 'jpeg' : format, { quality: 80 })
        .toFile(outputPath);

      await this.jobsService.updateJobProgress(jobId, 90, JobStatus.PROCESSING);
      
      const relativeOutputPath = `uploads/processed/${outputFilename}`;
      await this.jobsService.completeJob(jobId, relativeOutputPath);
    } catch (error: any) {
      await this.jobsService.failJob(jobId, error.message || 'Unknown error during conversion');
    }
  }

  private async handleSplitPdf(filePaths: string[], userId?: string) {
    if (filePaths.length !== 1) {
      throw new BadRequestException('Only one file can be split at a time');
    }

    const job = await this.jobsService.createJob('split-pdf', filePaths[0], userId);

    this.executeSplitPdf(job.id, filePaths[0]).catch(err => {
      console.error(`Job ${job.id} failed:`, err);
    });

    return { jobId: job.id, message: 'Job started' };
  }

  private async executeSplitPdf(jobId: string, filePath: string) {
    try {
      await this.jobsService.updateJobProgress(jobId, 10, JobStatus.PROCESSING);

      const uploadDir = path.join(process.cwd(), 'uploads');
      const fullPath = path.join(uploadDir, filePath);
      
      if (!fs.existsSync(fullPath)) throw new Error(`File not found: ${filePath}`);

      const pdfBytes = fs.readFileSync(fullPath);
      const pdf = await PDFDocument.load(pdfBytes);
      const pageCount = pdf.getPageCount();
      
      if (pageCount < 2) {
        throw new Error('PDF has only one page, cannot split');
      }

      await this.jobsService.updateJobProgress(jobId, 30, JobStatus.PROCESSING);
      
      const newPdf = await PDFDocument.create();
      const [copiedPage] = await newPdf.copyPages(pdf, [0]); // copy first page
      newPdf.addPage(copiedPage);

      await this.jobsService.updateJobProgress(jobId, 80, JobStatus.PROCESSING);
      
      const newPdfBytes = await newPdf.save();
      
      const outputFilename = `split_${uuidv4()}.pdf`;
      const outputDir = path.join(uploadDir, 'processed');
      if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });
      
      const outputPath = path.join(outputDir, outputFilename);
      fs.writeFileSync(outputPath, newPdfBytes);
      
      await this.jobsService.updateJobProgress(jobId, 90, JobStatus.PROCESSING);
      
      const relativeOutputPath = `uploads/processed/${outputFilename}`;
      await this.jobsService.completeJob(jobId, relativeOutputPath);
      
    } catch (error: any) {
      await this.jobsService.failJob(jobId, error.message || 'Unknown error during split');
    }
  }

  private async handleVideoToAudio(filePaths: string[], userId?: string) {
    if (filePaths.length !== 1) throw new BadRequestException('Only one file supported for video to audio');

    const job = await this.jobsService.createJob('video-to-audio', filePaths[0], userId);

    this.executeVideoToAudio(job.id, filePaths[0]).catch(err => {
      console.error(`Job ${job.id} failed:`, err);
    });

    return { jobId: job.id, message: 'Job started' };
  }

  private async executeVideoToAudio(jobId: string, filePath: string) {
    try {
      await this.jobsService.updateJobProgress(jobId, 5, JobStatus.PROCESSING);

      const uploadDir = path.join(process.cwd(), 'uploads');
      const fullPath = path.join(uploadDir, filePath);
      
      if (!fs.existsSync(fullPath)) throw new Error(`File not found: ${filePath}`);

      const outputFilename = `audio_${uuidv4()}.mp3`;
      const outputDir = path.join(uploadDir, 'processed');
      if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });
      
      const outputPath = path.join(outputDir, outputFilename);

      return new Promise<void>((resolve, reject) => {
        ffmpeg(fullPath)
          .toFormat('mp3')
          .on('progress', async (progress: any) => {
            // progress.percent can be undefined
            if (progress.percent) {
              // Map 0-100 to 5-90 for job progress
              const jobProgress = Math.floor(5 + (progress.percent * 0.85));
              // don't await to avoid blocking FFmpeg
              this.jobsService.updateJobProgress(jobId, jobProgress, JobStatus.PROCESSING).catch(() => {});
            }
          })
          .on('end', async () => {
            try {
              const relativeOutputPath = `uploads/processed/${outputFilename}`;
              await this.jobsService.completeJob(jobId, relativeOutputPath);
              resolve();
            } catch (err) {
              reject(err);
            }
          })
          .on('error', async (err: any) => {
            try {
              await this.jobsService.failJob(jobId, err.message || 'Error processing video');
              reject(err);
            } catch (e) {
              reject(e);
            }
          })
          .save(outputPath);
      });
      
    } catch (error: any) {
      await this.jobsService.failJob(jobId, error.message || 'Unknown error during conversion');
    }
  }
}
