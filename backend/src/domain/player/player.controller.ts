import { Controller, Patch, Param, Body, NotFoundException } from '@nestjs/common';
import { PlayerService } from './player.service';

@Controller('players')
export class PlayerController {
  constructor(private readonly playerService: PlayerService) {}

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
}
