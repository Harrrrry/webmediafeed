import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type PostDocument = Post & Document;

@Schema({ timestamps: true })
export class Post {
  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  mediaUrl: string;

  @Prop({ required: true })
  mediaType: string; // 'image' | 'video'

  @Prop()
  caption: string;

  @Prop({ type: [String], default: [] })
  likes: string[]; // Array of userIds
}

export const PostSchema = SchemaFactory.createForClass(Post); 