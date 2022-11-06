import { Socket } from "net";

export function Model<T>(collection: string, client: Socket) {
  return {
    async insertOne(data: T): Promise<number> {
      return new Promise((res) => {
        client.once("data", function (data) {
          res(parseInt(String(data)));
        });
        client.write(
          JSON.stringify({
            collection,
            insertOne: data,
          })
        );
      });
    },
    async find(filter: { id?: number }): Promise<T[]> {
      return new Promise((res) => {
        client.once("data", function (data) {
          const parsed = JSON.parse(String(data));
          res(parsed);
        });
        client.write(
          JSON.stringify({
            collection,
            find: {
              filter,
            },
          })
        );
      });
    },
    async findOne(filter: { id: number }): Promise<T> {
      return new Promise((res) => {
        client.once("data", function (data) {
          const parsed = JSON.parse(String(data));
          res(parsed[0]);
        });
        client.write(
          JSON.stringify({
            collection,
            find: {
              filter,
            },
          })
        );
      });
    },
    async updateOne(filter: any, data: any): Promise<void> {
      return new Promise((res) => {
        client.once("data", function (data) {
          res();
        });
        client.write(
          JSON.stringify({
            collection,
            updateOne: {
              filter,
              data,
            },
          })
        );
      });
    },
    async deleteOne(data: any): Promise<void> {
      return new Promise((res) => {
        client.once("data", function (data) {
          res();
        });
        client.write(
          JSON.stringify({
            collection,
            deleteOne: data,
          })
        );
      });
    },
  };
};
