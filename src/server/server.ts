import { writeFileSync, readFileSync } from "fs";
import net from "net";

console.time("init");

const port = 7070;
const host = "127.0.0.1";

let notesById: { [id: string]: any } = {};

try {
  const notesFileContents = readFileSync("notes.json");
  if (notesFileContents) {
    notesById = JSON.parse(String(notesFileContents));
  }
} catch (err) {}

const server = net.createServer();
server.listen(port, host, () => {
  console.timeEnd("init");
});

server.on("connection", function (sock) {
  sock.on("data", function (data) {
    console.time("op");
    const jsonData = JSON.parse(String(data));
    if (jsonData.findOne) {
      const { id } = jsonData.findOne.filter;
      const note = notesById[id] || null;

      sock.write(JSON.stringify(note));
    } else if (jsonData.deleteOne) {
      const { id } = jsonData.deleteOne;
      delete notesById[id];

      saveToFile();

      sock.write("0");
    } else if (jsonData.updateOne) {
      const {
        filter: { id },
        data,
      } = jsonData.updateOne;
      const oldData = notesById[id];
      notesById[id] = {
        ...oldData,
        ...data,
      };

      saveToFile();

      sock.write("0");
    } else {
      const id = new Date().getTime();

      notesById[id] = {
        ...jsonData,
        id,
      };

      saveToFile();

      sock.write(String(id));
    }
    console.timeEnd("op");
  });
});

function saveToFile() {
  console.time("saveToFile");
  writeFileSync("notes.json", JSON.stringify(notesById));
  console.timeEnd("saveToFile");
}
