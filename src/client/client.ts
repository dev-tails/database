import assert from "assert";
import { Db } from "./Db";

async function run() {
  const db = Db();
  const Note = db.Notes;
  const User = db.Users;

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

  const id2 = await Note.insertOne({
    body: "this is a test",
  });

  const notes = await Note.find({});
  assert.equal(notes.length, 2);

  await Note.deleteOne({id});
  await Note.deleteOne({id: id2});
  const note2 = await Note.findOne({ id });
  assert.equal(null, note2);

  const userId = await User.insertOne({ email: "adam@xyzdigital.com" });
  const user = await User.findOne({ id: userId });
  assert.equal(user.email, "adam@xyzdigital.com");

  db.destroy();
}

run();
