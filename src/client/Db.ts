import net from "net";
import { Model } from "./Model";

export const Db = () => {
  const client = new net.Socket();
  const port = 7070;
  const host = "127.0.0.1";

  client.connect(port, host, function () {
    console.log("connected");
  });
  
  return {
    Notes: Model("notes", client),
    Users: Model("users", client),
    destroy() {
      client.destroy();
    }
  };
};
