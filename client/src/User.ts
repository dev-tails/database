import { Socket } from "net";
import { Model } from "./Model";

export type UserType = {
  id: number;
  email: string;
}

export class User extends Model<UserType> {
  constructor(client: Socket) {
    super("users", client);
  }
}