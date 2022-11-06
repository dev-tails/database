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
  async create(data: NoteType): Promise<number> {
    return new Promise((res) => {
      client.once("data", function (data) {
        res(parseInt(String(data)));
      });
      client.write(
        JSON.stringify({
          ...data,
        })
      );
    });
  },
  async findById(id: number) {
    return new Promise((res) => {
      client.once("data", function (data) {
        const parsed = JSON.parse(String(data));
        res(parsed);
      });
      client.write(
        JSON.stringify({
          findById: id,
        })
      );
    })
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
    })
  }
};

async function run() {
  const id = await Note.create({
    body: "this is a test",
  });
  const note = await Note.findById(id);
  await Note.deleteOne({ id });
}

run();
