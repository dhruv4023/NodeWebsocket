import { server as WebSocketServer } from "websocket";
import http from "http";

const websocketServerPort = 8080;
const httpServer = http.createServer();
const webSocketServer = new WebSocketServer({ httpServer });

httpServer.listen(websocketServerPort, () => {
  console.log(`WebSocket server is listening on port ${websocketServerPort}`);
});

const clients = {};

webSocketServer.on("request", (request) => {
  console.log(request.httpRequest.url);
  const url = request.httpRequest.url.split("/");
  console.log(url);
  switch (url[1]) {
    case "start":
      console.log(" Received a new connection from id " + url[2]);
      const connection = request.accept(null, request.origin);
      clients[url[2]] = connection;
      console.log("---------------connected-------------");
      connection.on("message", (message) => {
        if (message.type === "utf8") {
          console.log(message.utf8Data);
          try {
            clients["dhruv4023"].sendUTF(message.utf8Data);
            console.log("sent to admin");
          } catch (error) {
            console.log("admin is offline");
          }
          try {
            clients[JSON.parse(message.utf8Data).id].sendUTF(message.utf8Data);
            console.log("sent to ", JSON.parse(message.utf8Data).id);
          } catch (error) {
            console.log("Server error");
          }
        }
      });
      break;

    default:
      console.log("failed");
      break;
  }
  // var uid = getUID();
  // console.log("----------------------------");

  // const connection = request.accept(null, request.origin);
  // clients[uid] = connection;
  // console.log(
  //   "connected : " + uid + " in " + Object.getOwnPropertyNames(clients)
  // );
  // console.log("----------------------------");

  // connection.on("message", (message) => {
  //   if (message.type === "utf8") {
  //     console.log(message.utf8Data);

  //     for (let key in clients) {
  //       clients[key].sendUTF(message.utf8Data);
  //       // console.log("sent message to : ", clients[key]);
  //     }
  //   }
  // });
});
// const getUID = () => {
//   return Date.now();
// };
