

const handleRequest = (state, io, req) => {
  const session = state.find(({id}) => id === req.sessionId);
  if (!session) return;
  const socket = io.to(session.id);
  if(!socket) return;

  console.log(session.clientState());

  switch(req.type) {
    case 'time': {
      switch (req.action) {
        case 'start': {
          session.startRound(socket);
        }
        default: return;
      }
    }
    case 'new_user': {
      session.newUser(req.name);
      socket.emit('data', { type: 'new_user', users: session.users });
      break;
    }

    default: return;
  }
}

module.exports = RequestHandler = (state, io) => ({
  handle: (request) => handleRequest(state, io, request)
});
