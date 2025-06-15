import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Code, CodeSchema } from './code.schema';
import { CodeService } from './code.service';
import { CodeController } from './code.controller';
import { PlayerModule } from '../player/player.module';

@Module({
  imports: [MongooseModule.forFeature([{ name: Code.name, schema: CodeSchema }]), PlayerModule],
  providers: [CodeService],
  controllers: [CodeController],
  exports: [MongooseModule],
})
export class CodeModule {}