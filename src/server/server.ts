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
    } else {
      const id = new Date().getTime();

      notesById[id] = {
        ...jsonData,
        id,
      };

      writeFile("notes.json", JSON.stringify(notesById), () => {});

      sock.write(String(id));
    }
  });
});
