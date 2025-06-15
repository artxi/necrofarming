import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Employee extends Document {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop({ default: true })
  active: boolean;

  @Prop()
  departureDate?: Date;

  @Prop({ enum: ['voluntary', 'fired'], required: false })
  departureCause?: 'voluntary' | 'fired';
}

export const EmployeeSchema = SchemaFactory.createForClass(Employee);
