import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:4200",
    methods: ["GET", "POST"]
  }
});

app.use(cors());
app.use(express.json());

const connectedUsers = new Map<string, string>();

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('send-message', (data: { username?: string; message?: string }) => {
    if (!data || !data.username || !data.username.trim()) {
      socket.emit('invalid-username', { reason: 'missing' });
      return;
    }
    const stored = connectedUsers.get(socket.id);
    if (!stored) {
      socket.emit('not-connected', { reason: 'user-not-registered' });
      return;
    }
    if (stored !== data.username) {
      socket.emit('username-mismatch', { expected: stored });
      return;
    }
    if (!data.message || !data.message.trim()) return;

    io.emit('new-message', {
      username: data.username.trim(),
      message: data.message.trim(),
      timestamp: new Date().toISOString()
    });
  });

  socket.on('user-connected', (username: string) => {
    if (!username || !username.trim()) {
      socket.emit('invalid-username', { reason: 'missing' });
      return;
    }
    if (connectedUsers.has(socket.id)) {
      return;
    }
    connectedUsers.set(socket.id, username.trim());
    console.log(`${username.trim()} connected`);
    
    socket.broadcast.emit('user-joined', {
      username: username.trim(),
      timestamp: new Date().toISOString()
    });
  });

  socket.on('disconnect', () => {
    const username = connectedUsers.get(socket.id);
    if (username) {
      console.log(`${username} disconnected`);
      connectedUsers.delete(socket.id);
      
      socket.broadcast.emit('user-left', {
        username: username,
        timestamp: new Date().toISOString()
      });
    }
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
