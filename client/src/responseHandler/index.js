const path = `${window.location.protocol}//${window.location.host}`;
const audio = new Audio(`${path}/ping.m4a`);

// TODO: MOST OF THESE ACTIONS SHOULD NOW BE COMBINED INTO ONE CALL! case 'update_state': setState({ ...state, ...data.params });

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
      setState({...state, status: data.status, currentTime: data.currentTime, currentUser: data.currentUser});
      break;
    }
    case 'time_end': {
      setState({...state, status: data.status, currentTime: data.currentTime, currentUser: data.currentUser});
      if (document.querySelector('#playSound').checked) audio.play();
      break;
    }
    case 'time_pause': {
      setState({...state, status: data.status, currentTime: data.currentTime});
      break;
    }
    case 'time_resume': {
      setState({...state, status: data.status, currentTime: data.currentTime});
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
      setState({...state, users: data.users, currentTime: data.currentTime, currentUser: data.currentUser});
      break;
    }
    default: return;
  }
};

export const ResponseHandler = (statePair, socket) => ({
  handle: (response) => handleResponse(statePair, socket, response)
});