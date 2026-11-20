import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { AuthController } from './auth.controller';
import { UsersService } from './users.service';
import { AdminModule } from './admin/admin.module';
import { StorageModule } from './storage/storage.module';
import { FilesModule } from './files/files.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { JobsModule } from './jobs/jobs.module';
import { ToolsModule } from './tools/tools.module';
import { BlogsModule } from './blogs/blogs.module';

@Module({
  imports: [
    AuthModule, 
    UsersModule, 
    AdminModule, 
    StorageModule, 
    FilesModule,
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), 'uploads'),
      serveRoot: '/uploads',
    }),
    JobsModule,
    ToolsModule,
    BlogsModule,
  ],
  controllers: [AppController, AuthController],
  providers: [AppService, UsersService],
})
export class AppModule {}
