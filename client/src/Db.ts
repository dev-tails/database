import { Socket } from "net";
import { Note } from "./Note";
import { User } from "./User";

export class Db {
  public Note: Note;
  public User: User;

  constructor(client: Socket) {
    this.Note = new Note(client);
    this.User = new User(client);
  }
}
