const NewUserForm = ({addNewUser}) => {
  const onSubmit = e => {
    const name = document.querySelector('#newUserForm__name').value;
    if(name) addNewUser(name);
  }
  return (
    <div className="newUserForm">
      <input type="text" id="newUserForm__name" />
      <button onClick={onSubmit}> Add </button>
    </div>
  );
}

export default NewUserForm;