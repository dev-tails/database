import { writeFile } from "fs";
import net from "net";
const port = 7070;
const host = "127.0.0.1";

const notes: any[] = [];

const server = net.createServer();
server.listen(port, host, () => {
  console.log("TCP Server is running on port " + port + ".");
});

server.on("connection", function (sock) {
  sock.on("data", function (data) {
    const jsonData = JSON.parse(String(data));
    const id = new Date().getTime();

    notes.push({
      ...jsonData,
      id,
    });

    writeFile("notes.json", JSON.stringify(notes), () => {});

    sock.write(String(id));
  });
});