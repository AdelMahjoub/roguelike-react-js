const Templates = {
    player: {
        tileClass: "tile-player",
        type: "actor",
        name: "you",
        genre: "player",
        maxHp: 40,
        atk: 2,
        def: 1,
        xp: 0,
        xpToLvlUp: 50,
        isDestructible: true
    },
    goblin: {
        tileClass: "tile-goblin",
        type: "actor",
        name: "goblin",
        genre: "mob",
        maxHp: 15,
        atk: 2,
        def: 1,
        xp: 10,
        isDestructible: true
    },
    youngDragon: {
        tileClass: "tile-dragon",
        type: "actor",
        name: "young dragon",
        genre: "boss",
        maxHp: 50,
        hp: 50,
        xp: 100,
        atk: 10,
        def: 5,
        isDestructible: true
    },
    healthPotion: {
        tileClass: "tile-health-potion",
        type: "item",
        name: "health potion",
        genre: "potion",
        hp: 20
    },
    longSword: {
        tileClass: "tile-long-sword",
        type: "item",
        name: "long sword",
        genre: "weapon",
        atk: 1,
        def: 0,
        hp: 0,
    },
    leatherArmor: {
        tileClass: "tile-leather-armor",
        type: "item",
        name: "leather armor",
        genre: "armor",
        def: 1,
        atk: 0,
        hp: 0,
    },
    warriorShield: {
        tileClass: "tile-warrior-shield",
        type: "item",
        name: "warrior shield",
        genre: "shield",
        def: 1,
        atk: 0,
        hp: 0
    }
}

export default Templates;