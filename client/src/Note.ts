import { Socket } from "net";
import { Model } from "./Model";

export type NoteType = {
  _id: number;
  body: string;
  user: string;
}

export class Note extends Model<NoteType> {
  constructor(client: Socket) {
    super("notes", client);
  }
}