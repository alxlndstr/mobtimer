import { useState, useEffect } from 'react';
import socketIOClient from 'socket.io-client';
import './App.css';
import { ResponseHandler } from './responseHandler';
import NewUserForm from './Components/NewUserForm';
import Settings from './Components/Settings';
import msToTimeString from './utils';
import User from './Components/User';

const searchparams = new URLSearchParams(window.location.search);
let resHandler;
const socket = socketIOClient(`http://${window.location.hostname}:8080`);
let showSettingsDialog = true;
const showHideSettings = e => {
  showSettingsDialog = !showSettingsDialog;
  e.target.textContent = showSettingsDialog ? 'Hide settings' : 'Show Settings';
  document.querySelector('.app__settings').classList.toggle('hidden');
}


socket.emit('handshake', { sessionId: searchparams.get('sessionId') || 'new'});

function App() {
  const [state, setState] = useState({});

  const sendData = params => {
    socket.emit('data', { ...params, sessionId: state.id })
  }

  useEffect(() => {
    resHandler = ResponseHandler({ state, setState }, socket);
  }, [state]);

  useEffect(() => {
    socket.on('data', data => {
      console.log(data);
      resHandler.handle(data);
    });
  }, []);

  return (
    <div className="app">
      <header className="app__header">
        <h1>MobTimer</h1>
      </header>
      <div className="app__main">
        <button className="settings__showhide" onClick={showHideSettings}>Hide Settings</button>
        <div className="app__settings">
          <Settings roundLength={(state.roundLength/60).toString()} sendData={sendData} />
          <NewUserForm addNewUser={name => sendData({type: 'new_user', name})} />
        </div>
        <div className="app__controls">
          <button onClick={() => sendData({ type: 'time', action: 'start' })}>Start timer</button>
          <button onClick={() => console.dir(state)}>dump state</button>
        </div>
        <ul className="app__userList">
          {
            state.users?.length ? state.users.map((user, key) => <User key={key} sendData={sendData} user={user} currentUser={state.currentUser} time={msToTimeString(state.currentTime)} />)
            : <p className="userList__nousers">Add users to begin!</p>
          }
        </ul>

      </div>
    </div>
  );
}

export default App;
