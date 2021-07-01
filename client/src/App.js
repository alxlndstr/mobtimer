import { useState, useEffect } from 'react';
import socketIOClient from 'socket.io-client';
import './App.css';
import { ResponseHandler } from './responseHandler';
import NewUserForm from './Components/NewUserForm';
import msToTimeString from './utils';

const searchparams = new URLSearchParams(window.location.search);
let resHandler;
const socket = socketIOClient(`http://${window.location.hostname}:8080`);

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

      <button onClick={() => sendData({ type: 'time', action: 'start' })}>Start timer</button>
      <button onClick={() => console.log(state)}>dump state</button>
      <NewUserForm addNewUser={name => sendData({type: 'new_user', name})} />
      <div className="app__userList">
        {
          state.users
          ? state.users?.map((user, key) => {
            if (user.id !== state.currentUser?.id){
              return <h3 key={key} className="userList__item">{user.name}</h3>;
            }
            return <h2 key={key}>{user.name} {msToTimeString(state.currentTime)} </h2>;
          })
          : <p className="userList__nousers">Add users to begin!</p>
        }
      </div>

    </div>
  );
}

export default App;
