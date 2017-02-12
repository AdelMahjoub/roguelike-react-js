import React from 'react';
import { UiTop, UiBottom, UiRight, UiCenter, HpBarTiny } from './components/ui';
import Templates from './components/templates';
import { Actor } from './components/entity';
import dungeon from './components/map';
import StartScreen from './components/startScreen';
import EndScreen from './components/endScreen';
//styles
import './css/reset.css';
import './scss/App.scss';
//assets
import './assets/img/spritesTilesSheet.png';
import sounds from './index';

//
const width = 640; //Play screen width
const height = 480; //Play screen height
const tileSize = 32; //Sprite image width and height

//A visual representation of an entity, ground, wall, item, player etc 
const Tile = (props) => {
  let style = {
    top: props.y * tileSize,
    left: props.x * tileSize,
    opacity: props.opacity,
    color: "white"
  }
  return (
    <span
      style={style}
      id={props.coords}
      className={props.tile}
    >
    {props.hpBar}
    </span>
  );
}

//Initialize the dungeon, generate map etc
dungeon.init();

//Initialize the player
let player = new Actor(Templates.player);
dungeon.addEntityAtRandomPosition(player);

//Camera object, used to scroll through the dungeon map
const camera = {
  x: 0,
  y: 0,
  width: ~~(width / tileSize),
  height: ~~(height / tileSize),
  update() {
    this.x = Math.max(0, player.x - ~~(this.width / 2));
    this.y = Math.max(0, player.y - ~~(this.height / 2));
    this.x = Math.min(this.x, ~~(dungeon.map.length - this.width));
    this.y = Math.min(this.y, ~~(dungeon.map[0].length - this.height));
  }
}

//Return a visual representation of the dungeon map, darkness and entities 
const PlayScreen = function(props) {
  let screenMap = []; // Floors and walls, displayed section macth the camera dimensions
  let screenEntities = []; //Entities, displayed entities within the camera boundries 
  for(let i = 0; i < camera.width; i ++) {
    screenMap[i] = [];
    screenEntities[i] = [];
    for(let j = 0; j < camera.height; j++) {
      let tile = dungeon.map[props.x + i][props.y + j];
      let entity = dungeon.getEntityAt(props.x + i, props.y + j);
      screenMap[i][j] = tile;
      screenEntities[i][j] = entity;
    }
  }
  //darkness / fog of war
  let isVisible = props.fogIsVisible;
  let radius = 8;
  let fog = [];
  for(let x = 0; x < camera.width; x++) {
    fog[x] = [];
    for(let y = 0; y < camera.height; y++) {
      let vx = dungeon.map[props.x + x][props.y + y].x - player.x;
      let vy = dungeon.map[props.x + x][props.y + y].y - player.y;
      let distance = Math.sqrt(vx * vx + vy * vy);
      let opacity;
      if(distance <= radius) {
        opacity = distance / radius;
      } else {
        opacity = 1;
      }
      fog[x][y] = opacity;
    }
  }
  return(
    <div className="screen" onMouseMove={props.handleMouseMove}>
      {
      //render the dungeon map
        screenMap.map((array, x) => {
          return array.map((value, y) => {
            return (
              <Tile
              key={value.coords}
              x={x}
              y={y}
              tile={value.class}
              />
            )
          })
        })
      }

      {
      //render entities
        screenEntities.map((array, x) => {
        return array.map((entity, y) => {
            return (
              entity &&
              <Tile
              key={`${entity.getName()}-${entity.getX()}-${entity.getY()}`}
              x={x}
              y={y}
              tile={entity.tileClass}
              hpBar={
                entity.getGenre() === ("mob") || entity.getGenre() === ("boss")
                ?
                <HpBarTiny
                hp={entity.getHp()}
                maxHp={entity.getMaxHp()}
                y={y}
                />
                :
                ""
              }
              />
            )
          })
        })
      }
      {
      //render darkness / fog of war
        isVisible &&
        fog.map((array, x) => {
        return array.map((value, y) => {
            return (
              <Tile 
              key={`fog-${x}-${y}`}
              x={x}
              y={y}
              tile={"tile-null"}
              opacity={value}
              />
            )
          })
        })
      }
    </div>
  );
}

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      //Camera top left corner, 
      //Camera position is relative to player position,
      //Whenever the player moves the camera position is updated
      //When the camera position is updated the screen component is rendered
      topX: 0,
      topY: 0,
      mouseTarget: null,
      darkness: true,
      startScreen: true,
      playScreen: false,
      endScreen: false,
      win: false
    };
    this.mounted = false; //Become true at first mount
    this.update = this.update.bind(this);
    this.handleMouseMove = this.handleMouseMove.bind(this);
  }
  //Move the player and update the camera position
  //Drink a potion, toggle darkness
  update(e) {
    let dx = 0, dy = 0;
    switch(e.keyCode) {
      //Up arrow key
      case 38:
        dy = -1; //Move up
        break;
      //Down arrow key
      case 40:
        dy = 1;  //Move down
        break;
      //Right arrow key
      case 39:
        dx = 1;  //Move right
        break;
      //Left arrow key
      case 37:
        dx = -1;  //Move left
        break;
      //[P] key
      case 80:
        player.drinkPotion();
        this.setState({})
        break;
      //[F] key
      case 70:
        //Toggle darkness
        this.setState((prevState) => ({
          darkness: !prevState.darkness
        }))
        break;
      //Return key
      case 13:
        if(this.state.startScreen || this.state.endScreen) {
          this.setState({
            startScreen: false,
            playScreen: true,
            endScreen: false,
            win: false
          });
          sounds.enterDungeon.currentTime = 0;
          sounds.enterDungeon.play();
        }
        break;
      default:
    }
    //Move the player 
    if(dx !== 0 || dy !== 0) {
      let newX = player.x + dx;
      let newY = player.y + dy;
      player.tryMove(newX, newY, dungeon);
      //If player loose
      if(player.hp <= 0 || player.win) {
        //Game over screen
        this.setState({
          startScreen: false,
          playScreen: false,
          endScreen: true,
        });
        if(player.win) {
          this.setState({win: true});
        }
        //reset the game
        dungeon.map = [];
        dungeon.entities = [];
        dungeon.init();
        player = new Actor(Templates.player);
        dungeon.addEntityAtRandomPosition(player);
      }
      //update the camera position
      camera.update();
      this.setState({
        topX: camera.x,
        topY: camera.y
      });
    }
  }

  //Show info about the entity under the mouse cursor
  handleMouseMove(e) {
    //target the screen(parent div) not the tiles(span tags)
    //and get its relative position 
    let offsetX = e.target.parentElement.getBoundingClientRect().left;
    let offsetY = e.target.parentElement.getBoundingClientRect().top;
    //Mouse position
    let mouseX = e.clientX;
    let mouseY = e.clientY;
    //Convert pixels position into indexes
    let entityX = ~~((mouseX - offsetX) / tileSize) + this.state.topX;
    let entityY = ~~((mouseY - offsetY) / tileSize)+ this.state.topY;
    //Find the entity under the mouse cursor
    for(let i = 0; i < dungeon.entities.length; i++) {
      let entity = dungeon.entities[i];
      let x, y;
      if(entity) {
        x = entity.getX();
        y = entity.getY();
        if(entityX === x && entityY === y) {
          this.setState({mouseTarget: entity})
        }
      }
    }
  }

  componentDidMount() {
    //first mount initialize the camera
    if(!this.mounted) {
      camera.update();
      this.setState({
      topX: camera.x,
      topY: camera.y
     });
    }
    window.addEventListener("keydown", this.update);
    document.getElementById("root").focus();
  }

  componentWillUnmount() {
    window.removeEventListener("keydown", this.update);
  }
 
  render() {
    return (
        <div className="container">
          <UiTop />
          <UiCenter>
            {
              this.state.startScreen &&

              <StartScreen />
            }
            {
              this.state.playScreen &&
              <PlayScreen 
              x={this.state.topX}
              y={this.state.topY}
              fogIsVisible={this.state.darkness}
              handleMouseMove={this.handleMouseMove}
              />
            }
            {
              this.state.endScreen &&

              <EndScreen win={this.state.win}/>
            }
            <UiRight 
              hp={player.getHp()}
              maxHp={player.getMaxHp()}
              def={player.getTotalDef()}
              atk={player.getTotalAtk()}
              xp={player.getXp()}
              nextXp={player.getXpTolvlUp()}
              lvl={player.getLvl()}
              potions={player.potions.length}
              weapon={player.weapon.length !== 0 ? player.weapon[0].tileClass : ""}
              armor={player.armor.length !== 0 ? player.armor[0].tileClass : ""}
              shield={player.shield.length !== 0 ? player.shield[0].tileClass : ""}
              weaponName={player.weapon.length !== 0 ? player.weapon[0].getName() :  null}
              armorName={player.armor.length !== 0 ? player.armor[0].getName() : null}
              shieldName={player.shield.length !== 0 ? player.shield[0].getName() : null}
              entity={this.state.mouseTarget}
            />
          </UiCenter>
          <UiBottom />
        </div>
    );
  }
}

export default App;
