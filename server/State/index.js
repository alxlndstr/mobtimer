const uuid = require('uuid');
const newUser = name => {
  const user = {};
  user.id = uuid.v4();
  user.name = name;
  return user;
}

const newSession = () => {
  const state = {};
  state.id = uuid.v4();
  state.users = [];
  state.roundLength = (1000 * 10)// * 60);
  state.currentTime = 0;
  state.currentUser = {};
  state.status = 'stopped';
  state.clock = null;

  state.clientState = () => {
    const {
      id,
      users,
      roundLength,
      currentTime,
      currentUser,
      status
    } = state;
    const clientState = { id, users, roundLength, currentTime, currentUser, status };
    return clientState;
  }

  state.nextUserIndex = () => {
    if(!state.users.length) {
      return -1;
    }
    if (!state.currentUser) {
      return 0;
    }
    const currentUserIndex = state.users.indexOf(state.currentUser);
    if(currentUserIndex >= state.users.length-1) {
      return 0;
    }
    return currentUserIndex + 1;
  }

  state.startRound = socket => {
    clearInterval(state.clock);

    const currentUserIndex = state.nextUserIndex();
    if (currentUserIndex === -1) return;
    state.currentUser = state.users[currentUserIndex];
    state.currentTime = state.roundLength;

    state.status = 'running';
    console.log(`starting timer for group ${state.id} @ ${state.currentTime}. ${state.currentUser?.name} has the turn`);

    socket.emit('data', { type: 'time_start', currentUser: state.currentUser, currentTime: state.currentTime });

    state.clock = setInterval(() => {
      if (state.status = 'running') {
        state.currentTime -= 1000;
        socket.emit('data', { type: 'time', currentTime: state.currentTime });
      }
      if (state.currentTime < 1000) {
        clearInterval(state.clock);
        state.status = 'stopped';
        state.currentTime = state.roundLength;
      }
    }, 1000);
  };

  state.newUser = name => {
    state.users.push(newUser(name));
  };
  return state;
};

module.exports = { newSession, newUser };
