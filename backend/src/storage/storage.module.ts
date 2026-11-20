import { Module, Global } from '@nestjs/common';
import { LocalStorageService } from './local-storage/local-storage.service';
import { IStorageProvider } from './storage/storage.interface';

@Global()
@Module({
  providers: [
    {
      provide: IStorageProvider,
      useClass: LocalStorageService,
    },
  ],
  exports: [IStorageProvider],
})
export class StorageModule {}
