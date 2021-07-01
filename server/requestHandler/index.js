

const handleRequest = (state, io, req) => {
  const session = state.find(({id}) => id === req.sessionId);
  const socket = io.to(session.id);
  if (!session || !socket)
    return;
  switch(req.type) {
    case 'time': {
      switch (req.action) {
        case 'start': {
          session.startRound(socket);
        }
        default: return;
      }
    }
    default: return;
  }
}

module.exports = RequestHandler = (state, io) => ({
  handle: (request) => handleRequest(state, io, request)
});
