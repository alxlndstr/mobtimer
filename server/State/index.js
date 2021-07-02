const uuid = require('uuid');
const newUser = name => {
  const user = {};
  user.id = uuid.v4();
  user.name = name;
  user.skip = false;
  return user;
}

const newSession = () => {
  const state = {};
  state.id = uuid.v4();
  state.users = [];
  state.roundLength = (1000 * 3)// * 60);
  state.continuous = false;
  state.currentTime = 0;
  state.currentUser = 0;
  state.status = 'stopped';
  state.clock = null;
  state.resetClock = () => {
    clearInterval(state.clock);
    state.status = 'stopped';
    state.currentTime = state.roundLength;
  };
  state.endTurn = () => {
    if (state.status === 'running') {
      state.resetClock();
    }
    nextIndex = state.nextUserIndex();
    state.currentUser = nextIndex > -1 ? state.users[nextIndex] : {};
  };
  state.clientState = () => {
    const {
      id,
      users,
      roundLength,
      currentTime,
      currentUser,
      status,
    } = state;
    const clientState = {
      id,
      users,
      roundLength,
      currentTime,
      currentUser,
      status
    };
    return clientState;
  }
  state.removeUser = (userId) => {
    const index = state.users.indexOf(state.users.find(({id}) => id === userId));
    if(state.currentUser?.id === userId) state.endTurn()
    state.users.splice(index, 1);
  }
  state.setRoundLength = (minutes, seconds = 0) => {
    state.roundLength = state.currentTime = (minutes * 60000) + (seconds * 1000);
  }
  state.nextUserIndex = (currentUser = state.currentUser) => {
    if (!state.users.length) {
      return -1;
    }
    if (state.users.every(({skip}) => skip)) {
      return -1;
    }
    const currentUserIndex = state.users.indexOf(currentUser);
    if(currentUserIndex >= state.users.length - 1) {
      return !state.users[0].skip ? 0 : state.nextUserIndex(state.users[0]);
    }
    if(state.users[currentUserIndex + 1].skip) {
      return state.nextUserIndex(state.users[currentUserIndex + 1])
    }
    return currentUserIndex + 1;
  }

  state.startRound = (socket) => {
    clearInterval(state.clock);
    if(state.users.every(({skip}) => skip)) return;

    if(!state.currentUser || state.currentUser?.skip) {
      const currentUserIndex = state.nextUserIndex();
      if (currentUserIndex === -1) {
        return;
      };

      state.currentUser = state.users[currentUserIndex];
      state.currentTime = state.roundLength;
    }
    state.status = 'running';
    console.log(`starting timer for group ${state.id} @ ${state.currentTime}. ${state.currentUser?.name} has the turn`);

    socket.emit('data', { type: 'time_start', status: state.status, currentUser: state.currentUser, currentTime: state.currentTime });

    state.clock = setInterval(() => {
      if (state.status === 'running') {
        state.currentTime -= 1000;
        socket.emit('data', { type: 'time', currentTime: state.currentTime });
      }
      if (state.currentTime < 1000) {
        state.endTurn();
        socket.emit('data', { type: 'time_end', status: state.status, currentUser: state.currentUser, currentTime: state.currentTime });
      }
    }, 1000);
  };

  state.newUser = name => {
    state.users.push(newUser(name));
  };
  return state;
};

module.exports = { newSession, newUser };
