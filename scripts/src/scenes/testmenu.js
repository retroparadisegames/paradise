/*
 *
 *  Paradise/Scene-Menu/Test Menu
 *  Declan Tyson
 *  v0.0.78
 *  24/09/2018
 *
 */

import { Util } from '../engine/util';
import { choosePeople } from '../engine/people';
import { Player } from '../engine/player';
import { WorldMap } from '../engine/worldmap';
import { Menu } from '../engine/menu';
import { settings } from '../settings';

import { startingMaps, chooseStartingMap } from '../locales/locales';

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

export { TestMenu };
