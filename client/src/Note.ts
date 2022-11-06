import { Socket } from "net";
import { Model } from "./Model";

type NoteType = {
  id: number;
  body: string;
}

export class Note extends Model<NoteType> {
  constructor(client: Socket) {
    super("notes", client);
  }
}