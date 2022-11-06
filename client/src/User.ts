import { Socket } from "net";
import { Model } from "./Model";

export type UserType = {
  _id: number;
  email: string;
  password: string;
}

export class User extends Model<UserType> {
  constructor(client: Socket) {
    super("users", client);
  }
}