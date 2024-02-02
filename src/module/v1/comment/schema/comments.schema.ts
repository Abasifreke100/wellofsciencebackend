import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

export type CommentsDocument = Comments &
  Document & {
    updatedAt?: Date;
    createdAt?: Date;
  };

@Schema({ timestamps: true })
export class Comments {
  @Prop()
  name: string;

  @Prop()
  email: string;

  @Prop()
  website: string;

  @Prop()
  comment: string;

  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'Post' })
  post: string;
}

export const CommentsSchema = SchemaFactory.createForClass(Comments);
