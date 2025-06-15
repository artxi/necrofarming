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

  async updatePlayer(id: string, update: Partial<Player>) {
    return this.playerModel.findByIdAndUpdate(id, update, { new: true });
  }

  async findById(id: string) {
    return this.playerModel.findById(id);
  }

  async aggregatePicks() {
    // Aggregate picks by employee and cause
    const players = await this.playerModel.find({}, { picks: 1, nickname: 1, anonymous: 1 }).lean();
    const aggregation: Record<string, { employee: string, count: number, voluntary: number, fired: number, pickers: string[] }> = {};
    for (const player of players) {
      for (const pick of player.picks || []) {
        if (!pick.employee) continue;
        const key = pick.employee.toString();
        if (!aggregation[key]) {
          aggregation[key] = { employee: key, count: 0, voluntary: 0, fired: 0, pickers: [] };
        }
        aggregation[key].count++;
        aggregation[key][pick.cause]++;
        if (!player.anonymous && player.nickname) {
          aggregation[key].pickers.push(player.nickname);
        }
      }
    }
    return Object.values(aggregation);
  }
}
