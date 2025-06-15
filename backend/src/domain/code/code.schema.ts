import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Code extends Document {
  @Prop({ required: true, unique: true })
  code: string;

  @Prop({ default: false })
  used: boolean;

  @Prop({ type: String, ref: 'Player', required: false })
  usedBy?: string;

  @Prop()
  usedAt?: Date;
}

export const CodeSchema = SchemaFactory.createForClass(Code);
