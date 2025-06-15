import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Player } from './player.schema';

@Injectable()
export class PlayerService {
  constructor(@InjectModel(Player.name) private playerModel: Model<Player>) {}

  async findByCode(code: string) {
    return this.playerModel.findOne({ code });
  }

  async createPlayer(code: string, nickname?: string, anonymous = false) {
    return this.playerModel.create({ code, nickname, anonymous });
  }
}
