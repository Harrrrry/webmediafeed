import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ShaadiDocument = Shaadi & Document;

@Schema({ timestamps: true })
export class Shaadi {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  brideName: string;

  @Prop({ required: true })
  groomName: string;

  @Prop({ required: true })
  date: Date;

  @Prop()
  location?: string;

  @Prop()
  image?: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  createdBy: Types.ObjectId;

  // Soft delete fields
  @Prop({ default: false })
  isDeleted: boolean;

  @Prop()
  deletedAt?: Date;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  deletedBy?: Types.ObjectId;

  @Prop()
  deleteReason?: string;
}

export const ShaadiSchema = SchemaFactory.createForClass(Shaadi); 