import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { RoleEnum } from '../../../../common/constants/user.constants';

export type UserDocument = User &
  Document & {
    updatedAt?: Date;
    createdAt?: Date;
  };

@Schema({ timestamps: true })
export class User {
  @Prop()
  firstName: string;

  @Prop()
  lastName: string;

  @Prop()
  email: string;

  @Prop({
    enum: [RoleEnum.ADMIN],
  })
  role: string;

  @Prop({
    select: false,
    minlength: [8, 'Password must be a least 6 characters'],
  })
  password: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
