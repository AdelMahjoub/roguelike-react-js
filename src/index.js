import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

let assetsToLoad = [];
let assetsLoaded = 0;

const sounds = {
  attack: document.querySelector("#attack"),
  enterDungeon: document.querySelector("#enter-dungeon"),
  lvlUp: document.querySelector("#lvl-up"),
  pickArmor: document.querySelector("#pick-armor"),
  pickShield: document.querySelector("#pick-shield"),
  pickWeapon: document.querySelector("#pick-weapon"),
  potion: document.querySelector("#potion"),
  toggleHelp: document.querySelector("#toggle-help"),
};

window.onload = () => {
  const loadHandler = () => {
    assetsLoaded++;
    if(assetsLoaded >= assetsToLoad.length) {
      for(let key in sounds) {
        if(sounds.hasOwnProperty(key)){
          sounds[key].removeEventListener("canplaythrough", loadHandler, false);
        }
      }
      ReactDOM.render(
        <App />,
        document.getElementById('root')
      );
    }
  }

  for(let key in sounds) {
    if(sounds.hasOwnProperty(key)) {
      sounds[key].addEventListener("canplaythrough", loadHandler, false);
      sounds[key].load();
      assetsToLoad.push(sounds[key]);
    }
  }
}

export default sounds;

