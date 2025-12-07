import io from "socket.io-client";
import { BASE_URL } from "./constants";


export const createSocketConnection=()=>{
  return io(BASE_URL);
}


//// if any Error in Production
// export const createSocketConnection = () => {
//   if (location.hostname === "localhost") {
//     return io(BASE_URL);
//   } else {
//     return io("/", { path: "/api/socket.io" });
//   }
// };


