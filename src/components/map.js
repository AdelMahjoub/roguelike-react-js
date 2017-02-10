import Templates from './templates';
import {Entity, Actor, Item} from './entity';
import ROT from 'rot-js';


const rows = 100; //Dungeon map height
const columns = 100; //Dungeon map width

//The dungeon container, map, entities a,d utility methods 
const dungeon = {
  map: [],
  width: columns,
  height: rows,
  entities: [],
  foes: 50,
  potions: ~~(50 / 3),
  init() {
    let foes = 50;
    let potions = ~~(foes / 3)
    this.buildMap();
    this.getRidOfUnecessaryWalls();
    this.generateEntities(Templates.goblin, foes);
    this.generateEntities(Templates.healthPotion, potions);
    this.generateEntities(Templates.longSword,1);
    this.generateEntities(Templates.leatherArmor,1);
    this.generateEntities(Templates.warriorShield,1);
    this.generateEntities(Templates.youngDragon,1);
  },
  reset() {
    this.map = [];
    this.entities = [];
  },
  //Generate a random map with rot-js and store it in a 2d array 
  buildMap() {
    for(let x = 0; x < columns; x++) {
      this.map[x] = [];
      for(let y = 0; y < rows; y++) {
        this.map[x][y] = 0;
      }
    }
    const digger = new ROT.Map.Uniform(columns, rows);
    digger.create((x, y, v) => {
      let tile = {};
      tile.x = x;
      tile.y = y;
      tile.class = null;
      tile.coords = `${x}-${y}`;
      tile.isWalkable = false;
      if(v === 1) {
        tile.class = "tile-wall";
      } else {
        tile.class = "tile-ground";
        tile.isWalkable = true;
      }
      this.map[x][y] = tile;
    });
  },
  //Check if a tile is adjacent to a walkable tile, needed to get rid of useless walls
  isAdjacentToGround(x, y) {
    let withinRange = ( x >= 0 && y >= 0 && x < this.width && y < this.height);
    if(!withinRange) {
        return false;
    }
    for(let w = -1; w < 2; w++) {
        if((x + w) < 0 || (x + w) >= this.width) {
            continue;
        }
        for(let h = - 1; h < 2; h++) {
            if((y + h) < 0 || (y + h) >= this.height) {
                continue;
            }
            if( w !== 0 || h !== 0) {
                let tile = this.map[x + w][y + h];
                if(tile.isWalkable) {
                    return true;
                }
            }
        }
    }
    return false;
  },
  //Replace walls tiles with null tiles, a null tile is a tile with just a background color and no sprite
  getRidOfUnecessaryWalls() {
    for(let x = 0; x < this.width; x++) {
      for(let y = 0; y < this.height; y++) {
          if(!this.isAdjacentToGround(x, y)) {
              let tile = this.map[x][y];
              tile.class = "tile-null";
          }
      }
    }
  },
  //return a tile properties at a given x and y position
  getTileAt(x, y) {
    let withinRange = ( x >= 0 && y >= 0 && x < this.width && y < this.height);
    if(withinRange) {
        return this.map[x][y];
    }
    return false;
  },
  //return an entity for a given x and y position
  getEntityAt(x, y) {
    for(let i = 0; i < this.entities.length; i++) {
      let entity = this.entities[i];
      if(entity.getX() === x && entity.getY() === y){
        return entity;
      }
    }
    return false;
  },
  //return a random floor position
  getRandomFloorPosition() {
    let x, y;
    do {
      x = ~~(Math.random() * this.width);
      y = ~~(Math.random() * this.height);
    } while(!this.isEmptyFloor(x, y));
    return {x: x, y: y};
  },
  //check if a position is empty
  isEmptyFloor(x, y) {
    let tile = this.map[x][y];
    let entity = this.getEntityAt(x, y);
    let walkable = tile.isWalkable;
    return walkable && !entity;
  },
  addEntity(entity) {
    if( entity.getX() < 0 || entity.getX() >= this.width ||
        entity.getY() < 0 || entity.getY() >= this.height
      ) {
            throw new Error("Adding entity out of bounds.")
        }
    entity.setMap(this);
    this.entities.push(entity);
  },
  addEntityAtRandomPosition(entity) {
    let position = this.getRandomFloorPosition();
    entity.setX(position.x);
    entity.setY(position.y);
    this.addEntity(entity);
  },
  removeEntity(entity) {
    for(let i = 0; i < this.entities.length; i++) {
        if(entity === this.entities[i]) {
            this.entities.splice(i, 1);
            break;
        }
    }
  },
  generateEntities(template, number) {
    for(let i = 0; i < number; i++) {
      let entity;
      switch(template.type) {
          case "actor":
              entity = new Actor(template);
              this.addEntityAtRandomPosition(entity);
              break;
          case "item":
              entity = new Item(template);
              this.addEntityAtRandomPosition(entity);
              break;
          default:
              entity = new Entity(template);
              this.addEntityAtRandomPosition(entity);
              break;
      }
    }
  }
}

export default dungeon;