const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:4200",
    methods: ["GET", "POST"]
  }
});

app.use(cors());
app.use(express.json());

// Stocare temporară pentru utilizatori conectați
const connectedUsers = new Map();

io.on('connection', (socket) => {
  console.log('Un utilizator s-a conectat:', socket.id);

  // Când un utilizator trimite un mesaj
  socket.on('send-message', (data) => {
    console.log('Mesaj primit:', data);
    // Broadcast mesajul către toți utilizatorii conectați
    io.emit('new-message', {
      username: data.username,
      message: data.message,
      timestamp: new Date().toISOString()
    });
  });

  // Când un utilizator se conectează cu username
  socket.on('user-connected', (username) => {
    connectedUsers.set(socket.id, username);
    console.log(`${username} s-a conectat`);
    
    // Notifică toți ceilalți utilizatori
    socket.broadcast.emit('user-joined', {
      username: username,
      timestamp: new Date().toISOString()
    });
  });

  // Când un utilizator se deconectează
  socket.on('disconnect', () => {
    const username = connectedUsers.get(socket.id);
    if (username) {
      console.log(`${username} s-a deconectat`);
      connectedUsers.delete(socket.id);
      
      // Notifică toți ceilalți utilizatori
      socket.broadcast.emit('user-left', {
        username: username,
        timestamp: new Date().toISOString()
      });
    }
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server pornit pe portul ${PORT}`);
});
