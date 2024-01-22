import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type PostDocument = Post &
  Document & {
    updatedAt?: Date;
    createdAt?: Date;
  };

@Schema({ timestamps: true })
export class Post {
  @Prop()
  name: string;

  @Prop()
  description: string;

  @Prop()
  image: string;
}

export const PostSchema = SchemaFactory.createForClass(Post);
