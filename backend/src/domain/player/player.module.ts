import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Player, PlayerSchema } from './player.schema';
import { PlayerService } from './player.service';
import { PlayerController } from './player.controller';

@Module({
  imports: [MongooseModule.forFeature([{ name: Player.name, schema: PlayerSchema }])],
  providers: [PlayerService],
  controllers: [PlayerController],
  exports: [PlayerService, MongooseModule],
})
export class PlayerModule {}
