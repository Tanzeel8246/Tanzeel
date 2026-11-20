import { Injectable, Inject } from '@nestjs/common';
import { IStorageProvider } from '../storage/storage/storage.interface';

@Injectable()
export class FilesService {
  constructor(
    @Inject(IStorageProvider) private readonly storageProvider: IStorageProvider
  ) {}

  async uploadFile(file: Express.Multer.File, userId?: string) {
    // Optionally create a directory based on user ID or date
    const directory = userId ? `user_${userId}` : 'guest';
    const filePath = await this.storageProvider.uploadFile(file, directory);
    const url = this.storageProvider.getFileUrl(filePath);
    
    return {
      message: 'File uploaded successfully',
      path: filePath,
      url,
      size: file.size,
      mimetype: file.mimetype
    };
  }
}
