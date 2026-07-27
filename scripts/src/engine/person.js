/*
 *
 *  Paradise/Person
 *  Declan Tyson
 *  v0.0.95
 *  21/10/2019
 *
 */

import { Util } from './util';
import { colours, posessivePronouns, directions } from '../constants';
import { Portrait } from './portrait';
import { Interaction } from './interaction';
import { settings } from '../settings';

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

export { Person };
