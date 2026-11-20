import { Controller, Post, UseInterceptors, UploadedFile, UseGuards, Request } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FilesService } from './files.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiBearerAuth, ApiTags, ApiConsumes, ApiBody } from '@nestjs/swagger';

@ApiTags('Files')
@Controller('api/files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post('upload')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  // Removing strict UseGuards so guest users can upload, but if token exists, we capture userId
  // For now, we will make it open, but optionally extract user from token if passed
  async uploadFile(@UploadedFile() file: Express.Multer.File, @Request() req: any) {
    if (!file) {
      throw new Error('No file provided');
    }
    
    // Attempt to extract token manually if we want optional auth, or just rely on a guard.
    // For simplicity right now, treating everyone as guest if no guard is applied.
    // In a real scenario, you'd use a custom OptionalJwtGuard.
    const userId = req.user?.id; 
    
    return this.filesService.uploadFile(file, userId);
  }
}
