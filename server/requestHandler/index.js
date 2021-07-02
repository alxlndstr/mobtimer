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
          break;
        }
        case 'pause': {
          if (session.status !== 'running') return;
          session.status = 'paused';
          socket.emit('data', { type: 'time_pause', status: session.status, currentTime: session.currentTime });
          break;
        }
        case 'resume': {
          if (session.status !== 'paused') return;
          session.status = 'running';
          socket.emit('data', { type: 'time_resume', status: session.status, currentTime: session.currentTime });
          break;
        }
        default: return;
      }
      break;
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
      if (req.roundLength < 0.05 || req.roundLength > 720) return;
      session.setRoundLength(req.roundLength);
      socket.emit('data', { type: 'set_round_length', roundLength: session.roundLength });
      break;
    }
    case 'toggle_skip_user': {
      const user = session.users.find(({id}) => id === req.userId)
      user.skip = !user.skip;
      if (session.currentUser === user) {
        session.endTurn();
      }
      socket.emit('data', { type: 'toggle_skip_user', users: session.users, currentTime: session.currentTime, currentUser: session.currentUser })
      break;
    }

    default: return;
  }
}

module.exports = RequestHandler = (state, io) => ({
  handle: (request) => handleRequest(state, io, request)
});
