const socket = require("socket.io");

const initializeSocket = (server) => {
  const io = socket(server, {
    cors: {
      origin: [
        "https://devconnectbykartik.netlify.app",
        "https://dev-tinder-complete-2spw.vercel.app",
        "http://localhost:5173",
      ],
    },
  });

  io.on("connection", (socket) => {
    
    // Handle Event

    socket.on("joinChat", () => {

    });

    socket.on("sendMessage",()=>{

    });

    socket.on("disconnect",()=>{

    });



  });
};

module.exports = initializeSocket;
