import { Controller, Patch, Param, Body, NotFoundException, Get, Post } from '@nestjs/common';
import { PlayerService } from './player.service';

@Controller('players')
export class PlayerController {
  constructor(private readonly playerService: PlayerService) {}

  @Get(':id/picks')
  async getPicks(@Param('id') id: string) {
    const player = await this.playerService.findById(id);
    if (!player) throw new NotFoundException('Player not found');
    return {
      picks: player.picks || [],
      picksLockedAt: player.picksLockedAt || null,
    };
  }

  @Patch(':id/picks')
  async updatePicks(
    @Param('id') id: string,
    @Body() picks: any[],
  ) {
    // Only allow update if not locked
    const player = await this.playerService.findById(id);
    if (!player) throw new NotFoundException('Player not found');
    if (player.picksLockedAt) throw new NotFoundException('Picks are locked');
    player.picks = picks;
    await player.save();
    return player.picks;
  }

  @Post(':id/picks/lock')
  async lockPicks(@Param('id') id: string) {
    const player = await this.playerService.findById(id);
    if (!player) throw new NotFoundException('Player not found');
    if (player.picksLockedAt) return { picksLockedAt: player.picksLockedAt };
    player.picksLockedAt = new Date();
    await player.save();
    return { picksLockedAt: player.picksLockedAt };
  }

  @Patch(':id')
  async updatePlayer(
    @Param('id') id: string,
    @Body() body: { nickname?: string; anonymous?: boolean },
  ) {
    const update: any = {};
    if (body.anonymous !== undefined) update.anonymous = body.anonymous;
    if (body.nickname !== undefined && !body.anonymous) update.nickname = body.nickname;
    const player = await this.playerService.updatePlayer(id, update);
    if (!player) throw new NotFoundException('Player not found');
    return player;
  }

  @Get('aggregated-picks')
  async getAggregatedPicks() {
    return this.playerService.aggregatePicks();
  }
}
