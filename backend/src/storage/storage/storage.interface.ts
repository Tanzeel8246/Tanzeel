export const IStorageProvider = Symbol('IStorageProvider');

export interface IStorageProvider {
  uploadFile(file: Express.Multer.File, directory?: string): Promise<string>;
  deleteFile(path: string): Promise<void>;
  getFileUrl(path: string): string;
}
