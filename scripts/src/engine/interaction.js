/*
 *
 *  Paradise/Scene-Interaction
 *  Declan Tyson
 *  v0.0.92
 *  21/10/2019
 *
 */

import { Util } from './util';

import { Scene } from './scene';
import { colours } from '../constants';
import { settings } from '../settings';

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

export { Interaction };
