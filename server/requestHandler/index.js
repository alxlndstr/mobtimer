const database = require("mime-db");


const handleRequest = (state, io, req) => {
  const session = state.find(({id}) => id === req.sessionId);
  if (!session) return;
  const socket = io.to(session.id);
  if(!socket) return;

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
    case 'remove_user': {
      session.removeUser(req.userId);
      socket.emit('data', { type: 'remove_user', users: session.users });
      break;
    }
    case 'set_round_length': {
      if (req.roundLength < 1 || req.roundLength) return;
      session.setRoundLength(req.roundLength);
      console.log('new length:' + req.roundLength);
      socket.emit('data', { type: 'set_round_length', roundLength: session.roundLength });
      break;
    }
    case 'toggle_skip_user': {
      const user = session.users.find(({id}) => id === req.userId)
      user.skip = !user.skip;
      if (session.currentUser === user) session.endTurn();
      socket.emit('data', { type: 'toggle_skip_user', users: session.users })
      break;
    }

    default: return;
  }
}

module.exports = RequestHandler = (state, io) => ({
  handle: (request) => handleRequest(state, io, request)
});
