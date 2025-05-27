const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const cors = require('cors');
const app = express();

// Security middleware
app.use(helmet());
app.use(rateLimit({ windowMs: 60000, max: 100 }));
app.use(mongoSanitize());
app.use(cors({ origin: 'https://41leaked.vercel.app' }));
app.use(express.json());

// REST routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/bets', require('./routes/bets'));
app.use('/api/faucet', require('./controllers/faucet'));

// HTTP & WebSocket setup
const server = http.createServer(app);
const io = socketIo(server, { cors: { origin: '*' } });

io.use((socket, next) => {
  const token = socket.handshake.query.token;
  // TODO: verify JWT, attach socket.user
  next();
});

io.on('connection', (socket) => {
  socket.on('place_bet', data => {
    // TODO: handle place_bet
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => console.log(`Server listening on ${PORT}`));
