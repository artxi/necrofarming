import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type Guess = {
  employee: Types.ObjectId;
  cause: 'voluntary' | 'fired';
  date: Date;
};

@Schema({ timestamps: true })
export class Player extends Document {
  @Prop({ required: true, unique: true })
  code: string;

  @Prop()
  nickname?: string;

  @Prop({ default: false })
  anonymous: boolean;

  @Prop({ type: [Object], default: [] })
  guesses: Guess[];

  @Prop()
  lockedAt?: Date;
}

export const PlayerSchema = SchemaFactory.createForClass(Player);
