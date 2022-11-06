import { Socket } from "net";

export class Model<T> {
  constructor(private collection: string, private socket: Socket) {}
  async insertOne(data: Partial<T>): Promise<number> {
    return new Promise((res) => {
      this.socket.once("data", function (data) {
        res(parseInt(String(data)));
      });
      this.socket.write(
        JSON.stringify({
          collection: this.collection,
          insertOne: data,
        })
      );
    });
  }

  async find(filter: { id?: number }): Promise<T[]> {
    return new Promise((res) => {
      this.socket.once("data", function (data) {
        const parsed = JSON.parse(String(data));
        res(parsed);
      });
      this.socket.write(
        JSON.stringify({
          collection: this.collection,
          find: {
            filter,
          },
        })
      );
    });
  }

  async findOne(filter: { id: number }): Promise<T> {
    return new Promise((res) => {
      this.socket.once("data", function (data) {
        const parsed = JSON.parse(String(data));
        res(parsed[0]);
      });
      this.socket.write(
        JSON.stringify({
          collection: this.collection,
          find: {
            filter,
          },
        })
      );
    });
  }

  async updateOne(filter: any, data: any): Promise<void> {
    return new Promise((res) => {
      this.socket.once("data", function (data) {
        res();
      });
      this.socket.write(
        JSON.stringify({
          collection: this.collection,
          updateOne: {
            filter,
            data,
          },
        })
      );
    });
  }

  async deleteOne(data: any): Promise<void> {
    return new Promise((res) => {
      this.socket.once("data", function (data) {
        res();
      });
      this.socket.write(
        JSON.stringify({
          collection: this.collection,
          deleteOne: data,
        })
      );
    });
  }
}
