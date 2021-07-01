const handleResponse = ({state, setState}, socket, data) => {
  switch (data.type) {
    case 'full_state': {
      const session = JSON.parse(data.session);
      setState(session);
      var newurl = window.location.protocol + "//" + window.location.host + window.location.pathname + `?sessionId=${session.id}`;
      window.history.pushState({path:newurl},'',newurl);
      break;
    }
    case 'time_start': {
      setState({...state, currentTime: data.currentTime, currentUser: data.currentUser});
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

    default: return;
  }
};

export const ResponseHandler = (statePair, socket) => ({
  handle: (response) => handleResponse(statePair, socket, response)
});