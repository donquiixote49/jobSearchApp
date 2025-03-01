import { Server } from "socket.io";




let io;
export const runSocket = function (server) {
   io = new Server(server, {
    cors: {
      origin: "*",
    },
  });
  io.on("connection",(socket)=>{
        console.log(`a user connected ==>${socket.id}`);
  })
  return io
};


export const accessSocket = () => {
    return io;
};



