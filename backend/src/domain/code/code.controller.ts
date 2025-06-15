import { Controller, Post, Body, BadRequestException, Param } from '@nestjs/common';
import { CodeService } from './code.service';
import { PlayerService } from '../player/player.service';

@Controller('codes')
export class CodeController {
  constructor(
    private readonly codeService: CodeService,
    private readonly playerService: PlayerService,
  ) {}

  @Post(':code/claim')
  async claimCode(
    @Param('code') code: string,
    @Body() body: { nickname?: string; anonymous?: boolean },
  ) {
    const { nickname, anonymous } = body;
    const codeDoc = await this.codeService.findByCode(code);
    if (!codeDoc) throw new BadRequestException('Invalid code');
    if (codeDoc.used) {
      const player = await this.playerService.findByCode(code);
      if (!player) throw new BadRequestException('Code used but player not found');
      return { player, alreadyUsed: true };
    }
    if (nickname === undefined && anonymous === undefined) {
      return { alreadyUsed: false };
    }
    const player = await this.playerService.createPlayer(code, nickname, anonymous ?? false);
    await this.codeService.markUsed(code, String(player._id));
    return { player, alreadyUsed: false };
  }
}
