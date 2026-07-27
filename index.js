/*
 *
 *  Paradise/Inputs
 *  Declan Tyson
 *  v0.0.21
 *  06/02/2018
 *
 */

const actions = {
  38: 'up',
  40: 'down',
  37: 'left',
  39: 'right',
  32: 'action',
  27: 'back',
};

window.addEventListener('keydown', e => {
  if (!actions[e.keyCode] || !window.game) return;
  window.game.sendInput(actions[e.keyCode]);
});

window.addEventListener('keyup', e => {
  if (!window.game) return;
  window.game.sendInput(null);
});

const handlePointerEvent = e => {
  if (!window.game || !window.game.scene || !window.game.scene.handlePointer) return;

  const canvas = window.game.renderer.canvas;
  const rect = canvas.getBoundingClientRect();
  const clientX = e.touches ? e.touches[0].clientX : e.clientX;
  const clientY = e.touches ? e.touches[0].clientY : e.clientY;
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;

  window.game.scene.handlePointer(
    (clientX - rect.left) * scaleX,
    (clientY - rect.top) * scaleY
  );
};

window.addEventListener('mousedown', handlePointerEvent);
window.addEventListener('touchstart', handlePointerEvent);

/*
 *
 *  Paradise/Util
 *  Declan Tyson
 *  v0.0.53
 *  16/02/2018
 *
 */

class Util {
  static dieRoll(sides) {
    return Math.floor(Math.random() * sides);
  }

  static pickRandomProperty(obj) {
    let result,
      count = 0;

    for (let prop in obj) {
      if (Math.random() < 1 / ++count) result = prop;
    }
    return result;
  }

  static log(str) {
    let log = document.getElementById('log');
    log.innerHTML += `${str}<hr/>`;
    log.scrollTop = log.scrollHeight;
  }

  static clearLog() {
    document.getElementById('log').innerHTML = '';
  }

  static capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
}

/*
 *
 *  Paradise/Constants
 *  Declan Tyson
 *  v0.0.66
 *  27/04/2018
 *
 */

const colours = {
  black: '#000000',
  white: '#FFFFFF',
  green: '#00AA00',
  blue: '#0000AA',
  brown: '#4f1f0b',
  darkbrown: '#291006',
  grey: '#cdcdcd',
  red: '#ff0000',
  fuschia: '#ff00ff',
  gold: '#ffc14b',
};

const directions = {
  up: 'up',
  down: 'down',
  left: 'left',
  right: 'right',
};

const genders = {
  male: 'M',
  female: 'F',
  alien: 'A',
};

const posessivePronouns = {
  M: 'his',
  F: 'her',
  A: 'xleir',
};

const relationships = {
  acquaintance: 'Acquaintace',
  wife: 'Wife',
  husband: 'Husband',
  sister: 'Sister',
  brother: 'Brother',
  mother: 'Mother',
  father: 'Father',
  daughter: 'Daughter',
  son: 'Son',
  friend: 'Friend',
  closefriend: 'Close Friend',
  roommate: 'Roommate',
};

const pairedRelationships = [
  relationships.wife,
  relationships.husband,
  relationships.roommate,
];

/*
 *
 *  Paradise/Item
 *  Declan Tyson
 *  v0.0.22
 *  06/02/2018
 *
 */

class Item {
  constructor(name, description) {
    this.name = name;
    this.description = description;
    this.colour = colours.black;
  }
}

/*
 *
 *  Paradise/Settings
 *  Declan Tyson
 *  v0.0.98
 *  06/05/2020
 *
 */

let _settings = {
  fps: 45,
  actionTimeoutLimit: 2,
  renderMode: 'orthographic',
  terrain: {
    tileSize: 20,
    tilesWide: 50,
    tilesHigh: 28,
    isoTileWidth: 40,
    isoTileHeight: 40,
  },
  character: {
    spriteSize: 40,
    frameSize: 64,
    frameCount: 9,
    stepsPerTile: 5,
  },
  encounter: {
    spriteSize: 60,
    spriteSpacing: 30,
  },
  personCount: 4,
  defaultInhabitanceSize: 2,
  loadingScreen: '/oob/loading.png',
  minLoadingTime: 2000,
  fonts: {
    large: '24px "Roboto Condensed"',
    small: '16px "Roboto"',
    death: '24px "Permanent Marker"',
  },
};

const settings = {
  get: setting => {
    return _settings[setting];
  },

  set: (setting, value) => {
    _settings[setting] = value;
  },

  canvasProperties: () => {
    return _settings.canvasProperties;
  },

  tileStep: () => {
    const terrain = _settings.terrain;
    const character = _settings.character;
    return terrain.tileSize / character.stepsPerTile;
  },

  portraitWidth: () => {
    return settings.canvasProperties().width / 2;
  },
};

settings.set('canvasProperties', {
  width: _settings.terrain.tileSize * _settings.terrain.tilesWide,
  height: _settings.terrain.tileSize * _settings.terrain.tilesHigh,
  centerPoint: {
    x:
      _settings.terrain.tileSize * _settings.terrain.tilesWide / 2 - _settings.terrain.tileSize / 2,
    y:
      _settings.terrain.tileSize * _settings.terrain.tilesHigh / 2 - _settings.terrain.tileSize / 2,
  },
});

settings.set('interactionTextArea', {
  x: 0,
  y: 0,
  width: _settings.canvasProperties.width / 2,
  height: _settings.canvasProperties.height,
  background: colours.black,
  alpha: 0.4,
  badgeOffsetX: 20,
  badgeOffsetY: 40,
  optionsOffsetX: 40,
  optionsOffsetY: 100,
  optionHeight: 36,
  lineHeight: 22,
  lineLength: 60,
});

settings.set('encounterTextArea', {
  x: 0,
  y: _settings.canvasProperties.height - _settings.canvasProperties.height / 4,
  width: _settings.canvasProperties.width,
  height: _settings.canvasProperties.height / 4,
  background: colours.black,
  alpha: 0.4,
  optionsOffsetX: 40,
  optionsOffsetY: 40,
  optionHeight: 36,
  lineHeight: 22,
  lineLength: 60,
});

/*
 *
 *  Paradise/Player
 *  Declan Tyson
 *  v0.0.92
 *  21/10/2019
 *
 */

class Player {
  constructor() {
    this.colour = colours.black;
    this.direction = directions.down;
    this.stepX = 0;
    this.stepY = 0;

    let sprite_test = new Image(),
      spriteMap_test = {};

    sprite_test.src = '/oob/char_test.png';
    spriteMap_test[directions.up] = 0;
    spriteMap_test[directions.down] = 128;
    spriteMap_test[directions.left] = 64;
    spriteMap_test[directions.right] = 192;

    this.spriteMap = spriteMap_test;
    this.sprite = {
      image: sprite_test,
      x: 0,
      y: 128,
    };
  }

  advanceFrame() {
    const character = settings.get('character');
    let newSpriteX = this.sprite.x + character.frameSize;
    if (newSpriteX >= character.frameSize * character.frameCount) {
      newSpriteX = 0;
    }

    this.sprite.x = newSpriteX;
  }

  resetSprite() {
    this.sprite.x = 0;
  }

  setPlacement(x, y, init = false) {
    const character = settings.get('character');
    if (x !== this.x) {
      if (this.stepX >= character.stepsPerTile || this.stepX < 0 || init) {
        this.x = x;
        if (this.stepX >= character.stepsPerTile) this.stepX = 0;
        if (this.stepX < 0) this.stepX = character.stepsPerTile - 1;
      } else {
        if (x > this.x) this.stepX++;
        if (x < this.x) this.stepX--;
      }
    }

    if (y !== this.y) {
      if (this.stepY >= character.stepsPerTile || this.stepY < 0 || init) {
        this.y = y;
        if (this.stepY >= character.stepsPerTile) this.stepY = 0;
        if (this.stepY < 0) this.stepY = character.stepsPerTile - 1;
      } else {
        if (y > this.y) this.stepY++;
        if (y < this.y) this.stepY--;
      }
    }
  }

  setDirection(direction) {
    const character = settings.get('character');
    if (direction === directions.left || direction === directions.right) {
      if (this.stepX >= character.stepsPerTile) this.stepX = character.stepsPerTile - 1;
      if (this.stepX < 0) this.stepX = 0;
    } else if (direction === directions.up || direction === directions.down) {
      if (this.stepY >= character.stepsPerTile) this.stepY = character.stepsPerTile - 1;
      if (this.stepY < 0) this.stepY = 0;
    }

    this.direction = direction;
    this.sprite.y = this.spriteMap[direction];
  }
}

/*
 *
 *  Paradise/Terrain
 *  Declan Tyson
 *  v0.0.54
 *  12/02/2018
 *
 */

class Terrain {
  constructor(neighbours, spriteFolder = '/oob') {
    this.encounters = [];
    this.image = false;
    this.spriteFolder = spriteFolder;
    this.fallbackImage = `${this.spriteFolder}/fallback.png`;
    this.neighbours = neighbours;

    this.pickImage(neighbours);
  }

  isPassable() {
    return this.passable;
  }

  hasEncounters() {
    return this.encounters;
  }

  pickImage(neighbours) {
    if (!neighbours || this.spriteFolder === '/oob') return;

    let filename = '';
    Object.keys(neighbours).forEach(neighbourKey => {
      if (filename !== '') filename += '_';
      filename += `${neighbourKey}_${neighbours[neighbourKey]}`;
    });
    filename = filename.toLowerCase();
    this.image = `${this.spriteFolder}/${filename}.png`;
  }
}

class Blank extends Terrain {
  constructor(neighbours) {
    super(neighbours);
    this.id = 'Blank';
    this.passable = false;
    this.colour = colours.black;
  }
}

class Grass extends Terrain {
  constructor(neighbours) {
    super(neighbours, '/oob/Grass');
    this.id = 'Grass';
    this.passable = true;
    this.colour = colours.green;
  }
}

class Water extends Terrain {
  constructor(neighbours) {
    super(neighbours, '/oob/Water');
    this.id = 'Water';
    this.passable = false;
    this.colour = colours.blue;
  }
}

class VerticalRoad extends Terrain {
  constructor(neighbours) {
    super(neighbours, '/oob/VerticalRoad');
    this.id = 'VerticalRoad';
    this.passable = true;
    this.colour = colours.grey;
  }
}

class HorizontalRoad extends Terrain {
  constructor(neighbours) {
    super(neighbours, '/oob/HorizontalRoad');
    this.id = 'HorizontalRoad';
    this.passable = true;
    this.colour = colours.grey;
  }
}

class Wall extends Terrain {
  constructor(neighbours) {
    super(neighbours);
    this.id = 'Wall';
    this.passable = false;
    this.colour = colours.brown;
  }
}

class Doorway extends Terrain {
  constructor(neighbours) {
    super(neighbours);
    this.id = 'Doorway';
    this.passable = true;
    this.colour = colours.darkbrown;
  }
}

class WoodenFloor extends Terrain {
  constructor(neighbours) {
    super(neighbours);
    this.id = 'WoodenFloor';
    this.passable = true;
    this.colour = colours.darkbrown;
  }
}

class CoastalSands extends Terrain {
  constructor(neighbours) {
    super(neighbours);
    this.id = 'CoastalSands';
    this.passable = true;
    this.colour = colours.gold;
  }
}

/*
 *
 *  Paradise/Terrain
 *  Declan Tyson
 *  v0.0.54
 *  16/02/2018
 *
 */

let terrains = {
  Blank: Blank,
  Grass: Grass,
  Water: Water,
  Wall: Wall,
  VerticalRoad: VerticalRoad,
  HorizontalRoad: HorizontalRoad,
  Doorway: Doorway,
  WoodenFloor: WoodenFloor,
  CoastalSands: CoastalSands,
};

/*
 *
 *  Paradise/Scene
 *  Declan Tyson
 *  v0.0.91
 *  21/10/2019
 *
 */

class Scene {
  constructor() {
    this.actions = {
      up: this.empty,
      down: this.empty,
      left: this.empty,
      right: this.empty,
      action: this.empty,
      back: this.empty,
    };
    this.keyHeld = false;
  }

  empty() {
    return null;
  }

  doActions(action) {
    if (!this.game || this.game.loading || !action || !this.actions[action]) return;
    this.game.triggerActionTimeout();

    this.actions[action]();
  }

  draw(ctx) {}

  setGame(game) {
    this.game = game;
  }

  onLoad() {
    console.log('ballsacks');
    // extend this function
  }
}

/*
 *
 *  Paradise/Enemy
 *  Declan Tyson
 *  v0.0.97
 *  06/05/2020
 *
 */

class Enemy {
  constructor(name, health, attack, defence, speed, sprite) {
    this.id = name;
    this.name = name;
    this.health = health;
    this.attack = attack;
    this.defence = defence;
    this.speed = speed;

    let image = new Image();
    image.src = sprite;
    this.sprite = image;
  }

  attack(target) {
    let attackValue = this.attack - target.defence;
    if (attackValue < 0) attackValue = 1;

    target.health -= attackValue;
  }
}

/*
 *
 *  Paradise/Enemies/Slime
 *  Declan Tyson
 *  v0.0.97
 *  06/05/2020
 *
 */

class Slime extends Enemy {
  constructor() {
    super('Slime', 20, 5, 2, 3, '/img/Enemies/slime.png');
    this.colour = colours.green;
  }
}

/*
 *
 *  Paradise/Enemies
 *  Declan Tyson
 *  v0.0.95
 *  06/05/2020
 *
 */

let enemies = {
  Slime,
};

/*
 *
 *  Paradise/Scene-Encounter
 *  Declan Tyson
 *  v0.0.98
 *  06/05/2020
 *
 */

class Encounter extends Scene {
  constructor(worldMap, enemyGroupOptions, scenery) {
    super();

    this.worldMap = worldMap;
    this.enemyGroupOptions = enemyGroupOptions;
    this.enemies = [];
    this.party = window.game.currentParty;
    this.actions.back = this.exit.bind(this);
    this.turnMeters = [];
    this.fullMeterValue = 100;
    this.currentTurn = null;

    let background = new Image();
    background.src = scenery;
    this.scenery = background;

    this.chooseEnemyGroup();
    this.initializeTurnMeters();
  }

  chooseEnemyGroup() {
    let numOptions = this.enemyGroupOptions.length;
    if (numOptions > 1) {
      this.setEnemies(Math.floor(Math.random() * numOptions));
    } else {
      this.setEnemies(0);
    }
  }

  setEnemies(enemyGroupIndex) {
    this.enemyGroupOptions[enemyGroupIndex].forEach(enemy => {
      this.enemies.push(new enemies[enemy]());
    });
  }

  initializeTurnMeters() {
    let topSpeed = 1;
    this.party.forEach(member => {
      if (member.speed > topSpeed) topSpeed = member.speed;
      this.turnMeters.push({
        actor: member,
        fill: 0,
      });
    });

    this.enemies.forEach(enemy => {
      if (enemy.speed > topSpeed) topSpeed = enemy.speed;
      this.turnMeters.push({
        actor: enemy,
        fill: 0,
      });
    });

    this.fullMeterValue *= topSpeed;
  }

  incrementTurnMeters() {
    if (this.currentTurn) return;

    this.turnMeters.forEach(turnMeter => {
      if (this.currentTurn) return;

      turnMeter.fill += turnMeter.actor.speed;
      if (turnMeter.fill > this.fullMeterValue) {
        turnMeter.fill = this.fullMeterValue;
        this.currentTurn = turnMeter;
      }
    });
  }

  draw(ctx) {
    const canvasProperties = settings.canvasProperties();

    ctx.drawImage(this.scenery, 0, 0, canvasProperties.width, canvasProperties.height);

    this.drawParty(ctx);
    this.drawEnemies(ctx);
    this.drawEncounterTextArea(ctx);

    this.incrementTurnMeters();

    this.drawTurnMeters(ctx);
  }

  drawEncounterTextArea(ctx) {
    const encounterTextArea = settings.get('encounterTextArea');
    const fonts = settings.get('fonts');

    ctx.rect(
      encounterTextArea.x,
      encounterTextArea.y,
      encounterTextArea.width,
      encounterTextArea.height
    );
    ctx.fillStyle = encounterTextArea.background;
    ctx.globalAlpha = encounterTextArea.alpha;
    ctx.fill();
    ctx.globalAlpha = 1;

    if(this.currentTurn) {
        ctx.font = fonts.small;
        ctx.fillStyle = colours.white;
        ctx.fillText(
            this.currentTurn.actor.name,
            encounterTextArea.x + encounterTextArea.optionsOffsetX,
            encounterTextArea.y + encounterTextArea.optionHeight
        );
    }
  }

  drawParty(ctx) {
    const canvasProperties = settings.canvasProperties();
    const encounterSettings = settings.get('encounter');

    let startX =
      canvasProperties.width / 4 - encounterSettings.spriteSize - encounterSettings.spriteSpacing;
    let startY = canvasProperties.height / 2;

    this.party.forEach(member => {
      ctx.drawImage(
        member.sprite,
        startX,
        startY,
        encounterSettings.spriteSize,
        encounterSettings.spriteSize
      );

      startX += encounterSettings.spriteSpacing + encounterSettings.spriteSize;
      startY += encounterSettings.spriteSpacing;
    });
  }

  drawEnemies(ctx) {
    const canvasProperties = settings.canvasProperties();
    // TODO: Have multiple settings for the enemies
    const encounterSettings = settings.get('encounter');

    let spaceOfEnemies =
      (encounterSettings.spriteSize + encounterSettings.spriteSpacing) * this.enemies.length -
      encounterSettings.spriteSpacing;

    let startX = canvasProperties.width / 2 + (canvasProperties.width / 4 - spaceOfEnemies / 2);
    let startY = canvasProperties.height / 2;

    this.enemies.forEach(enemy => {
      ctx.drawImage(
        enemy.sprite,
        startX,
        startY,
        encounterSettings.spriteSize,
        encounterSettings.spriteSize
      );

      startX += encounterSettings.spriteSpacing + encounterSettings.spriteSize;
      startY += encounterSettings.spriteSpacing;
    });
  }

  drawTurnMeters(ctx) {
      const canvasProperties = settings.get('canvasProperties');
      const encounterTextArea = settings.get('encounterTextArea');
      const fonts = settings.get('fonts');

      let startX = canvasProperties.width / 2 + encounterTextArea.optionsOffsetX;
      let startY = encounterTextArea.y + encounterTextArea.optionsOffsetY;

      this.turnMeters.forEach(turnMeter => {
          ctx.font = fonts.small;
          ctx.fillStyle = colours.white;
          ctx.fillText(
              turnMeter.actor.name,
              startX,
              startY
          );

          ctx.fillStyle = colours.green;
          ctx.fillRect(
            startX + encounterTextArea.lineLength,
            startY - encounterTextArea.lineHeight / 2,
            (turnMeter.fill / this.fullMeterValue) * 100,
            encounterTextArea.lineHeight / 2
          );
          ctx.strokeStyle = colours.white;
          ctx.strokeRect(
              startX + encounterTextArea.lineLength - 1,
              startY - encounterTextArea.lineHeight / 2 - 1,
              102,
              encounterTextArea.lineHeight / 2 + 2
          );

          startY += encounterTextArea.lineHeight;
      });
  }

  exit() {
    this.game.setScene(this.worldMap);
  }
}

/*
 *
 *  Paradise/Scene-WorldMap
 *  Declan Tyson
 *  v0.0.96
 *  06/05/2020
 *
 */

class WorldMap extends Scene {
  constructor(player) {
    super();
    this.player = player;

    this.actions.up = this.moveUp.bind(this);
    this.actions.down = this.moveDown.bind(this);
    this.actions.left = this.moveLeft.bind(this);
    this.actions.right = this.moveRight.bind(this);
    this.actions.action = this.checkForInteraction.bind(this);
    this.leavingInteraction = false;

    this.visitedLocales = {};
    this.presentPeople = [];
    this.targetX = null;
    this.targetY = null;
  }

  doActions(action) {
    super.doActions(action);

    if (!action) {
      this.player.resetSprite();
      return;
    }
    if (action !== 'click') this.clearTarget();
    this.checkForRandomEncounters();
    this.checkForEntrance();
  }

  checkIfTilePassable(x, y) {
    return this.localeMap[x][y].isPassable();
  }

  moveUp() {
    if (this.player.direction !== directions.up) {
      this.player.setDirection(directions.up);
      return;
    }

    if (
      this.player.stepY > 0 ||
      (this.checkIfTilePassable(this.player.x, this.player.y - 1) &&
        (this.player.stepX <= 1 || this.checkIfTilePassable(this.player.x + 1, this.player.y - 1)))
    ) {
      this.player.setPlacement(this.player.x, this.player.y - 1);
    }
    this.player.advanceFrame();
  }

  moveDown() {
    if (this.player.direction !== directions.down) {
      this.player.setDirection(directions.down);
      return;
    }

    if (
      this.player.stepY > 0 ||
      (this.checkIfTilePassable(this.player.x, this.player.y + 1) &&
        (this.player.stepX <= 1 || this.checkIfTilePassable(this.player.x + 1, this.player.y + 1)))
    ) {
      this.player.setPlacement(this.player.x, this.player.y + 1);
    }
    this.player.advanceFrame();
  }

  moveLeft() {
    if (this.player.direction !== directions.left) {
      this.player.setDirection(directions.left);
      return;
    }

    if (
      this.player.stepX > 0 ||
      (this.checkIfTilePassable(this.player.x - 1, this.player.y) &&
        (this.player.stepY <= 1 || this.checkIfTilePassable(this.player.x - 1, this.player.y + 1)))
    ) {
      this.player.setPlacement(this.player.x - 1, this.player.y);
    }

    this.player.advanceFrame();
  }

  moveRight() {
    if (this.player.direction !== directions.right) {
      this.player.setDirection(directions.right);
      return;
    }

    if (
      this.player.stepX > 0 ||
      (this.checkIfTilePassable(this.player.x + 1, this.player.y) &&
        (this.player.stepY <= 1 || this.checkIfTilePassable(this.player.x + 1, this.player.y + 1)))
    ) {
      this.player.setPlacement(this.player.x + 1, this.player.y);
    }
    this.player.advanceFrame();
  }

  isIsometric() {
    return settings.get('renderMode') === 'isometric';
  }

  screenToGrid(screenX, screenY) {
    const offsets = this.getRenderOffsets();
    const totalOffsetX = offsets.offsetX + offsets.playerOffsetX;
    const totalOffsetY = offsets.offsetY + offsets.playerOffsetY;

    if (this.isIsometric()) {
      const terrain = settings.get('terrain');
      const sx = screenX + totalOffsetX;
      const sy = screenY + totalOffsetY;
      const x = Math.round(sx / terrain.isoTileWidth + (2 * sy) / terrain.isoTileHeight);
      const y = Math.round((2 * sy) / terrain.isoTileHeight - sx / terrain.isoTileWidth);
      return { x, y };
    }

    const terrain = settings.get('terrain');
    return {
      x: Math.floor((screenX + totalOffsetX) / terrain.tileSize),
      y: Math.floor((screenY + totalOffsetY) / terrain.tileSize),
    };
  }

  handlePointer(screenX, screenY) {
    const grid = this.screenToGrid(screenX, screenY);

    if (
      grid.x < 0 ||
      grid.y < 0 ||
      grid.x >= this.locale.width ||
      grid.y >= this.locale.height
    ) {
      return;
    }

    if (!this.checkIfTilePassable(grid.x, grid.y)) return;

    this.targetX = grid.x;
    this.targetY = grid.y;
  }

  clearTarget() {
    this.targetX = null;
    this.targetY = null;
  }

  updateAutoMovement() {
    if (this.targetX === null || this.targetY === null) return;
    if (this.targetX === this.player.x && this.targetY === this.player.y) {
      this.clearTarget();
      return;
    }
    if (!this.checkIfTilePassable(this.targetX, this.targetY)) {
      this.clearTarget();
      return;
    }

    const dx = this.targetX - this.player.x;
    const dy = this.targetY - this.player.y;

    if (dx !== 0) {
      const desired = dx > 0 ? directions.right : directions.left;
      if (this.player.direction !== desired) {
        this.player.setDirection(desired);
      } else {
        dx > 0 ? this.moveRight() : this.moveLeft();
      }
    } else if (dy !== 0) {
      const desired = dy > 0 ? directions.down : directions.up;
      if (this.player.direction !== desired) {
        this.player.setDirection(desired);
      } else {
        dy > 0 ? this.moveDown() : this.moveUp();
      }
    }
  }

  projectTileToScreen(x, y) {
    const terrain = settings.get('terrain');
    return {
      x: (x - y) * terrain.isoTileWidth / 2,
      y: (x + y) * terrain.isoTileHeight / 4,
    };
  }

  getRenderOffsets() {
    const terrain = settings.get('terrain');
    const tileStep = settings.tileStep();
    const centerPoint = this.game.centerPoint;
    const player = this.player;

    if (this.isIsometric()) {
      const projected = this.projectTileToScreen(player.x, player.y);
      return {
        offsetX: projected.x - centerPoint.x,
        offsetY: projected.y - centerPoint.y,
        playerOffsetX: (player.stepX - player.stepY) * tileStep,
        playerOffsetY: (player.stepX + player.stepY) * tileStep / 2,
        tileStep,
      };
    }

    return {
      offsetX: player.x * terrain.tileSize - centerPoint.x,
      offsetY: player.y * terrain.tileSize - centerPoint.y,
      playerOffsetX: player.stepX * tileStep,
      playerOffsetY: player.stepY * tileStep,
      tileStep,
    };
  }

  draw(ctx) {
    const terrain = settings.get('terrain');
    this.game.redraw = true;

    const offsets = this.getRenderOffsets();
    this.offsetX = offsets.offsetX;
    this.offsetY = offsets.offsetY;
    this.playerOffsetX = offsets.playerOffsetX;
    this.playerOffsetY = offsets.playerOffsetY;

    this.updateAutoMovement();

    if (this.isIsometric()) {
      this.drawIsoLocale(ctx);
    } else {
      this.viewportStartX = this.player.x - terrain.tilesWide / 2;
      this.viewportStartY = this.player.y - terrain.tilesHigh / 2;
      this.drawLocale(ctx);
    }

    this.drawDecorativeBehindPlayer(ctx);
    this.drawPeople(ctx);
    this.drawPlayer(ctx);
    this.drawDecorativeInFrontOfPlayer(ctx);
  }

  drawPlayer(ctx) {
    // Player is always at center of screen
    const terrain = settings.get('terrain');
    const character = settings.get('character');

    let sprite = this.player.sprite,
      playerX,
      playerY;

    if (this.isIsometric()) {
      playerX = this.game.centerPoint.x - character.spriteSize / 2;
      playerY = this.game.centerPoint.y - character.spriteSize / 2;
    } else {
      playerX = this.game.centerPoint.x - terrain.tileSize / 2;
      playerY = this.game.centerPoint.y - terrain.tileSize;
    }

    ctx.drawImage(
      sprite.image,
      sprite.x,
      sprite.y,
      64,
      64,
      playerX,
      playerY,
      character.spriteSize,
      character.spriteSize
    );
  }

  drawDecorativeBehindPlayer(ctx) {
    if (!this.locale || this.game.loading) return;

    this.locale.decorative.forEach(decoration => {
      if (decoration.canWalkBehind && this.isDecorationInFrontOfPlayer(decoration)) return;

      decoration.draw(ctx, this.player, this.offsetX, this.offsetY, this.localeMap);
    });
  }

  drawDecorativeInFrontOfPlayer(ctx) {
    if (!this.locale || this.game.loading) return;

    this.locale.decorative.forEach(decoration => {
      if (!decoration.canWalkBehind || !this.isDecorationInFrontOfPlayer(decoration)) return;

      decoration.draw(ctx, this.player, this.offsetX, this.offsetY, this.localeMap);
    });
  }

  isDecorationInFrontOfPlayer(decoration) {
    if (this.isIsometric()) {
      return decoration.x + decoration.y > this.player.x + this.player.y;
    }
    return decoration.y > this.player.y;
  }

  drawLocale(ctx) {
    if (!this.locale || this.game.loading) return;

    const terrainSettings = settings.get('terrain');

    let viewportStartX = this.viewportStartX - 1,
      viewportStartY = this.viewportStartY - 1;

    if (viewportStartX < 0) viewportStartX = 0;
    if (viewportStartY < 0) viewportStartY = 0;
    if (viewportStartX >= this.locale.width) viewportStartX = this.locale.width;
    if (viewportStartY >= this.locale.height) viewportStartY = this.locale.height;

    let viewportEndX = viewportStartX + terrainSettings.tilesWide + 2,
      viewportEndY = viewportStartY + terrainSettings.tilesHigh + 2;

    if (viewportEndX >= this.locale.width) viewportEndX = this.locale.width;
    if (viewportEndY >= this.locale.height) viewportEndY = this.locale.height;

    for (let x = viewportStartX; x <= viewportEndX; x++) {
      for (let y = viewportStartY; y <= viewportEndY; y++) {
        let terrain = this.localeMap[x][y];
        if (typeof terrain !== 'undefined') {
          let tileX = x * terrainSettings.tileSize - this.offsetX,
            tileY = y * terrainSettings.tileSize - this.offsetY,
            tile = window.game.terrainSprites[terrain.image];

          if (!tile) {
            ctx.beginPath();
            ctx.fillStyle = terrain.colour;
            ctx.strokeStyle = terrain.colour;
            ctx.rect(
              tileX - this.playerOffsetX,
              tileY - this.playerOffsetY,
              terrainSettings.tileSize,
              terrainSettings.tileSize
            );
            ctx.fill();
            ctx.stroke();
          } else {
            try {
              ctx.strokeStyle = null;
              ctx.drawImage(
                tile,
                0,
                0,
                45,
                45,
                tileX - this.playerOffsetX,
                tileY - this.playerOffsetY,
                terrainSettings.tileSize,
                terrainSettings.tileSize
              );
            } catch (e) {
              console.warn(e, tile);
            }
          }
        }
      }
    }
  }

  drawIsoLocale(ctx) {
    if (!this.locale || this.game.loading) return;

    const terrainSettings = settings.get('terrain');
    const canvasProperties = settings.canvasProperties();
    const tileW = terrainSettings.isoTileWidth;
    const tileH = terrainSettings.isoTileHeight;
    const halfW = tileW / 2;
    const quarterH = tileH / 4;
    const offsetX = this.offsetX + this.playerOffsetX;
    const offsetY = this.offsetY + this.playerOffsetY;

    const minS = Math.floor(offsetY / quarterH) - 2;
    const maxS = Math.ceil((canvasProperties.height + offsetY) / quarterH) + 2;
    const minD = Math.floor(offsetX / halfW) - 2;
    const maxD = Math.ceil((canvasProperties.width + offsetX) / halfW) + 2;

    const startX = Math.max(0, Math.floor((minS + minD) / 2) - 1);
    const endX = Math.min(this.locale.width - 1, Math.ceil((maxS + maxD) / 2) + 1);
    const startY = Math.max(0, Math.floor((minS - maxD) / 2) - 1);
    const endY = Math.min(this.locale.height - 1, Math.ceil((maxS - minD) / 2) + 1);

    for (let s = startX + startY; s <= endX + endY; s++) {
      const xMin = Math.max(startX, s - endY);
      const xMax = Math.min(endX, s - startY);
      for (let x = xMin; x <= xMax; x++) {
        const y = s - x;
        let terrain = this.localeMap[x][y];
        if (typeof terrain === 'undefined') continue;

        const screenX = (x - y) * halfW - offsetX;
        const screenY = s * quarterH - offsetY;
        const tile = window.game.terrainSprites[terrain.image];

        if (!tile) {
          ctx.beginPath();
          ctx.fillStyle = terrain.colour;
          ctx.moveTo(screenX, screenY - quarterH);
          ctx.lineTo(screenX + halfW, screenY);
          ctx.lineTo(screenX, screenY + quarterH);
          ctx.lineTo(screenX - halfW, screenY);
          ctx.closePath();
          ctx.fill();
        } else {
          try {
            ctx.drawImage(
              tile,
              0,
              0,
              45,
              45,
              screenX - halfW,
              screenY - quarterH,
              tileW,
              tileH / 2
            );
          } catch (e) {
            console.warn(e, tile);
          }
        }
      }
    }
  }

  drawPeople(ctx) {
    if (this.presentPeople.length === 0) return;
    const terrain = settings.get('terrain');
    const character = settings.get('character');
    const tileStep = settings.tileStep();

    let playerOffsetX = this.playerOffsetX,
      playerOffsetY = this.playerOffsetY;

    this.presentPeople.forEach(person => {
      let sprite = person.sprite,
        personX,
        personY;

      if (this.isIsometric()) {
        const projected = this.projectTileToScreen(person.x, person.y);
        const personOffsetX = (person.stepX - person.stepY) * tileStep;
        const personOffsetY = (person.stepX + person.stepY) * tileStep / 2;
        personX = projected.x - this.offsetX - playerOffsetX + personOffsetX - character.spriteSize / 2;
        personY = projected.y - this.offsetY - playerOffsetY + personOffsetY - character.spriteSize / 2;
      } else {
        personX = person.x * terrain.tileSize - this.offsetX - playerOffsetX - terrain.tileSize / 2;
        personY = person.y * terrain.tileSize - this.offsetY - playerOffsetY - terrain.tileSize / 2;
        personX += person.stepX * tileStep;
        personY += person.stepY * tileStep;
      }

      ctx.drawImage(
        sprite.image,
        sprite.x,
        sprite.y,
        64,
        64,
        personX,
        personY,
        character.spriteSize,
        character.spriteSize
      );

      this.localeMap[person.x][person.y].passable = false;
      this.localeMap[person.x][person.y].person = person;
    });
  }

  checkForRandomEncounters() {
    let potentialRandomEncounter = this.locale.encounters[this.player.x][this.player.y];
    if (!potentialRandomEncounter) return;

    let chance = Math.ceil(Math.random() * potentialRandomEncounter.rate);
    if (chance === potentialRandomEncounter.rate) {
      this.startRandomEncounter(potentialRandomEncounter);
    }
  }

  startRandomEncounter(encounter) {
    this.game.setScene(new Encounter(this, encounter.enemies, encounter.scenery));
  }

  checkForInteraction() {
    if (this.leavingInteraction) return;

    let x = this.player.x,
      y = this.player.y;

    switch (this.player.direction) {
      case 'up':
        y--;
        break;
      case 'down':
        y++;
        break;
      case 'left':
        x--;
        break;
      case 'right':
        x++;
        break;
    }

    let person = this.localeMap[x][y].person,
      decoration = this.localeMap[x][y].decoration;

    if (!person) {
      if (this.player.direction === directions.up && this.player.stepX > 0)
        person = this.localeMap[x + 1][y].person;
      else if (this.player.direction === directions.right && this.player.stepY > 0)
        person = this.localeMap[x][y + 1].person;
    }

    if (person) {
      this.startInteraction(person);
    } else if (decoration) {
      this.startObjectInteraction(decoration);
    }
  }

  startInteraction(person) {
    let interaction = person.startInteraction(this);
    this.game.setScene(interaction);
  }

  startObjectInteraction(decoration) {
    if (decoration.lines.length === 0) return;

    let interaction = decoration.startInteraction(this);
    this.game.setScene(interaction);
  }

  checkForEntrance() {
    let entrance = this.locale.entrances[this.player.x][this.player.y];
    if (!entrance) return;

    this.enter(entrance);
  }


  enter(entrance) {
    this.presentPeople = [];

    this.visitedLocales[this.locale.id] = this.locale;

    if (typeof this.visitedLocales[entrance.locale] !== 'undefined') {
        this.setCurrentLocale(this.visitedLocales[entrance.locale], entrance.entryPoint);
        return;
    }

    let localeId = window.game.locales[entrance.locale];
    let locale = new localeId(this.locale.player, this.locale.people, entrance.inhabitance);

    this.setCurrentLocale(locale, entrance.entryPoint);
}

  spawnPeople() {
    if (this.locale.inhabitance === undefined) return;

    this.locale.inhabitance.inhabitants.forEach((inhabitant, index) => {
      let spawnPoint = this.locale.spawnPoints[index];
      if (spawnPoint !== undefined) {
        let person = new window.game.people[inhabitant]();
        person.x = spawnPoint.x;
        person.y = spawnPoint.y;
        this.presentPeople.push(person);
      }
    });
  }

  setCurrentLocale(locale, entryPoint, rasterize = true) {
    this.visitedLocales[locale.id] = locale;

    this.locale = locale;
    this.localeMap = JSON.parse(JSON.stringify(locale.map)); // deep copy the map

    locale.enterLocaleAt(entryPoint);

    if (rasterize) this.rasterizeLocaleMap();

    this.spawnPeople();
  }

  rasterizeLocaleMap() {
    if (!this.locale) return;
    let map = this.locale.map;
    for (let x = 0; x < this.locale.width; x++) {
      for (let y = 0; y < this.locale.height; y++) {
        let terrainType = map[x][y],
          neighbours = {};

        if (map[x - 1]) neighbours.west = map[x - 1][y];
        if (map[x + 1]) neighbours.east = map[x + 1][y];
        if (map[x][y - 1]) neighbours.north = map[x][y - 1];
        if (map[x][y + 1]) neighbours.south = map[x][y + 1];

        let terrain = new terrains[terrainType](neighbours);
        this.localeMap[x][y] = terrain;
      }
    }
  }

  onLoad() {
    // extend this function
    this.locale.onLoad();
  }
}

/*
 *
 *  Paradise/Locales/Base
 *  Declan Tyson
 *  v0.0.96
 *  06/05/2020
 *
 */

class Locale {
  constructor(player, activePeople) {
    this.player = player;
    this.people = activePeople;
    this.entryPoints = {};
    this.spawnPoints = [];
    this.inhabitances = [];
    this.decorative = [];
  }

  initialise(width, height) {
    let map = [],
      enc = [],
      ent = [];
    for (let i = 0; i < width; i++) {
      map.push([]);
      enc.push([]);
      ent.push([]);
      for (let j = 0; j < height; j++) {
        map[i].push(['Blank']);
        enc[i].push(false);
        ent[i].push(false);
      }
    }

    this.map = map;
    this.encounters = enc;
    this.entrances = ent;
    this.width = width;
    this.height = height;
  }

  terrainPaint(startX, startY, width, height, terrain) {
    for (let x = startX; x < startX + width; x++) {
      for (let y = startY; y < startY + height; y++) {
        this.map[x][y] = terrain;
      }
    }
  }

  randomEncounterPatch(startX, startY, width, height, rate, enemies, scenery) {
    for (let x = startX; x < startX + width; x++) {
      for (let y = startY; y < startY + height; y++) {
        this.encounters[x][y] = {
          rate,
          enemies,
          scenery,
        };
      }
    }
  }

  addInhabitance(startX, startY, width, height, inhabitance) {
    let doorway = inhabitance.doorway;
    this.terrainPaint(startX, startY, width, height, 'Wall');
    this.terrainPaint(doorway.x, doorway.y, 1, 1, 'Doorway');
    this.entrances[doorway.x][doorway.y] = {
      locale: inhabitance.id,
      entryPoint: 'frontDoor',
      inhabitance
    };
  }

  addEntrance(x, y, locale, entryPoint) {
    this.entrances[x][y] = {
        locale,
        entryPoint
    };
}
  enterLocaleAt(entryPoint) {
    this.player.stepX = 0;
    this.player.stepY = 0;
    this.player.setPlacement(this.entryPoints[entryPoint].x, this.entryPoints[entryPoint].y, true);
  }

  addDecoration(decoration) {
    this.decorative.push(decoration);
  }

  addSpawnPoint(x, y) {
    this.spawnPoints.push({
      x: x,
      y: y,
    });
  }

  drawInhabitances() {
    for (let i = 0; i < this.inhabitances.length; i++) {
      let inhabitance = this.inhabitances[i];
      this.addInhabitance(
        inhabitance.x,
        inhabitance.y,
        inhabitance.sizeX,
        inhabitance.sizeY,
        inhabitance
      );
    }
  }

  assignPeopleToInhabitancesRandomly(maxPerInhabitancy, thisPeople = this.people) {
    if (this.inhabitances.length === 0 || thisPeople.length === 0) return;

    for (let i = 0; i < thisPeople.length; i++) {
      let person = thisPeople[i],
        index = Math.floor(Math.random() * this.inhabitances.length),
        inhabitance = this.inhabitances[index];

      while (inhabitance.inhabitants.length >= maxPerInhabitancy) {
        index = Math.floor(Math.random() * this.inhabitances.length);
        inhabitance = this.inhabitances[index];
      }

      inhabitance.addInhabitant(person);
    }
  }

  assignPairedPeopleToInhabitancesRandomly(maxPerInhabitancy) {
    if (this.inhabitances.length === 0 || this.people.length === 0) return;

    let thisPeople = this.people.slice(0),
      pairedPeople = [],
      currentPairing = [];

    for (let i = 0; i < thisPeople.length; i++) {
      let person = thisPeople[i];
      if (pairedPeople.indexOf(person) === -1) {
        currentPairing.push(person);

        let thisPerson = new window.game.people[person]();

        Object.keys(thisPerson.relationships).forEach(relationship => {
          if (
            pairedRelationships.indexOf(thisPerson.relationships[relationship].description) !==
              -1 &&
            this.people.indexOf(relationship) !== -1
          ) {
            currentPairing.push(relationship);
          }
        });
      }

      if (currentPairing.length === maxPerInhabitancy) {
        let index = Math.floor(Math.random() * this.inhabitances.length),
          inhabitance = this.inhabitances[index];

        while (inhabitance.inhabitants.length + 1 >= maxPerInhabitancy) {
          index = Math.floor(Math.random() * this.inhabitances.length);
          inhabitance = this.inhabitances[index];
        }

        inhabitance.addInhabitants(currentPairing);
        currentPairing.forEach(person => {
          pairedPeople.push(person);
        });
      }

      currentPairing = [];
    }

    let remainingPeople = thisPeople.filter(item => {
      return pairedPeople.indexOf(item) === -1;
    });

    this.assignPeopleToInhabitancesRandomly(maxPerInhabitancy, remainingPeople);
  }

  onLoad() {
    // extend this function
  }
}

class Interior extends Locale {
  constructor(player, people, inhabitance = null) {
    super(player, people);

    if (!inhabitance) return;

    this.inhabitance = inhabitance;
    Util.log(`Welcome to ${inhabitance.name}.`);

    for (let i = 0; i < inhabitance.inhabitants.length; i++) {
      let inhabitant = inhabitance.inhabitants[i];
      Util.log(`${inhabitant} lives here.`);
    }
  }
}

class Inhabitance {
  constructor(
    id,
    name,
    x,
    y,
    doorway,
    sizeX = settings.get('defaultInhabitanceSize'),
    sizeY = settings.get('defaultInhabitanceSize')
  ) {
    this.id = id;
    this.name = name;
    this.x = x;
    this.y = y;
    this.doorway = doorway;
    this.inhabitants = [];
    this.sizeX = sizeX;
    this.sizeY = sizeY;
  }

  addInhabitant(person) {
    this.inhabitants.push(person);
  }

  addInhabitants(people) {
    for (let i = 0; i < people.length; i++) {
      this.addInhabitant(people[i]);
    }
  }
}

/*
 *
 *  Paradise/Locales/Grove Street House Template
 *  Declan Tyson
 *  v0.0.54
 *  16/02/2018
 *
 */

class GroveStreetTemplate extends Interior {
  constructor(player, people, inhabitance) {
    super(player, people, inhabitance);

    this.initialise(100, 100);

    this.addSpawnPoint(31, 35);
    this.addSpawnPoint(29, 34);

    this.terrainPaint(0, 0, 100, 100, 'Blank');
    this.terrainPaint(25, 25, 13, 13, 'Wall');
    this.terrainPaint(26, 26, 11, 11, 'WoodenFloor');
  }
}

/*
 *
 *  Paradise/Locales/Town Hall
 *  Declan Tyson
 *  v0.0.54
 *  16/02/2018
 *
 */

class TownHall extends GroveStreetTemplate {
  constructor(player, people, inhabitance) {
    super(player, people, inhabitance);

    this.id = 'TownHall';
    this.entryPoints.frontDoor = { x: 36, y: 36 };

    this.entrances[36][37] = {
      locale: 'Village',
      entryPoint: 'townHall',
    };

    this.terrainPaint(36, 37, 1, 1, 'WoodenFloor');
  }
}

/*
 *
 *  Paradise/Locales/Village
 *  Declan Tyson
 *  v0.0.25
 *  07/02/2018
 *
 */

class Village extends Locale {
  constructor(player, people) {
    super(player, people);

    this.entryPoints.beginningOfGame = { x: 30, y: 30 };
    this.entryPoints.townHall = { x: 31, y: 62 };

    this.initialise(300, 300);

    this.terrainPaint(0, 0, 300, 300, 'Water');
    this.terrainPaint(20, 27, 15, 90, 'Grass');
    this.terrainPaint(35, 35, 2, 40, 'Grass');
    this.terrainPaint(37, 37, 2, 36, 'Grass');
    this.terrainPaint(39, 39, 2, 32, 'Grass');

    this.inhabitances.push(
      new Inhabitance('TownHall', 'Town Hall', 30, 59, { x: 31, y: 62 }, 2, 4)
    );

    this.drawInhabitances();
    this.assignPeopleToInhabitancesRandomly(4);
  }
}

/*
 *
 *  Paradise/Scene-ObjectInteraction
 *  Declan Tyson
 *  v0.0.92
 *  21/10/2019
 *
 */

class ObjectInteraction extends Scene {
  constructor(decoration) {
    super();

    this.decoration = decoration;

    // calculate these values based on mood etc....;
    this.lines = this.decoration.lines || [];
    this.conversationOptions = this.decoration.conversationOptions || [];

    this.selectedConversationOption = 0;

    this.keyHeld = true;
    this.exiting = false;

    this.actions.up = this.previousOption.bind(this);
    this.actions.down = this.nextOption.bind(this);
    this.actions.action = this.sendResponse.bind(this);
  }

  draw(ctx) {
    // World map should be overlaid
    this.worldMap.draw(ctx);

    if (!this.game.keyHeld) this.keyHeld = false;

    this.drawConversationTextArea(ctx);
    this.drawConversation(ctx);
    this.drawOptions(ctx);
  }

  drawConversationTextArea(ctx) {
    const interactionTextArea = settings.get('interactionTextArea');

    ctx.rect(
      interactionTextArea.x,
      interactionTextArea.y,
      interactionTextArea.width,
      interactionTextArea.height
    );
    ctx.fillStyle = interactionTextArea.background;
    ctx.globalAlpha = interactionTextArea.alpha;
    ctx.fill();
    ctx.globalAlpha = 1;
  }

  drawConversation(ctx) {
    const interactionTextArea = settings.get('interactionTextArea');
    const fonts = settings.get('fonts');
    const canvasProperties = settings.canvasProperties();

    let y = canvasProperties.height - interactionTextArea.height + interactionTextArea.badgeOffsetY;
    ctx.font = fonts.small;
    ctx.fillStyle = colours.white;
    let lines = [];
    this.lines.forEach(line => {
      if (line.length < 60) lines.push(line);
      else {
        let chunks = line.split(/( )/),
          chunkedLine = '';
        chunks.forEach(chunk => {
          if (chunkedLine.length + chunk.length > 60) {
            lines.push(chunkedLine);
            chunkedLine = '';
          }
          chunkedLine += chunk;
        });
        lines.push(chunkedLine);
      }
    });

    lines.forEach((line, index) => {
      ctx.fillText(
        line,
        interactionTextArea.badgeOffsetX,
        y + index * interactionTextArea.lineHeight
      );
    });

    this.chunkedLines = lines;
  }

  drawOptions(ctx) {
    const canvasProperties = settings.canvasProperties();
    const interactionTextArea = settings.get('interactionTextArea');
    const fonts = settings.get('fonts');

    let y =
      canvasProperties.height -
      interactionTextArea.height +
      interactionTextArea.optionsOffsetY -
      interactionTextArea.badgeOffsetY +
      this.chunkedLines.length * interactionTextArea.lineHeight;
    ctx.font = fonts.small;
    ctx.fillStyle = colours.white;
    this.conversationOptions.forEach((conversationOption, index) => {
      ctx.fillText(
        conversationOption.value,
        interactionTextArea.optionsOffsetX,
        y + index * interactionTextArea.optionHeight
      );
      if (index === this.selectedConversationOption) {
        ctx.strokeStyle = colours.white;
        ctx.strokeRect(
          interactionTextArea.optionsOffsetX - interactionTextArea.optionHeight / 2,
          y + index * interactionTextArea.optionHeight - interactionTextArea.optionHeight / 1.5,
          interactionTextArea.width - interactionTextArea.optionsOffsetX,
          interactionTextArea.optionHeight
        );
      }
    });
  }

  nextOption() {
    if (this.keyHeld) return;

    if (this.selectedConversationOption < this.conversationOptions.length - 1)
      this.selectedConversationOption++;
    this.keyHeld = true;
  }

  previousOption() {
    if (this.keyHeld) return;

    if (this.selectedConversationOption > 0) this.selectedConversationOption--;
    this.keyHeld = true;
  }

  sendResponse() {
    if (this.keyHeld) return;

    this.decoration.sendResponse(this.conversationOptions[this.selectedConversationOption], this);
    this.keyHeld = true;
  }

  returnToWorldMap() {
    this.worldMap.leavingInteraction = true;
    setTimeout(() => {
      this.worldMap.leavingInteraction = false;
    }, 250);
    this.game.setScene(this.worldMap);
  }
}

/*
 *
 *  Paradise/Decorative
 *  Declan Tyson
 *  v0.0.92
 *  21/10/2019
 *
 */

class Decorative {
  constructor(name, description, src, x, y, passMap = [false], canWalkBehind = true) {
    this.name = name;
    this.description = description;
    let image = new Image();
    image.src = src;
    this.image = image;
    this.items = [];
    this.colour = colours.red;
    this.passMap = passMap;
    this.canWalkBehind = canWalkBehind;

    this.lines = [];
    this.conversationOptions = [];
    this.responses = {};

    this.x = x;
    this.y = y;
  }

  updateImage(src) {
    let image = new Image();
    image.src = src;
    this.image = image;
  }

  addItem(item) {
    this.items.push(item);
  }

  draw(ctx, player, mapOffsetX, mapOffsetY, map) {
    const terrain = settings.get('terrain');
    const tileStep = settings.tileStep();
    const isIsometric = settings.get('renderMode') === 'isometric';

    let decorationX,
      decorationY,
      offsetX,
      offsetY,
      height = this.image.naturalHeight; // we draw this from the bottom

    if (isIsometric) {
      const halfW = terrain.isoTileWidth / 2;
      const quarterH = terrain.isoTileHeight / 4;
      decorationX = (this.x - this.y) * halfW - mapOffsetX;
      decorationY = (this.x + this.y) * quarterH - mapOffsetY;
      offsetX = (player.stepX - player.stepY) * tileStep;
      offsetY = (player.stepX + player.stepY) * tileStep / 2;

      const tileCenterX = decorationX - offsetX;
      const tileBottomY = decorationY - offsetY + quarterH;
      ctx.drawImage(this.image, tileCenterX - this.image.naturalWidth / 2, tileBottomY - height);
    } else {
      decorationX = this.x * terrain.tileSize - mapOffsetX;
      decorationY = this.y * terrain.tileSize - mapOffsetY;
      offsetX = player.stepX * tileStep;
      offsetY = player.stepY * tileStep;

      ctx.drawImage(
        this.image,
        decorationX - offsetX,
        decorationY - offsetY - height + terrain.tileSize
      );
    }

    for (let i = 0; i < this.passMap.length; i++) {
      let mapEntry = map[this.x + i][this.y];
      mapEntry.passable = this.passMap[i];
      mapEntry.decoration = this;

      if (window.debug && !this.passMap[i]) {
        if (isIsometric) {
          const halfW = terrain.isoTileWidth / 2;
          const quarterH = terrain.isoTileHeight / 4;
          const tx = this.x + i;
          const tileCenterX = (tx - this.y) * halfW - mapOffsetX - offsetX;
          const tileCenterY = (tx + this.y) * quarterH - mapOffsetY - offsetY;

          ctx.beginPath();
          ctx.fillStyle = this.colour;
          ctx.moveTo(tileCenterX, tileCenterY - quarterH);
          ctx.lineTo(tileCenterX + halfW, tileCenterY);
          ctx.lineTo(tileCenterX, tileCenterY + quarterH);
          ctx.lineTo(tileCenterX - halfW, tileCenterY);
          ctx.closePath();
          ctx.fill();
        } else {
          let debugX = (this.x + i) * terrain.tileSize - mapOffsetX;

          ctx.beginPath();
          ctx.fillStyle = this.colour;
          ctx.strokeStyle = this.colour;
          ctx.rect(debugX - offsetX, decorationY - offsetY, terrain.tileSize, terrain.tileSize);
          ctx.fill();
          ctx.stroke();
        }
      }
    }
  }

  startInteraction(worldMap) {
    let interaction = new ObjectInteraction(this);
    interaction.worldMap = worldMap;

    return interaction;
  }

  sendResponse(conversationOption, interaction) {
    Util.log(conversationOption.value);

    if (conversationOption.callback) {
      conversationOption.callback();
    }

    if (!this.responses[conversationOption.key]) {
      interaction.returnToWorldMap();
    } else {
      let response = this.responses[conversationOption.key];
      interaction.selectedConversationOption = 0;
      interaction.lines = response.lines;
      interaction.conversationOptions = response.conversationOptions;
    }
  }

  resetInteractions() {
    this.conversationOptions = [];
    this.responses = {};
  }

  addConversationOption(key, value, parentKey = null, callback = () => {}) {
    let destination = this.conversationOptions;
    if (parentKey) destination = this.responses[parentKey].conversationOptions;

    destination.push({ key, value, callback });
  }

  addResponse(key, lines) {
    if (typeof lines === 'string') lines = [lines];
    this.responses[key] = { lines, conversationOptions: [] };
  }

  importInteractionData() {
    // TODO: Import data from json file
  }
}

/*
 *
 *  Paradise/Decorative/Tree
 *  Declan Tyson
 *  v0.0.48
 *  15/02/2018
 *
 */

class Tree extends Decorative {
  constructor(x, y) {
    super('Tree', 'a tropical palm tree', '/oob/Decorative/tree.png', x, y, [true, false, true]);
  }
}

/*
 *
 *  Paradise/Portrait
 *  Declan Tyson
 *  v0.0.92
 *  21/10/2019
 *
 */

class Portrait {
  constructor(imageSrc) {
    let image = new Image();
    image.src = imageSrc;
    this.image = image;
    this.src = imageSrc;
    this.entering = false;
    this.exiting = false;
    this.frame = 0;
    this.frameIncrement = 1;
    this.maxFrames = 30;
  }

  draw(ctx) {
    const canvasProperties = settings.canvasProperties();

    if (this.entering) this.enter();
    if (this.exiting) this.exit();

    ctx.globalAlpha = this.frame / this.maxFrames;
    ctx.drawImage(
      this.image,
      0,
      0,
      canvasProperties.width,
      canvasProperties.height,
      canvasProperties.width - this.frame * (canvasProperties.width / 2 / this.maxFrames),
      0,
      canvasProperties.width,
      canvasProperties.height
    );
    ctx.globalAlpha = 1;
  }

  enter() {
    if (this.frame < this.maxFrames) {
      this.entering = true;
      this.frame += this.frameIncrement;
    } else {
      this.entering = false;
    }
  }

  enterWithoutAnimation() {
    this.frame = this.maxFrames;
    this.entering = false;
  }

  exitWithoutAnimation() {
    this.frame = 0;
    this.exiting = false;
  }

  exit() {
    if (this.frame > 0) {
      this.frame -= this.frameIncrement;
    } else {
      this.exiting = false;
    }
  }
}

/*
 *
 *  Paradise/Scene-Interaction
 *  Declan Tyson
 *  v0.0.92
 *  21/10/2019
 *
 */

class Interaction extends Scene {
  constructor(person) {
    super();

    this.person = person;

    // calculate these values based on mood etc....;
    this.lines = this.person.lines || [];
    this.conversationOptions = this.person.conversationOptions || [];

    this.selectedConversationOption = 0;

    this.exiting = false;

    this.actions.up = this.previousOption.bind(this);
    this.actions.down = this.nextOption.bind(this);
    this.actions.action = this.sendResponse.bind(this);
    // this.actions.back = this.returnToWorldMap.bind(this);

    Util.log(`Entering interaction with ${this.person.name}`);
  }

  handlePointer(screenX, screenY) {
    if (this.worldMap) this.worldMap.handlePointer(screenX, screenY);
  }

  draw(ctx) {
    // World map should be overlaid
    this.worldMap.draw(ctx);
    this.person.currentPortrait.draw(ctx);

    if (this.exiting && !this.person.currentPortrait.exiting) {
      this.exit();
    }

    if (!this.game.keyHeld) this.keyHeld = false;

    this.drawConversationTextArea(ctx);
    this.drawBadge(ctx);
    this.drawConversation(ctx);
    this.drawOptions(ctx);
  }

  drawConversationTextArea(ctx) {
    const interactionTextArea = settings.get('interactionTextArea');

    ctx.rect(
      interactionTextArea.x,
      interactionTextArea.y,
      interactionTextArea.width,
      interactionTextArea.height
    );
    ctx.fillStyle = interactionTextArea.background;
    ctx.globalAlpha = interactionTextArea.alpha;
    ctx.fill();
    ctx.globalAlpha = 1;
  }

  drawBadge(ctx) {
    const interactionTextArea = settings.get('interactionTextArea');
    const fonts = settings.get('fonts');

    ctx.font = fonts.large;
    ctx.fillStyle = colours.white;
    ctx.fillText(
      this.person.name,
      interactionTextArea.x + interactionTextArea.badgeOffsetX,
      interactionTextArea.y + interactionTextArea.badgeOffsetY
    );
  }

  drawConversation(ctx) {
    const interactionTextArea = settings.get('interactionTextArea');
    const fonts = settings.get('fonts');

    let y = interactionTextArea.y + interactionTextArea.badgeOffsetY * 2;
    ctx.font = fonts.small;
    ctx.fillStyle = colours.white;
    let lines = [];
    this.lines.forEach(line => {
      if (line.length < 60) lines.push(line);
      else {
        let chunks = line.split(/( )/),
          chunkedLine = '';
        chunks.forEach(chunk => {
          if (chunkedLine.length + chunk.length > interactionTextArea.lineLength) {
            lines.push(chunkedLine);
            chunkedLine = '';
          }
          chunkedLine += chunk;
        });
        lines.push(chunkedLine);
      }
    });

    lines.forEach((line, index) => {
      ctx.fillText(
        line,
        interactionTextArea.x + interactionTextArea.badgeOffsetX,
        y + index * interactionTextArea.lineHeight
      );
    });

    this.chunkedLines = lines;
  }

  drawOptions(ctx) {
    const interactionTextArea = settings.get('interactionTextArea');
    const fonts = settings.get('fonts');

    let y =
      interactionTextArea.y +
      interactionTextArea.optionsOffsetY +
      this.chunkedLines.length * interactionTextArea.lineHeight;
    ctx.font = fonts.small;
    ctx.fillStyle = colours.white;
    this.conversationOptions.forEach((conversationOption, index) => {
      ctx.fillText(
        conversationOption.value,
        interactionTextArea.x + interactionTextArea.optionsOffsetX,
        y + index * interactionTextArea.optionHeight
      );
      if (index === this.selectedConversationOption) {
        ctx.strokeStyle = colours.white;
        ctx.strokeRect(
          interactionTextArea.x +
            interactionTextArea.optionsOffsetX -
            interactionTextArea.optionHeight / 2,
          y + index * interactionTextArea.optionHeight - interactionTextArea.optionHeight / 1.5,
          interactionTextArea.width - interactionTextArea.optionsOffsetX,
          interactionTextArea.optionHeight
        );
      }
    });
  }

  nextOption() {
    if (this.keyHeld) return;

    if (this.selectedConversationOption < this.conversationOptions.length - 1)
      this.selectedConversationOption++;
    this.keyHeld = true;
  }

  previousOption() {
    if (this.keyHeld) return;

    if (this.selectedConversationOption > 0) this.selectedConversationOption--;
    this.keyHeld = true;
  }

  sendResponse() {
    if (this.keyHeld || this.person.currentPortrait.entering || this.person.currentPortrait.exiting)
      return;

    this.person.sendResponse(this.conversationOptions[this.selectedConversationOption], this);
    this.keyHeld = true;
  }

  returnToWorldMap() {
    if (!this.worldMap) return;
    this.exiting = true;
    this.person.currentPortrait.exiting = true;
    this.conversationOptions = [];
  }

  exit() {
    this.game.setScene(this.worldMap);
  }
}

/*
 *
 *  Paradise/Person
 *  Declan Tyson
 *  v0.0.95
 *  21/10/2019
 *
 */

class Person {
  constructor(name, gender, mood = 'neutral') {
    this.id = name;
    this.name = name;
    this.gender = gender;
    this.mood = mood;
    this.colour = colours.black;
    this.direction = directions.down;
    this.responses = {};

    let sprite_test = new Image(),
      spriteMap_test = {};

    sprite_test.src = '/oob/char_test.png';
    spriteMap_test[directions.up] = 0;
    spriteMap_test[directions.down] = 128;
    spriteMap_test[directions.left] = 64;
    spriteMap_test[directions.right] = 192;

    this.stepX = 0;
    this.stepY = 0;

    this.currentJob = null;

    this.xBlocked = false;
    this.yBlocked = false;

    this.spriteMap = spriteMap_test;
    this.sprite = {
      image: sprite_test,
      x: 0,
      y: 128,
    };

    this.lines = [
      "I'm a default character, short and stout.",
      "Here's my handle, here's my spout.",
    ];
    this.conversationOptions = [
      {
        key: 'Kettle',
        value: "I'll go put the kettle on",
      },
    ];
    this.portraitFolder = '/oob/Portraits/Test';
    this.portraits = {
      neutral: new Portrait(`${this.portraitFolder}/default.png`, this),
      angry: new Portrait(`${this.portraitFolder}/angry.png`, this),
    };
    this.currentPortrait = this.portraits[this.mood];

    this.relationships = {};
  }

  randomizeRelationships() {
    Object.keys(this.relationships).forEach(name => {
      let relationship = this.relationships[name],
        oldValue = relationship.value,
        newValue = Math.floor(Math.random() * 99);

      Util.log(
        `${this.name}'s relationship with ${posessivePronouns[this.gender]} ${
          relationship.description
        }, ${name}, goes from ${oldValue} to ${newValue}.`
      );
      this.relationships[name].value = newValue;
    });
  }

  addAcquaintanceRelationship(person) {
    this.relationships[person] = {
      description: 'Acquaintance',
      value: 50,
    };
  }

  startInteraction(worldMap) {
    let interaction = new Interaction(this);
    interaction.worldMap = worldMap;
    this.currentPortrait = this.portraits[this.mood];
    this.currentPortrait.enter();

    if (this.x < worldMap.player.x) this.setDirection(directions.right);
    if (this.x > worldMap.player.x) this.setDirection(directions.left);
    if (this.y < worldMap.player.y) this.setDirection(directions.down);
    if (this.y > worldMap.player.y) this.setDirection(directions.up);

    return interaction;
  }

  sendResponse(conversationOption, interaction) {
    Util.log(conversationOption.value);

    if (conversationOption.callback) {
      conversationOption.callback();
    }

    if (!this.responses[conversationOption.key]) {
      interaction.returnToWorldMap();
    } else {
      let response = this.responses[conversationOption.key];
      interaction.selectedConversationOption = 0;
      interaction.lines = response.lines;

      let mood = response.mood;
      if (!this.portraits[mood]) mood = 'neutral';
      this.currentPortrait.exitWithoutAnimation();
      this.currentPortrait = this.portraits[mood];
      this.currentPortrait.enterWithoutAnimation();

      interaction.conversationOptions = response.conversationOptions;
    }
  }

  setDirection(direction) {
    const character = settings.get('character');
    if (direction === directions.left || direction === directions.right) {
      if (this.stepX >= character.stepsPerTile) this.stepX = character.stepsPerTile - 1;
      if (this.stepX < 0) this.stepX = 0;
    } else if (direction === directions.up || direction === directions.down) {
      if (this.stepY >= character.stepsPerTile) this.stepY = character.stepsPerTile - 1;
      if (this.stepY < 0) this.stepY = 0;
    }

    this.direction = direction;
    this.sprite.y = this.spriteMap[direction];
  }

  resetInteractions() {
    this.conversationOptions = [];
    this.responses = {};
  }

  addConversationOption(key, value, parentKey = null, callback = () => {}) {
    let destination = this.conversationOptions;
    if (parentKey) destination = this.responses[parentKey].conversationOptions;

    destination.push({ key, value, callback });
  }

  addResponse(key, lines, mood = 'neutral') {
    if (typeof lines === 'string') lines = [lines];
    this.responses[key] = { mood, lines, conversationOptions: [] };
  }

  setPlacement(x, y, init = false) {
    const character = settings.get('character');

    if (x !== this.x) {
      if (this.stepX >= character.stepsPerTile || this.stepX < 0 || init) {
        window.game.scene.localeMap[this.x][this.y].passable = true;
        window.game.scene.localeMap[this.x][this.y].person = null;

        this.x = x;
        if (this.stepX >= character.stepsPerTile) this.stepX = 0;
        if (this.stepX < 0) this.stepX = character.stepsPerTile - 1;
      } else {
        if (x > this.x) this.stepX++;
        if (x < this.x) this.stepX--;
      }
    }

    if (y !== this.y) {
      if (this.stepY >= character.stepsPerTile || this.stepY < 0 || init) {
        window.game.scene.localeMap[this.x][this.y].passable = true;
        window.game.scene.localeMap[this.x][this.y].person = null;

        this.y = y;
        if (this.stepY >= character.stepsPerTile) this.stepY = 0;
        if (this.stepY < 0) this.stepY = character.stepsPerTile - 1;
      } else {
        if (y > this.y) this.stepY++;
        if (y < this.y) this.stepY--;
      }
    }
  }

  importInteractionData() {
    // TODO: Import data from json file
  }
}

/*
 *
 *  Paradise/Person/Evelyn
 *  Declan Tyson
 *  v0.0.23
 *  06/02/2018
 *
 */

class Evelyn extends Person {
  constructor() {
    super('Evelyn', genders.female);
  }
}

/*
 *
 *  Paradise/Person/Jill
 *  Declan Tyson
 *  v0.0.24
 *  06/02/2018
 *
 */

class Jill extends Person {
  constructor() {
    super('Jill', genders.female);

    this.relationships = {
      John: {
        description: 'Husband',
        value: 45,
      },
    };
  }
}

/*
 *
 *  Paradise/Person/John
 *  Declan Tyson
 *  v0.0.24
 *  06/02/2018
 *
 */

class John extends Person {
  constructor() {
    super('John', genders.male);

    this.relationships = {
      Jill: {
        description: 'Wife',
        value: 45,
      },
    };
  }
}

/*
 *
 *  Paradise/Person/Neil
 *  Declan Tyson
 *  v0.0.23
 *  06/02/2018
 *
 */

class Neil extends Person {
  constructor() {
    super('Neil', genders.male);
  }
}

/*
 *
 *  Paradise/Person/Pauline
 *  Declan Tyson
 *  v0.0.23
 *  06/02/2018
 *
 */

class Pauline extends Person {
  constructor() {
    super('Pauline', genders.female);
  }
}

/*
 *
 *  Paradise/Person/Petey
 *  Declan Tyson
 *  v0.0.23
 *  06/02/2018
 *
 */

class Petey extends Person {
  constructor() {
    super('Petey', genders.male);
  }
}

/*
 *
 *  Paradise/Person/Zenith
 *  Declan Tyson
 *  v0.0.60
 *  19/02/2018
 *
 */

class Quazar extends Person {
  constructor() {
    super('Quazar', genders.alien);

    this.colour = colours.green;
    this.relationships = {
      Zenith: {
        description: 'Roommate',
        value: 85,
      },
    };
    this.lines = [
      'Now this is the story all about how my life got flipped, turned upside down,',
      "and I'd like to take a minute, just sit right there,",
      "I'll tell how I became the prince of a town called Bel-Air.",
    ];
  }
}

/*
 *
 *  Paradise/Person/Zenith
 *  Declan Tyson
 *  v0.0.80
 *  17/01/2019
 *
 */

class Zenith extends Person {
  constructor() {
    super('Zenith', genders.alien);

    this.colour = colours.green;
    this.relationships = {
      Quazar: {
        description: 'Roommate',
        value: 85,
      },
    };

    this.lines = ['I am so lonely...'];

    this.resetInteractions();

    this.addConversationOption('Nice', "Happy Valentine's Day!");
    this.addResponse('Nice', '<3');
    this.addConversationOption('Goodbye', 'Goodbye', 'Nice');

    this.addConversationOption('Truth', 'You will die alone.');
    this.addResponse('Truth', 'I know... :(');
    this.addConversationOption('Goodbye', 'Goodbye', 'Truth');

    this.addConversationOption('Mean', 'LOL!', null, this.scream);
    this.addResponse('Mean', 'Why you little fuckface!', 'angry');
    this.addConversationOption('Confront', 'What are you going to do about it?', 'Mean');
    this.addResponse('Confront', "Nothing, I guess... I'm so lonely...");
    this.addConversationOption('Regret', 'I feel a bit bad now.', 'Confront');
    this.addConversationOption('Laughter', "Who's the fuckface now, eh?", 'Confront');
  }

  scream() {
    alert('!!!!');
  }
}

/*
 *
 *  Paradise/People
 *  Declan Tyson
 *  v0.0.95
 *  06/05/2020
 *
 */

let people = {
  Evelyn,
  Jill,
  John,
  Neil,
  Pauline,
  Petey,
  Quazar,
  Zenith,
};

/*
 *
 *  Paradise/Locales/Islands
 *  Declan Tyson
 *  v0.0.96
 *  06/05/2020
 *
 */

class Islands extends Locale {
  constructor(player, people$$1) {
    super(player, people$$1);

    this.id = 'Islands';
    this.entryPoints.beginningOfGame = { x: 57, y: 60 };
    this.entryPoints.groveStreet1 = { x: 55, y: 60 };
    this.entryPoints.groveStreet2 = { x: 58, y: 60 };
    this.entryPoints.groveStreet3 = { x: 55, y: 63 };
    this.entryPoints.groveStreet4 = { x: 58, y: 63 };
    this.entryPoints.ballManor = { x: 56, y: 74 };

    this.initialise(300, 300);

    this.terrainPaint(0, 0, 300, 300, 'Water');
    this.terrainPaint(52, 57, 11, 20, 'Grass');
    this.terrainPaint(42, 35, 2, 8, 'Grass');
    this.terrainPaint(57, 60, 1, 16, 'VerticalRoad');
    this.terrainPaint(55, 60, 2, 1, 'HorizontalRoad');
    this.terrainPaint(58, 60, 2, 1, 'HorizontalRoad');
    this.terrainPaint(55, 63, 2, 1, 'HorizontalRoad');
    this.terrainPaint(58, 63, 2, 1, 'HorizontalRoad');

    this.terrainPaint(55, 70, 2, 1, 'HorizontalRoad');
    this.terrainPaint(54, 70, 1, 5, 'VerticalRoad');
    this.terrainPaint(55, 74, 2, 1, 'HorizontalRoad');

    this.terrainPaint(52, 76, 11, 3, 'CoastalSands');
    this.randomEncounterPatch(
      52,
      76,
      11,
      3,
      50,
      [['Slime'], ['Slime', 'Slime']],
      '/img/Encounter/beach.png'
    );

    this.addDecoration(new Tree(60, 77));

    this.inhabitances.push(
      new Inhabitance('GroveStreet1', '1 Grove Street', 53, 59, {
        x: 54,
        y: 60,
      }),
      new Inhabitance('GroveStreet2', '2 Grove Street', 60, 59, {
        x: 60,
        y: 60,
      }),
      new Inhabitance('GroveStreet3', '3 Grove Street', 53, 62, {
        x: 54,
        y: 63,
      }),
      new Inhabitance('GroveStreet4', '4 Grove Street', 60, 62, {
        x: 60,
        y: 63,
      }),
      new Inhabitance('BallManor', 'Ball Manor', 55, 72, { x: 56, y: 73 })
    );

    this.drawInhabitances();
    this.assignPairedPeopleToInhabitancesRandomly(2);
  }

  onLoad() {
    window.game.scene.startInteraction(new people.Quazar());
  }
}

/*
 *
 *  Paradise/Locales/1 Grove Street
 *  Declan Tyson
 *  v0.0.54
 *  16/02/2018
 *
 */

class GroveStreet1 extends GroveStreetTemplate {
  constructor(player, people, inhabitance) {
    super(player, people, inhabitance);

    this.id = 'GroveStreet1';
    this.entryPoints.frontDoor = { x: 36, y: 36 };

    this.entrances[37][36] = {
      locale: 'Islands',
      entryPoint: 'groveStreet1',
    };

    this.terrainPaint(37, 36, 1, 1, 'WoodenFloor');
  }
}

/*
 *
 *  Paradise/Locales/1 Grove Street
 *  Declan Tyson
 *  v0.0.54
 *  16/02/2018
 *
 */

class GroveStreet2 extends GroveStreetTemplate {
  constructor(player, people, inhabitance) {
    super(player, people, inhabitance);

    this.id = 'GroveStreet2';
    this.entryPoints.frontDoor = { x: 26, y: 36 };

    this.entrances[25][36] = {
      locale: 'Islands',
      entryPoint: 'groveStreet2',
    };

    this.terrainPaint(25, 36, 1, 1, 'WoodenFloor');
  }
}

/*
 *
 *  Paradise/Locales/1 Grove Street
 *  Declan Tyson
 *  v0.0.54
 *  16/02/2018
 *
 */

class GroveStreet3 extends GroveStreetTemplate {
  constructor(player, people, inhabitance) {
    super(player, people, inhabitance);

    this.id = 'GroveStreet3';
    this.entryPoints.frontDoor = { x: 36, y: 36 };

    this.entrances[37][36] = {
      locale: 'Islands',
      entryPoint: 'groveStreet3',
    };

    this.terrainPaint(37, 36, 1, 1, 'WoodenFloor');
  }
}

/*
 *
 *  Paradise/Locales/4 Grove Street
 *  Declan Tyson
 *  v0.0.54
 *  16/02/2018
 *
 */

class GroveStreet4 extends GroveStreetTemplate {
  constructor(player, people, inhabitance) {
    super(player, people, inhabitance);

    this.id = 'GroveStreet4';
    this.entryPoints.frontDoor = { x: 26, y: 36 };

    this.entrances[25][36] = {
      locale: 'Islands',
      entryPoint: 'groveStreet4',
    };

    this.terrainPaint(25, 36, 1, 1, 'WoodenFloor');
  }
}

/*
 *
 *  Paradise/Decorative/Dresser
 *  Declan Tyson
 *  v0.0.80
 *  17/01/2019
 *
 */

class Dresser extends Decorative {
  constructor(x, y) {
    super('Dresser', 'a fancy dresser', '/oob/Decorative/dresser.png', x, y, [false, false]);
    this.lines = [`It's a fancy dresser.`];

    this.resetInteractions();

    this.addConversationOption('Search', 'Open the drawers');
    this.addResponse(
      'Search',
      'You find nothing but a dead fly. You hope he had a fulfilling life.'
    );
    this.addConversationOption('Leave', 'Shut the drawer and go elsewhere.', 'Search');

    this.addConversationOption(
      'FreakOut',
      'Touch the mysterious looking button',
      null,
      this.scream
    );
    this.addResponse('FreakOut', 'You are now scarred for life.');
    this.addConversationOption('FreakOut', 'Press the button again', 'FreakOut', this.scream);
    this.addConversationOption('Leave', 'Break the cycle', 'FreakOut');

    this.addConversationOption('Leave', 'Indeed it is.');
  }

  scream() {
    alert('AHHAHHHHHH!!!!!!');
  }
}

/*
 *
 *  Paradise/Decorative/Rug
 *  Declan Tyson
 *  v0.0.49
 *  15/02/2018
 *
 */

class Rug extends Decorative {
  constructor(x, y) {
    super('Rug', 'a fancy rug', '/oob/Decorative/rug.png', x, y, [], false);
  }
}

/*
 *
 *  Paradise/Locales/Ball Manor
 *  Declan Tyson
 *  v0.0.54
 *  16/02/2018
 *
 */

class BallManor extends GroveStreetTemplate {
  constructor(player, people, inhabitance) {
    super(player, people, inhabitance);

    this.id = 'BallManor';
    this.entryPoints.frontDoor = { x: 36, y: 36 };

    this.entrances[36][37] = {
      locale: 'Islands',
      entryPoint: 'ballManor',
    };

    this.terrainPaint(36, 37, 1, 1, 'WoodenFloor');

    this.addDecoration(new Dresser(26, 26));
    this.addDecoration(new Rug(32, 32));
  }
}

/*
 *
 *  Paradise/Locales
 *  Declan Tyson
 *  v0.0.49
 *  15/02/2018
 *
 */

const startingMaps = {
  Village: Village,
  Islands: Islands,
};

const locales = {
  Village: Village,
  Islands: Islands,
  GroveStreet1: GroveStreet1,
  GroveStreet2: GroveStreet2,
  GroveStreet3: GroveStreet3,
  GroveStreet4: GroveStreet4,
  BallManor: BallManor,
  TownHall: TownHall,
};

const chooseStartingMap = () => {
  let locale = Util.pickRandomProperty(startingMaps);
  Util.log('Choosing starting map...');
  Util.log(`Map is ${locale}.`);
  return locale;
};

/*
 *
 *  Paradise/Party Member
 *  Declan Tyson
 *  v0.0.97
 *  06/05/2020
 *
 */

class PartyMember {
  constructor(name, health, baseAttack, baseDefence, baseSpeed, sprite) {
    this.id = name;
    this.name = name;
    this.health = health;
    this.attack = baseAttack;
    this.defence = baseDefence;
    this.speed = baseSpeed;

    this.experience = 0;
    this.level = 1;

    let image = new Image();
    image.src = sprite;
    this.sprite = image;
  }

  attack(target) {
    let attackValue = this.attack - target.defence;
    if (attackValue < 0) attackValue = 1;

    target.health -= attackValue;
  }
}

/*
 *
 *  Paradise/Party Members/Hero
 *  Declan Tyson
 *  v0.0.97
 *  06/05/2020
 *
 */

class Hero extends PartyMember {
  constructor() {
    super('Hero', 100, 7, 6, 5, '/img/PartyMembers/hero.png');
    this.colour = colours.gold;
  }
}

/*
 *
 *  Paradise/Party Members
 *  Declan Tyson
 *  v0.0.97
 *  06/05/2020
 *
 */

let partymembers = {
  Hero,
};

/*
 *
 *  Paradise/Game
 *  Declan Tyson
 *  v0.0.97
 *  06/05/2020
 *
 */

const StartGame = (scene, locale = null, activePeople, player, renderer) => {
  clearInterval(window.drawScene);
  const canvasProperties = settings.canvasProperties();

  if (window.debug) {
    document.getElementById('log').style.display = 'block';
  }

  player = player || new Player();
  scene = scene || new WorldMap(player);
  renderer = renderer || new Renderer('world', canvasProperties.width, canvasProperties.height);

  let game = new Game(renderer, scene, canvasProperties.centerPoint);
  window.game = game;
  game.people = people;
  game.enemies = enemies;
  game.partymembers = partymembers;
  game.locales = locales;

  if (!locale) {
    game.loading = false;
    return;
  }

  let start = new locale(player, activePeople);
  game.scene.setCurrentLocale(start, 'beginningOfGame');
  game.initTerrainSprites();
};

class Renderer {
  constructor(element, width, height) {
    this.canvas = document.getElementById(element);
    this.canvas.style.width = width;
    this.canvas.style.height = height;
    this.canvas.style.display = 'block';
    this.canvas.width = width;
    this.canvas.height = height;
    this.fps = settings.get('fps');
    this.ctx = this.canvas.getContext('2d');
  }
}

class Game {
  constructor(renderer, scene, centerPoint) {
    this.actionTimeout = settings.get('actionTimeoutLimit');
    this.renderer = renderer;
    this.setScene(scene);
    this.centerPoint = centerPoint;
    this.currentAction = null;
    this.terrainSprites = {};
    this.redraw = true;
    this.spritesLoaded = 0;
    this.loading = true;
    this.currentParty = [];

    this.draw();
  }

  initTerrainSprites() {
    let locale = this.scene.locale,
      localeMap = this.scene.localeMap;

    for (let x = 0; x < locale.width; x++) {
      for (let y = 0; y < locale.height; y++) {
        let terrain = localeMap[x][y];
        if (terrain.image && !this.terrainSprites[terrain.image]) {
          /* jshint ignore:start */
          let tile = new Image();
          tile.src = terrain.image;
          this.terrainSprites[localeMap[x][y].image] = tile;

          tile.onload = () => {
            this.spritesLoaded++;
            if (this.spritesLoaded >= Object.keys(this.terrainSprites).length) {
              setTimeout(() => {
                this.loading = false;
              }, settings.get('minLoadingTime'));
            }
          };
          tile.onerror = () => {
            tile.src = terrain.fallbackImage;
          };
          /* jshint ignore:end */
        }
      }
    }
  }

  draw() {
    let pre_canvas = document.createElement('canvas'),
      pre_ctx = pre_canvas.getContext('2d');
    pre_canvas.height = this.renderer.canvas.height;
    pre_canvas.width = this.renderer.canvas.width;

    this.renderer.ctx.clearRect(0, 0, this.renderer.canvas.width, this.renderer.canvas.height);

    this.scene.doActions(this.currentAction);
    this.scene.draw(pre_ctx);

    if (this.loading) {
      let loading = new Image();
      loading.src = settings.get('loadingScreen');
      this.cachedCanvas = loading;
    } else if (this.redraw) {
      this.cachedCanvas = pre_canvas;
    }
    this.renderer.ctx.drawImage(
      this.cachedCanvas,
      0,
      0,
      this.renderer.canvas.width,
      this.renderer.canvas.height
    );

    window.requestAnimationFrame(this.draw.bind(this));
  }

  setScene(scene) {
    this.scene = scene;
    this.scene.setGame(this);
  }

  sendInput(input) {
    this.currentAction = input;
    this.keyHeld = input;
  }

  triggerActionTimeout() {
    this.actionTimeoutCounterInterval = setInterval(
      this.actionTimeoutCounter.bind(this),
      1000 / this.renderer.fps
    );
  }

  actionTimeoutCounter() {
    this.actionTimeout--;
    if (this.actionTimeout === 0) {
      clearInterval(this.actionTimeoutCounterInterval);
      this.actionTimeout = settings.get('actionTimeoutLimit');
    }
  }

  addPartyMember(id) {
    this.currentParty.push(new this.partymembers[id]());
  }

  onLoad() {
    this.scene.onLoad();
  }
}

/*
 *
 *  Paradise/People
 *  Declan Tyson
 *  v0.0.92
 *  21/10/2019
 *
 */

const choosePeople = () => {
  const personCount = settings.get('personCount');
  let chosenPeople = [];
  Util.log(`Choosing ${personCount} people...`);
  let person;
  while (chosenPeople.length < personCount) {
    person = Util.pickRandomProperty(people);
    if (chosenPeople.indexOf(person) === -1) {
      chosenPeople.push(person);
      Util.log(`${person} has been chosen.`);
    }
  }

  return chosenPeople;
};

/*
 *
 *  Paradise/Scene-Menu
 *  Declan Tyson
 *  v0.0.92
 *  21/10/2019
 *
 */

class Menu extends Scene {
  constructor(backgroundImageSrc, optionsArea) {
    super();

    const canvasProperties = settings.canvasProperties();

    this.selectedMenuItem = 0;

    this.keyHeld = true;
    this.menuItems = [];

    let backgroundImage = new Image();
    backgroundImage.src = backgroundImageSrc;
    this.backgroundImage = backgroundImage;

    this.actions.up = this.previousOption.bind(this);
    this.actions.down = this.nextOption.bind(this);
    this.actions.action = this.chooseOption.bind(this);

    this.optionsArea = optionsArea || {
      x: 0,
      y: 0,
      width: canvasProperties.width / 2,
      height: canvasProperties.height,
      optionsOffsetX: 40,
      optionsOffsetY: 100,
      optionHeight: 36,
    };
  }

  draw(ctx) {
    if (!this.game.keyHeld) this.keyHeld = false;
    const canvasProperties = settings.canvasProperties();

    ctx.drawImage(this.backgroundImage, 0, 0, canvasProperties.width, canvasProperties.height);
    this.drawOptions(ctx);
  }

  drawOptions(ctx) {
    const canvasProperties = settings.canvasProperties();

    let y = canvasProperties.height - this.optionsArea.height + this.optionsArea.optionsOffsetY;

    ctx.font = settings.get('fonts').small;
    ctx.fillStyle = colours.white;

    this.menuItems.forEach((menuItems, index) => {
      ctx.fillText(
        menuItems.value,
        this.optionsArea.x + this.optionsArea.optionsOffsetX,
        y + index * this.optionsArea.optionHeight
      );
      if (index === this.selectedMenuItem) {
        ctx.strokeStyle = colours.white;
        ctx.strokeRect(
          this.optionsArea.x + this.optionsArea.optionsOffsetX - this.optionsArea.optionHeight / 2,
          y + index * this.optionsArea.optionHeight - this.optionsArea.optionHeight / 1.5,
          this.optionsArea.width - this.optionsArea.optionsOffsetX,
          this.optionsArea.optionHeight
        );
      }
    });
  }

  nextOption() {
    if (this.keyHeld) return;

    if (this.selectedMenuItem < this.menuItems.length - 1) this.selectedMenuItem++;
    this.keyHeld = true;
  }

  previousOption() {
    if (this.keyHeld) return;

    if (this.selectedMenuItem > 0) this.selectedMenuItem--;
    this.keyHeld = true;
  }

  chooseOption() {
    if (this.keyHeld) return;

    this.menuItems[this.selectedMenuItem].callback();
    this.keyHeld = true;
  }

  addMenuItem(key, value, callback = () => {}) {
    this.menuItems.push({ key, value, callback });
  }
}

/*
 *
 *  Paradise/Scene-Menu/Test Menu
 *  Declan Tyson
 *  v0.0.78
 *  24/09/2018
 *
 */

class TestMenu extends Menu {
  constructor() {
    const canvasProperties = settings.canvasProperties();
    super('/img/loading.png', {
      x: canvasProperties.width / 2,
      y: 0,
      width: canvasProperties.width / 2,
      height: canvasProperties.height,
      optionsOffsetX: 40,
      optionsOffsetY: 250,
      optionHeight: 36,
    });

    this.addMenuItem('random', 'Start with random', () => {
      this.startGame();
    });

    this.addMenuItem('random', 'Start with test data', () => {
      this.startGame('Islands', ['Zenith', 'Quazar', 'Jill', 'John']);
    });

    this.addMenuItem('isometric', 'Start in isometric mode', () => {
      settings.set('renderMode', 'isometric');
      this.startGame('Islands', ['Zenith', 'Quazar', 'Jill', 'John']);
    });

    this.addMenuItem('random', 'Start in full debug mode', () => {
      window.debug = true;
      this.startGame('Islands', ['Zenith', 'Quazar', 'Jill', 'John']);
    });
  }

  startGame(locale, people) {
    Util.clearLog();

    locale = startingMaps[locale] || startingMaps[chooseStartingMap()];

    people = people || choosePeople();

    let player = new Player(),
      worldMap = new WorldMap(player),
      start = new locale(player, people);

    window.game.addPartyMember('Hero');
    window.game.setScene(worldMap);
    window.game.scene.setCurrentLocale(start, 'beginningOfGame');
    window.game.loading = true;
    window.game.initTerrainSprites();

    window.game.onLoad();
  }
}

/*
 *
 *  Paradise
 *  Declan Tyson
 *  v0.0.72
 *  21/09/2018
 *
 */

export { StartGame, actions, Interaction, ObjectInteraction, Item, Locale, Inhabitance, Interior, Player, choosePeople, Person, Scene, terrains, Util, WorldMap, Decorative, Renderer, Game, Portrait, settings, startingMaps, chooseStartingMap, people, enemies, Evelyn, Jill, John, Neil, Pauline, Petey, Quazar, Zenith, Dresser, Rug, Tree, Terrain, Menu, TestMenu, Slime };
