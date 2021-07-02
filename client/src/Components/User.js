
const User = ({user, sendData, currentUser, time}) => {
  const toggleSkipUser = e => {
    sendData({type: 'toggle_skip_user', userId: user.id})
  }
  return (
    <li className="userList__entry">
      <div className="userList__left">
        <input type="checkbox" checked={!user.skip} onChange={toggleSkipUser} />
        {
          currentUser?.id !== user.id
          ? <p>{user.name}</p>
          : <p className="userList__name userList__name--currentUser">{user.name}</p>
        }
      </div>
      <div className="userList__right">
        {currentUser.id === user.id ? <p className="userList__time"> {time} </p>: ''}
        <button className="userList__removeUser" onClick={e => sendData({type: 'remove_user', userId: user.id})}>X</button>
      </div>
    </li>
  )
};

export default User;
