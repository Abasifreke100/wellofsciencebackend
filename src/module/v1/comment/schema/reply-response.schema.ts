import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

export type ReplyResponseDocument = ReplyResponse &
  Document & {
    updatedAt?: Date;
    createdAt?: Date;
  };

@Schema({ timestamps: true })
export class ReplyResponse {
  @Prop()
  name: string;

  @Prop()
  response: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Reply',
  })
  reply: string;
}

export const ReplyResponseSchema = SchemaFactory.createForClass(ReplyResponse);
