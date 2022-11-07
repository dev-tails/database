import { writeFileSync, readFileSync, readdirSync, mkdirSync, statSync } from "fs";
import net from "net";

console.time("init");

const port = 7070;
const host = "127.0.0.1";

let collections = {};
try {
  try {
    statSync("db");
  } catch(err:any) {
    mkdirSync("db");
  }

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
      if (filter._id) {
        const note = getCollection(collection)[filter._id] || null;

        sock.write(JSON.stringify([note]));
      } else {
        const filterKeys = Object.keys(filter);
        let notes: any[] = [];
        for (const _id of Object.keys(getCollection(collection))) {
          const note = getCollection(collection)[_id];
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
      const { _id } = jsonData.deleteOne;
      delete getCollection(collection)[_id];

      saveToFile(collection);

      sock.write("0");
    } else if (jsonData.updateOne) {
      const {
        filter: { _id },
        data,
      } = jsonData.updateOne;
      const oldData = getCollection(collection)[_id];
      getCollection(collection)[_id] = {
        ...oldData,
        ...data,
      };

      saveToFile(collection);

      sock.write("0");
    } else if (jsonData.insertOne) {
      const _id = new Date().getTime();

      getCollection(collection)[_id] = {
        ...jsonData.insertOne,
        _id,
      };

      saveToFile(collection);

      sock.write(String(_id));
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