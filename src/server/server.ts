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
    if (jsonData.find) {
      const filter = jsonData.find.filter;
      if (filter.id) {
        const note = notesById[filter.id] || null;

        return sock.write(JSON.stringify([note]));
      }

      const filterKeys = Object.keys(filter);
      let notes: any[] = [];
      for (const id of Object.keys(notesById)) {
        const note = notesById[id];
        let includeNote = true;
        for (const filterKey of filterKeys) {
          if (note[filterKey] !== filter[filterKey]) {
            includeNote = false;
            break;
          }
        }
        if (includeNote) {
          notes.push(note);
        }
      }
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
    } else if (jsonData.insertOne) {
      const id = new Date().getTime();

      notesById[id] = {
        ...jsonData.insertOne,
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

function shallowEqual(object1, object2) {
  const keys1 = Object.keys(object1);
  const keys2 = Object.keys(object2);
  if (keys1.length !== keys2.length) {
    return false;
  }
  for (let key of keys1) {
    if (object1[key] !== object2[key]) {
      return false;
    }
  }
  return true;
}