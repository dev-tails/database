import { writeFile } from "fs";
import net from "net";
const port = 7070;
const host = "127.0.0.1";

const notesById: { [id: string]: any } = {};

const server = net.createServer();
server.listen(port, host, () => {
  console.log("TCP Server is running on port " + port + ".");
});

server.on("connection", function (sock) {
  sock.on("data", function (data) {
    const jsonData = JSON.parse(String(data));
    if (jsonData.findById) {
      const id = jsonData.findById;
      const note = notesById[id];

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
  });
});

function saveToFile() {
  writeFile("notes.json", JSON.stringify(notesById), () => {});
}
