const Settings = ({roundLength, sendData}) => {
  const setRoundLength = () => {
    const roundLengthInput = document.querySelector('#roundLengthInput');
    const newLength = +roundLengthInput.value;
    roundLengthInput.value = '';
    if(typeof newLength === 'number') {
      sendData({type: 'set_round_length', roundLength: newLength})
    }
  }

  const onChangeRoundLengthInput = (e) => {
    if (+e.target.value > 720)
      e.target.value = 720;
    if (+e.target.value < 0.05)
      e.target.value = 0.05;
  }

  return (
    <div className="app__settings__inner">
      <label htmlFor="roundLengthInput">Round length in minutes:</label><br />
      <input type="number" placeholder={roundLength / 1000 || ''} onChange={onChangeRoundLengthInput} name="roundLengthInput" id="roundLengthInput" />
      <button onClick={setRoundLength}>Set</button>
      <p>Play Sound: <input type="checkbox" id="playSound" /></p>
    </div>
  )
}

export default Settings;