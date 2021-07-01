const PORT = process.env.PORT || 8080;
const io = require('socket.io')(PORT, { cors: { origin: '*', methods: ['*']}});
const { newSession } = require('./state');
const RequestHandler = require('./requestHandler');
let counter = 0;
let ticktock = true;

const state = [];
const requestHandler = RequestHandler(state, io);

io.on('connection', socket => {

  socket.on('handshake', handshake => {
    console.log(`recieved new handshake: ${JSON.stringify(handshake)}`)
    const existingSession = state.find(({id}) => handshake.sessionId === id)
    if (handshake.sessionId !== 'new' && existingSession) {
      socket.join(handshake.sessionId);
      console.log(`client joined group: ${existingSession.id}`)
      socket.emit('data', {type: 'full_state', session: state.find(({id}) => handshake.sessionId === id)});
      return;
    }
    const session = newSession();
    state.push(session);
    socket.emit('data', {type: 'full_state', session});
    console.log(`client joined group: ${session.id}`)
    socket.join(session.id);
  })

  socket.on('data', data => {
    console.log(data);
    requestHandler.handle(data);
  });

  socket.on('disconnect', () => {
    return;
  });
});