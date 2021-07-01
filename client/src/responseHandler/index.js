const path = `${window.location.protocol}//${window.location.host}`;
const audio = new Audio(`${path}/ping.m4a`);

const handleResponse = ({state, setState}, socket, data) => {
  switch (data.type) {
    case 'full_state': {
      const session = JSON.parse(data.session);
      setState(session);
      var url = `${path}/?sessionId=${session.id}`;
      window.history.pushState({ path: url }, '', url);
      break;
    }
    case 'time_start': {
      setState({...state, currentTime: data.currentTime, currentUser: data.currentUser});
      break;
    }
    case 'time_end': {
      setState({...state, currentTime: data.currentTime, currentUser: data.currentUser});
      if (document.querySelector('#playSound').checked) audio.play();
      break;
    }
    case 'time': {
      setState({...state, currentTime: data.currentTime});
      break;
    }
    case 'new_user': {
      setState({...state, users: data.users});
      break;
    }
    case 'remove_user': {
      setState({...state, users: data.users});
      break;
    }
    case 'set_round_length': {
      setState({...state, roundLength: data.roundLength});
      break;
    }
    case 'toggle_skip_user': {
      setState({...state, users: data.users});
      break;
    }
    default: return;
  }
};

export const ResponseHandler = (statePair, socket) => ({
  handle: (response) => handleResponse(statePair, socket, response)
});