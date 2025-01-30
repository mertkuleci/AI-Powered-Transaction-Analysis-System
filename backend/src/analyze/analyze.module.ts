
import { Module } from '@nestjs/common';
import { AnalyzeController } from './analyze.controller';
import { AnalyzeService } from './analyze.service';
import { LocalMerchantService } from './merchant.service';
import { PatternService } from './pattern.service';

@Module({
  controllers: [AnalyzeController],
  providers: [AnalyzeService, LocalMerchantService, PatternService],
  exports: [AnalyzeService],
})
export class AnalyzeModule {}
