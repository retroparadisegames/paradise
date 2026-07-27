/*
 *
 *  Paradise/Decorative
 *  Declan Tyson
 *  v0.0.92
 *  21/10/2019
 *
 */

import { colours } from '../constants';
import { settings } from '../settings';
import { ObjectInteraction } from './objectinteraction';
import { Util } from './util';

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

export { Decorative };
