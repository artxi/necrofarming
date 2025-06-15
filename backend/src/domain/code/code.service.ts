import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Code } from './code.schema';

@Injectable()
export class CodeService {
  constructor(@InjectModel(Code.name) private codeModel: Model<Code>) {}

  async findByCode(code: string) {
    return this.codeModel.findOne({ code });
  }

  async markUsed(code: string, playerId: string) {
    return this.codeModel.findOneAndUpdate(
      { code },
      { used: true, usedBy: playerId, usedAt: new Date() },
      { new: true }
    );
  }
}
