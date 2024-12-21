import { Server } from "socket.io";
import { decrypt } from "./utils/auth.js";
import { parseCookies } from "./utils/cookie.js";
import { saveMessageDb } from "./message.js";
import { v4 as uuidv4 } from 'uuid';

export function initServerSocket(server) {

  const io = new Server(server);

  io.use((socket, next) => {
    console.log('Socket handshake', socket.handshake);

    try {

      const parsedCookies = parseCookies(socket.handshake.headers.cookie);
      console.log('Parsed cookies', parsedCookies.Authorization || parsedCookies.authorization);
      decrypt(parsedCookies.Authorization || parsedCookies.authorization)
        .then((payload) => {
          const accountId = payload?.account_id;
          if (!accountId) {
            next(new Error("Unauthorized"));
          } else {
            socket.accountId = accountId;
            next();
          }
        })
        .catch((error) => {
          next(new Error("Unauthorized"));
        });
    } catch (error) {
      console.log('Error', error);
      next(new Error("Unauthorized"));
    }

  })
    .on('connection', async (socket) => {
      console.log('A user connected', socket.id, socket.handshake);

      socket.join(socket.accountId);

      socket.on('send-message', (data) => {
        const { message, receiver} = data;
        const date = new Date();
        const messageId = uuidv4();

        // maybe also send to the user
        socket.to(receiver).emit('receive-message', { message, sender: socket.accountId, date: date, messageId });
        saveMessageDb( {message, sender: socket.accountId, receiver, date, messageId });

      });

      socket.on('disconnect', () => {
        console.log('User disconnected');
      });
    });
}

