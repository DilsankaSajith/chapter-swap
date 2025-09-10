import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import bookRoutes from './routes/bookRoutes.js';
import userRoutes from './routes/userRoutes.js';
import requestRoutes from './routes/requestRoutes.js';
import chatUserRoutes from './routes/chatUserRoutes.js';
import chatRoutes from './routes/chatRoutes.js';
import messageRoutes from './routes/messageRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import reportRoutes from './routes/reportRoutes.js';
dotenv.config();
import connectDB from './config/db.js';
import { errorHandler, notFound } from './middleware/errorMiddleware.js';
import { Server } from 'socket.io';

const port = process.env.PORT || 8000;

connectDB();

const app = express();

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Cookie parser middleware
app.use(cookieParser());

app.use('/api/books', bookRoutes);
app.use('/api/users', userRoutes);
app.use('/api/requests', requestRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/reports', reportRoutes);

// Chat app
app.use('/api/chats/users', chatUserRoutes);
app.use('/api/chats', chatRoutes);
app.use('/api/messages', messageRoutes);

app.use(notFound);
app.use(errorHandler);

const server = app.listen(port, () => {
  console.log(`Server running on port ${port}...`);
});

const io = new Server(server, {
  pingTimeout: 6000,
  cors: {
    origin: 'http://localhost:3000',
  },
});

io.on('connection', (socket) => {
  console.log('connected to socket.io');

  socket.on('setup', (userData) => {
    socket.join(userData._id);
    socket.emit('connected');
  });

  socket.on('join_chat', (room) => {
    socket.join(room);
    console.log('User joined room: ' + room);
  });

  socket.on('new_message', (newMessageRecieved) => {
    const chat = newMessageRecieved.chat;

    if (!chat.users) return console.log('chat.users not defined');

    chat.users.forEach((user) => {
      if (user._id == newMessageRecieved.sender._id) return;
      socket.in(user._id).emit('message_recieved', newMessageRecieved);
    });
  });

  socket.off('setup', () => {
    console.log('User disconnected');
    socket.leave(userData._id);
  });
});
