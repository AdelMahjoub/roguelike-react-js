import React from 'react';

const barWidth = 100;

const UiRight = (props) => {
  return (
    <div className="ui-right">
      <HpBar hp={props.hp} maxHp={props.maxHp}/>
      <XpBar xp={props.xp} nextXp={props.nextXp} lvl={props.lvl}/>
      <PlayerStats atk={props.atk} def={props.def}/>
      <Inventory 
      weaponSprite={props.weapon}
      armorSprite={props.armor}
      shieldSprite={props.shield}
      potions={props.potions}
      weaponName={props.weaponName}
      armorName={props.armorName}
      shieldName={props.shieldName}
      />
      <InfoTab entity={props.entity}/>
    </div>
  )
}

const UiTop= (props) => {
  return (
    <div className="ui-top">
      <div className="stat-container">
        <button className="btn" title="github">
          <a href="https://github.com/AdelMahjoub/roguelike-react-js" target="_blank">
            <i className="fa fa-github" aria-hidden="true"></i>
          </a>
        </button>
        {" "}
        <button className="btn" title="free code camp">
          <a href="https://www.freecodecamp.com/adelmahjoub" target="_blank">
          <i className="fa fa-free-code-camp" aria-hidden="true"></i>
          </a>
        </button>
        {" "}
        <button className="btn" title="codepen">
          <a href="https://codepen.io/SultanCodeCamper/full/MJBMeV/" target="_blank">
            <i className="fa fa-codepen" aria-hidden="true"></i>
          </a>
        </button>
      </div>
    </div>
  )
}

const UiBottom = (props) => {
  return (
    <div className="ui-bottom">
    <div className="stat-container">
      <p className="ui-stats-info">[Arrow Keys] to move around.</p>
    </div>
     <div className="stat-container">
      <p className="ui-stats-info">[P] to drink a potion.</p>
    </div>
    <div className="stat-container">
      <p className="ui-stats-info">[F] to toggle darkness.</p>
    </div>
    <div className="stat-container">
      <p className="ui-stats-info">Walk through an item to pick it, walk into a mob to strike it.</p>
    </div>
    <div className="stat-container">
      <p className="ui-stats-info">Hover the mouse cursor over an entity to show target info.</p>
    </div>
    </div>
  )
}

const UiCenter = (props) => {
  return (
    <div className="ui-center">
      {props.children}
    </div>
  )
}

const HpBar = (props) => {
  let widthRation = props.hp / props.maxHp;
  let style = {
    width: `${barWidth * widthRation}px`
  }
  return (
    <div className="stat-container">
      <span className="ui-stats-info">
        HP 
      </span>
      {" "}
      <span className="ui-stats-info">
        {`${props.hp} / ${props.maxHp}`}
      </span>
      <div className="hp-bar-outer">
        <div className="hp-bar-inner" style={style}/>
      </div>
    </div>
  )
}

const XpBar = (props) => {
  let widthRation = props.xp / props.nextXp;
  let style = {
    width: `${barWidth * widthRation}px`
  }
  return (
    <div className="stat-container">
      <span className="ui-stats-info">
        LVL 
      </span>
      {" "}
      <span className="ui-stats-info">
        {props.lvl}
      </span>
      <div className="xp-bar-outer">
        <div className="xp-bar-inner" style={style}/>
      </div>
      <span className="ui-stats-info">
        XP 
      </span>
      {" "}
      <span className="ui-stats-info">
        {`${props.xp} / ${props.nextXp}`}
      </span>
    </div>
  )
}

const PlayerStats = (props) => {
  return (
    <div className="stat-container">
      <span className="ui-stats-info">
      ATK
      </span>
      {" "}
      <span className="ui-stats-info">
      {props.atk}
      </span>
      <br />
      <span className="ui-stats-info">
      DEF
      </span>
      {" "}
      <span className="ui-stats-info">
      {props.def}
      </span>
    </div>
  )
}

const InfoTab = (props) => {
  return (
    <div className="stat-container">
      <br />
      <span className="ui-stats-info">
      -- Target Info --
      </span>
      <br />
      <span className="ui-stats-info">
      {props.entity ? props.entity.name.toUpperCase() : ""}
      </span>
      <br />
      <span className="ui-stats-info">
      {props.entity ? `HP ${props.entity.hp}` : ""}
      </span>
      <br />
      <span className="ui-stats-info">
      {props.entity ? `ATK ${props.entity.atk}` : ""}
      </span>
      <br />
      <span className="ui-stats-info">
      {props.entity ? `DEF ${props.entity.def}` : ""}
      </span>
      <br />
      <span className="ui-stats-info">
      {props.entity ? `XP ${props.entity.xp ? props.entity.xp : 0}` : ""}
      </span>
      <br />
      <span className="ui-stats-info">
      -----------------
      </span>
    </div>
  )
}

const Inventory = (props) => {
  return (
    <div className="stat-container">

      <div className="inventory-row">
        <div className={`equipment-slot ${props.weaponSprite}`}/>
        <span className="ui-stats-info">
          {props.weaponName || "no weapon"}
        </span>
      </div>

      <div className="inventory-row">
        <div className={`equipment-slot ${props.armorSprite}`}/>
        <span className="ui-stats-info">
          {props.armorName || "no armor"}
        </span>
      </div>

      <div className="inventory-row">
        <div className={`equipment-slot ${props.shieldSprite}`}/>
        <span className="ui-stats-info">
          {props.shieldName || "no shield"}
        </span>
      </div>

      <div className="inventory-row">
        <div className="equipment-slot tile-health-potion"/>
        <span className="ui-stats-info">
          {`x${props.potions || 0}`}
        </span>
      </div>
    </div>
  )
}

export {UiTop, UiBottom, UiRight, UiCenter}

