const uuid = require('uuid');
const newUser = name => {
  const user = {};
  user.uuid = uuid.v4();
  user.name = name;
  return user;
}

const newSession = () => {
  const state = {};
  state.id = uuid.v4();
  state.users = [];
  state.clock
  state.roundLength = (1000 * 10 * 60);
  state.currentTime = 0;
  state.status = 'stopped';
  state.startRound = session => {
    state.currentTime = state.roundLength;
    state.status = 'running';
    console.log(`starting timer @ ${state.currentTime}`);

    const clock = setInterval(() => {
      if (state.status = 'running') {
        state.currentTime -= 1000;
        session.emit('data', { type: 'time', currentTime: state.currentTime });
        console.log(`newtime: ${state.currentTime}, ${session}`);
      }

      if (state.currentTime < 1000) {
        clearInterval(clock);
        state.status = 'stopped';
        state.currentTime = state.roundLength;
      }
    }, 1000)
  }
  return state;
};

module.exports = { newSession, newUser };