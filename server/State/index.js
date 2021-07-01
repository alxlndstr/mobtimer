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

  state.newUserTurn = () => {
    if(!state.users) {
      return 'nousers';
    }

    let nextUser;
    const currentUserIndex = state.users.indexOf(state.CurrentUser);
    if(currentUserIndex === -1 || currentUserIndex === state.users.length-1) {
      nextUser = state.users[0];
    }
    else {
      nextUser = state.users[currentUserIndex + 1];
    }

    return nextUser;
  }

  state.startRound = socket => {
    clearInterval(state.clock);

    const currentUser = state.newUserTurn();
    if (currentUser === 'nousers')
    {
      return;
    }
    state.currentUser = currentUser;
    state.currentTime = state.roundLength;

    state.status = 'running';
    console.log(`starting timer for group ${state.id} @ ${state.currentTime}. ${state.currentUser} has the turn`);

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
