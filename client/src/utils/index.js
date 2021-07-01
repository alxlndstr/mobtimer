const msToTimeString = ms => {
  const minutes = Math.floor(ms / 60000);
  const seconds = (ms % 60000) / 1000;
  return `${minutes ? `${minutes}:` : ''}${seconds<10 ? `0${seconds}` : seconds}`
}

export default msToTimeString;