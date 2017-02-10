import sounds from '../index';

class Entity {
  constructor(props) {
    this.x = 0;
    this.y = 0;
    this.maxHp = props['maxHp'] || 0;
    this.hp = props['hp'] || this.maxHp;
    this.atk = props['atk'] || 0;
    this.def = props['def'] || 0;
    this.type = props['type'] || 'entity';
    this.genre = props['genre'] || 'any';
    this.name = props['name'] || '';
    this.tileClass = props['tileClass'] || '';
    this.map = null;
    this.iswalkable = props['isWalkable'] || false;
    this.isDestructible = props['isDestructible'] || false;
  }
  //Standard getters
  getX() {
    return this.x;
  }

  getY() {
    return this.y;
  }

  getCoords() {
    return this.coords;
  }

  getMaxHp() {
    return this.maxHp;
  }

  getHp() {
    return this.hp;
  }

  getAtk() {
    return this.atk;
  }

  getDef() {
    return this.def;
  }

  getType() {
    return this.type;
  }

  getGenre() {
    return this.genre;
  }

  getName() {
    return this.name;
  }

  getTileClass() {
    return this.tileClass;
  }

  getMap() {
    return this.map;
  }

  //Standard setters

  setX(x) {
    this.x = x;
  }

  setY(y) {
    this.y = y;
  }

  updateCoords() {
    this.coords = `${this.x}-${this.y}`;
  }

  setMap(map) {
    this.map = map;
  }
}

//Actors, player and mobs
class Actor extends Entity {
  constructor(props) {
    super(props);
    this.lvl = props['lvl'] || 1;
    this.xp = props['xp'] || 0;
    this.xpToLvlUp = props['xpToLvlUp'] || 0;
    this.atkBonus = 0;
    this.defBonus = 0;
    this.potions = [];
    this.weapon = [];
    this.armor = [];
    this.shield = [];
  }
  //Standard getters
  getTotalDef() {
    return this.def + this.defBonus;
  }

  getTotalAtk() {
    return this.atk + this.atkBonus;
  }

  getLvl() {
    return this.lvl;
  }

  getXp() {
    return this.xp;
  }

  getXpTolvlUp() {
    return this.xpToLvlUp;
  }
  //Actors actions
  updateXp(target, xp) {
    target.xp += xp;
    if(target.getGenre() === "player") {
      while(target.xp >= target.getXpTolvlUp()) { 
        sounds.lvlUp.currentTime = 0;
        sounds.lvlUp.play();
        target.lvl += ~~(target.xp / target.getXpTolvlUp());
        target.xpToLvlUp *= 2;
        target.atk += 1;
        target.def += 1;
        target.maxHp += 2;
      }
    }
  }

  attack(target) {
    let atk = this.getTotalAtk();
    let defense = this.getTotalDef();
    let max = Math.max(0, atk - defense);
    target.takeDamage(this, 1 + ~~(Math.random() * max)); 
  }

  takeDamage(target, damage) {
    this.hp -= damage;
    if(this.getHp() <= 0) {
      this.updateXp(target, this.getXp());
      this.map.removeEntity(this);
    }
  }

  pickItem(item) {
    switch(item.getGenre()) {
      case "potion" :
        sounds.potion.currentTime = 0;
        sounds.potion.play();
        this.potions.push(item);
        this.map.removeEntity(item);
        break;
      case "weapon" :
        sounds.pickWeapon.currentTime = 0;
        sounds.pickWeapon.play(); 
        if(this.weapon.length !== 0) {
          this.switchEquipment(this.weapon, item);
        } else {
          this.weapon.push(item);
          item.use(this);
          this.map.removeEntity(item);
        }
        break;
      case "armor" :
        sounds.pickArmor.currentTime = 0;
        sounds.pickArmor.play();
        if(this.armor.length !== 0) {
          this.switchEquipment(this.armor, item);
        } else {
          this.armor.push(item);
          item.use(this);
          this.map.removeEntity(item);
        }
        break;
      case "shield" :
        sounds.pickShield.currentTime = 0;
        sounds.pickShield.play();
        if(this.shield.length !== 0) {
          this.switchEquipment(this.shield, item);
        } else {
          this.shield.push(item);
          item.use(this);
          this.map.removeEntity(item);
        }
        break;
      default:
    }
  }

  drinkPotion() {
    if(this.potions.length > 0) {
      if(this.getHp() < this.getMaxHp()) {
        sounds.potion.currentTime = 0;
        sounds.potion.play();
        this.potions[0].use(this);
        this.potions.splice(0, 1);
      }
    }
  }

  switchEquipment(slot, next) {
    let current = slot[0];
    let x = next.getX();
    let y = next.getY();
    current.setX(x);
    current.setY(y);
    current.drop(this);
    slot.splice(0, 1);
    slot.push(next);
    next.use(this);
    let index = this.map.entities.indexOf(next);
    this.map.entities.splice(index, 1, current);
  }

  tryMove(x, y, map) {
    let tile = map.getTileAt(x, y);
    let entity = map.getEntityAt(x, y);
    let destructible = false;
    if(entity) {
      destructible = entity.isDestructible;
    }
    if(tile.isWalkable && (!entity || !destructible)) {
      this.setX(x);
      this.setY(y);
    }
    if(entity && !destructible) {
      this.pickItem(entity);
    }
    if(destructible) {
      sounds.attack.currentTime = 0;
      sounds.attack.play();
      this.attack(entity);
      if(entity.getHp() > 0) {
        entity.attack(this);
      }
    }
  } 
}

//Items
class Item extends Entity {

  use(user) {
    user.hp += this.hp;
    user.hp = Math.min(user.getMaxHp(), user.hp);
    user.atkBonus += this.atk;
    user.defBonus += this.def;
  }

  drop(user) {
    user.atkBonus -= this.atk;
    user.defBonus -= this.def;
  }

}

export {Entity, Actor, Item};