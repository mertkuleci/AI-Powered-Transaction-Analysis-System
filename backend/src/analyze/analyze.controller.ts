import {
  Controller,
  Get,
  Post,
  Body,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AnalyzeService } from './analyze.service';
import { TransactionDto } from './dtos/transaction.dto';
import { TransactionsDto } from './dtos/transactions.dto';
import { Express } from 'express';

@Controller('api/analyze')
export class AnalyzeController {
  constructor(private readonly analyzeService: AnalyzeService) {}

  // Single transaction merchant normalization
  @Post('merchant')
  normalizeMerchant(@Body() transaction: TransactionDto) {
    const normalized = this.analyzeService.normalizeMerchant(transaction);
    return { normalized };
  }

  // Multiple transactions pattern detection
  @Post('patterns')
  detectPatterns(@Body() body: TransactionsDto) {
    const patterns = this.analyzeService.detectPatterns(body.transactions);
    return { patterns };
  }

  // CSV upload -> parse -> analyze
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  handleFileUpload(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No file uploaded!');
    }

    try {
      const csvData = file.buffer.toString('utf-8');
      const lines = csvData.split('\n').filter((line) => line.trim());
      const transactions: TransactionDto[] = [];

      for (const line of lines) {
        const [date, description, amountStr] = line.split(',');
        if (!date || !description || !amountStr) {
          continue; // skip malformed lines
        }
        transactions.push({
          date: date.trim(),
          description: description.trim(),
          amount: parseFloat(amountStr.trim()),
        });
      }

      return this.analyzeService.analyzeTransactions(transactions);
    } catch (error) {
      throw new BadRequestException('Invalid CSV format!');
    }
  }
}
