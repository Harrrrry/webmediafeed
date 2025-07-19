import { Controller, Post, Body } from '@nestjs/common';

@Controller('ai')
export class AiController {
  @Post('caption')
  generateCaption(@Body() dto: { mediaUrl: string }) {
    // Placeholder logic
    return { caption: 'Generated caption for ' + dto.mediaUrl };
  }

  @Post('face-detect')
  detectFaces(@Body() dto: { mediaUrl: string }) {
    // Placeholder logic
    return { faces: [] };
  }

  @Post('sentiment')
  analyzeSentiment(@Body() dto: { text: string }) {
    // Placeholder logic
    return { sentiment: 'neutral' };
  }
} 