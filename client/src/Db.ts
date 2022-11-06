import { Socket } from "net";
import { Note } from "./Note";
import { User } from "./User";

export class Db {
  public Note: Note;
  public User: User;

  constructor(socket: Socket) {
    this.Note = new Note(socket);
    this.User = new User(socket);
  }
}
