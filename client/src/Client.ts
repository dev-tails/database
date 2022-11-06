import { Socket } from "net";
import { Db } from "./Db";

export class Client {
  private socket: Socket;
  constructor(private uri: string) {}

  public async connect(): Promise<Db> {
    return new Promise((res) => {
      const splitUri = this.uri.replace("engramdb://", "").split(":");
      const host = splitUri[0];
      const port = Number(splitUri[1]);

      this.socket = new Socket();

      console.log(`Connecting to ${host}:${port}`);
        
      this.socket.connect(port, host, () => {
        const db = new Db(this.socket);
        res(db);
      });
    });
  }

  public close() {
    this.socket.destroy();
  }
}
