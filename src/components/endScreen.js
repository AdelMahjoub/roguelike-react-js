import React from 'react';

const EndScreen = (props) => {
  let win = props.win;
  console.log(win)
  return(
    <div className={win ? `win-screen` : `end-screen`}>
      <p>{win ? `You sent those fiends to where they belong,` : `A brave warrior has fallen,`}</p>
      <p>{win ? `Congratulations, you beat the dungeon.` : `A new trophy to the Dungeon Lord.`}</p>
      <br />
      <p>Press [ENTER] to retry.</p>
    </div>
  )
}

export default EndScreen;