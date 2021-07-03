const NewUserForm = ({addNewUser}) => {
  const onSubmit = e => {
    const nameInput = document.querySelector('#newUserName');
    if (nameInput.value) addNewUser(nameInput.value);
    nameInput.value = '';
  }
  return (
    <div className="settings__newUserForm">
      <label htmlFor="newUserName">Add a user:</label> <br />
      <input type="text" placeholder="Username" name="newUserName" maxLength="24" onKeyPress={(e) => {if (e.key === 'Enter') onSubmit(e)}} id="newUserName" />
      <button onClick={onSubmit}> Add </button>
    </div>
  );
}

export default NewUserForm;