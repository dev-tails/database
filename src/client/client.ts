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
  async create(data: NoteType) {
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
  async findById(id: string) {
    client.write(
      JSON.stringify({
        findById: id,
      })
    );
  },
};

async function run() {
  const id = await Note.create({
    body: "this is a test",
  });
  console.log(id);
}

run();
