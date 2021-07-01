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
  state.roundLength = (1000 * 10 * 60);
  state.currentTime = 0;
  state.status = 'stopped';
  state.clock = null;

  state.clientState = () => {
    const { id,
      users,
      roundLength,
      currentTime,
      status
    } = state;
    const clientState = { id, users, roundLength, currentTime, status };
    return clientState;
  }

  state.newUserTurn = () => {
    if(!state.users) {
      return 'nousers';
    }
    if(!state.users.find(({id}) => id === state.currentUser.id))
      return users[0].id;

    
  }

  state.startRound = session => {
    clearInterval(state.clock);
    state.currentTime = state.roundLength;
    state.status = 'running';
    console.log(`starting timer @ ${state.currentTime}`);

    session.emit('data', { type: 'time_start', currentUser: state.currentUser, currentTime: state.currentTime });

    state.clock = setInterval(() => {
      if (state.status = 'running') {
        state.currentTime -= 1000;
        session.emit('data', { type: 'time', currentTime: state.currentTime });
      }
      if (state.currentTime < 1000) {
        clearInterval(clock);
        state.status = 'stopped';
        state.currentTime = state.roundLength;
      }
    }, 1000)
  };

  state.newUser = name => {
    state.users.push(newUser(name));
    console.log(state.users);
  };
  return state;
};

module.exports = { newSession, newUser };