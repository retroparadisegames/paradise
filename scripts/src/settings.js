/*
 *
 *  Paradise/Settings
 *  Declan Tyson
 *  v0.0.98
 *  06/05/2020
 *
 */

import { colours } from './constants';

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

export { settings };
