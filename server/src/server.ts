import { writeFileSync, readFileSync, readdirSync, mkdirSync, statSync } from "fs";
import net from "net";

console.time("init");

const port = 7070;
const host = "127.0.0.1";

let collections = {};
try {
  const stats = statSync("db");
  if (!stats.isDirectory()) {{
    mkdirSync("db");
  }}
  const filenames = readdirSync("db");
  for (const filename of filenames) {
    const collectionName = filename.split('.')[0];
    const collectionFileContents = readFileSync(`db/${filename}`);
    if (collectionFileContents) {
      collections[collectionName] = JSON.parse(String(collectionFileContents));
    }
  }
} catch(err) {
  console.error(err);
}

const server = net.createServer();
server.listen(port, host, () => {
  console.timeEnd("init");
});

server.on("connection", function (sock) {
  sock.on("data", function (data) {
    console.time("op");
    const jsonData = JSON.parse(String(data));
    const collection = jsonData.collection;
    if (jsonData.find) {
      const filter = jsonData.find.filter;
      if (filter.id) {
        const note = getCollection(collection)[filter.id] || null;

        sock.write(JSON.stringify([note]));
      } else {
        const filterKeys = Object.keys(filter);
        let notes: any[] = [];
        for (const id of Object.keys(getCollection(collection))) {
          const note = getCollection(collection)[id];
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
        sock.write(JSON.stringify(notes));
      }
    } else if (jsonData.deleteOne) {
      const { id } = jsonData.deleteOne;
      delete getCollection(collection)[id];

      saveToFile(collection);

      sock.write("0");
    } else if (jsonData.updateOne) {
      const {
        filter: { id },
        data,
      } = jsonData.updateOne;
      const oldData = getCollection(collection)[id];
      getCollection(collection)[id] = {
        ...oldData,
        ...data,
      };

      saveToFile(collection);

      sock.write("0");
    } else if (jsonData.insertOne) {
      const id = new Date().getTime();

      getCollection(collection)[id] = {
        ...jsonData.insertOne,
        id,
      };

      saveToFile(collection);

      sock.write(String(id));
    }
    console.timeEnd("op");
  });
});

function saveToFile(collection: string) {
  console.time("saveToFile");
  writeFileSync(`db/${collection}.json`, JSON.stringify(getCollection(collection)));
  console.timeEnd("saveToFile");
}

function getCollection(collection: string) {
  if (collections[collection]) {
    return collections[collection];
  }
  collections[collection] = {}
  return collections[collection];
}