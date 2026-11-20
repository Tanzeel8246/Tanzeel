import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { IStorageProvider } from '../storage/storage.interface';
import * as fs from 'fs';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class LocalStorageService implements IStorageProvider {
  private readonly uploadDir = path.join(process.cwd(), 'uploads');

  constructor() {
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
    }
  }

  async uploadFile(file: Express.Multer.File, directory: string = ''): Promise<string> {
    try {
      const targetDir = path.join(this.uploadDir, directory);
      if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, { recursive: true });
      }

      const uniqueFilename = `${uuidv4()}${path.extname(file.originalname)}`;
      const filePath = path.join(targetDir, uniqueFilename);
      
      fs.writeFileSync(filePath, file.buffer);
      
      // Return relative path to be stored in DB
      return path.join(directory, uniqueFilename).replace(/\\/g, '/');
    } catch (error) {
      throw new InternalServerErrorException('Error saving file locally');
    }
  }

  async deleteFile(filePath: string): Promise<void> {
    try {
      const fullPath = path.join(this.uploadDir, filePath);
      if (fs.existsSync(fullPath)) {
        fs.unlinkSync(fullPath);
      }
    } catch (error) {
      console.error(`Failed to delete file: ${filePath}`, error);
    }
  }

  getFileUrl(filePath: string): string {
    return `/uploads/${filePath}`;
  }
}
