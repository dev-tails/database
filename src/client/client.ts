import assert from "assert";
import net from "net";
const client = new net.Socket();
const port = 7070;
const host = "127.0.0.1";

client.connect(port, host, function () {
  console.log("connected");
});

client.on("close", function () {
  console.log("Connection closed");
});

type NoteType = {
  body: string;
};

const Note = {
  async insertOne(data: NoteType): Promise<number> {
    return new Promise((res) => {
      client.once("data", function (data) {
        res(parseInt(String(data)));
      });
      client.write(
        JSON.stringify({
          insertOne: data,
        })
      );
    });
  },
  async findOne(filter: { id: number }): Promise<NoteType> {
    return new Promise((res) => {
      client.once("data", function (data) {
        const parsed = JSON.parse(String(data));
        res(parsed);
      });
      client.write(
        JSON.stringify({
          findOne: {
            filter
          }
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
          deleteOne: data,
        })
      );
    });
  },
};

async function run() {
  console.time('insertOne')
  const id = await Note.insertOne({
    body: "this is a test",
  });
  console.timeEnd('insertOne')
  console.time('updateOne')
  await Note.updateOne({ id }, { body: "this was modified" });
  console.timeEnd('updateOne')
  console.time('findOne')
  const note = await Note.findOne({ id });
  console.timeEnd('findOne')
  assert.equal(note.body, "this was modified");
  await Note.deleteOne({id});
  const note2 = await Note.findOne({ id });
  assert.equal(null, note2);

  client.destroy();
}

run();
