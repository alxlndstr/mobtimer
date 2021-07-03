const express = require('express');
const PORT = process.env.PORT || 8080;
const socketio = require('socket.io')
const { newSession } = require('./state');
const RequestHandler = require('./requestHandler');

const INDEX = '/build/index.html';

const server = express()
  .use(express.static('build'))
  .get('/', (_, res) => res.redirect('/index.html'))
  .listen(PORT, () => console.log(`Listening on ${PORT}`));

const io = socketio(server);

const state = [];
const requestHandler = RequestHandler(state, io);

io.on('connection', socket => {

  socket.on('handshake', handshake => {
    console.log(`recieved new handshake: ${JSON.stringify(handshake)}`)
    const existingSession = state.find(({id}) => handshake.sessionId === id)

    if (handshake.sessionId !== 'new' && existingSession) {
      socket.join(handshake.sessionId);
      console.log(`client joined existing group: ${existingSession.id}`)
      socket.emit('data', {type: 'full_state', session: JSON.stringify(existingSession.clientState())});
      return;
    }
    const session = newSession();
    state.push(session);
    socket.emit('data', {type: 'full_state', session: JSON.stringify(session.clientState())});
    console.log(`client joined new group: ${session.id}`)
    socket.join(session.id);
  })

  socket.on('data', data => {
    requestHandler.handle(data);
  });

  socket.on('disconnect', () => {
    return;
  });
});