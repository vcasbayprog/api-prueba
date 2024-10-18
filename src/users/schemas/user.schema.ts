import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class User {
  @Prop({ required: true })
  username: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true, default: 'user' })
  role: string;  

  @Prop({ default: false })
  pendingDeletion: boolean;

  @Prop({ default: false })  
  isMarkedForDeletion: boolean;  
}

export type UserDocument = User & Document;
export const UserSchema = SchemaFactory.createForClass(User);
