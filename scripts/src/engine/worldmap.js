/*
 *
 *  Paradise/Scene-WorldMap
 *  Declan Tyson
 *  v0.0.96
 *  06/05/2020
 *
 */

import { terrains } from './terrains';
import { directions } from '../constants';
import { Scene } from './scene';
import { Encounter } from './encounter';
import { settings } from '../settings';

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
  }

  doActions(action) {
    super.doActions(action);

    if (!action) {
      this.player.resetSprite();
      return;
    }
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

export { WorldMap };
