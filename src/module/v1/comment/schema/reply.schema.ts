import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

export type ReplyDocument = Reply &
  Document & {
    updatedAt?: Date;
    createdAt?: Date;
  };

@Schema({ timestamps: true })
export class Reply {
  @Prop()
  name: string;

  @Prop()
  response: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comments',
  })
  comments: string;

  @Prop({ default: true })
  isAdmin: boolean;
}

export const ReplySchema = SchemaFactory.createForClass(Reply);
