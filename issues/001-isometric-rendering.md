# 001 · Isometric Rendering — Add an isometric projection mode to the engine

## Context

The Paradise engine currently renders the world as a top-down 2D tile grid (`Renderer` in `scripts/src/engine/game.js` draws `localeMap[x][y]` terrain sprites directly to a canvas). This works for the existing orthographic art style, but an isometric projection would give the world more depth and better match classic RPG visuals.

## Goal

Introduce a toggleable **isometric rendering mode** that transforms how the tile map, objects, and characters are drawn without changing the underlying grid data or gameplay logic.

## Proposed Approach

1. Add a `renderMode` setting to `scripts/src/settings.js` with valid values `orthographic` (default) and `isometric`.
2. Extend `Renderer` (or add an `IsometricRenderer`) to project grid coordinates `(x, y)` to isometric screen coordinates:
   ```
   screenX = (x - y) * tileWidth / 2 + offsetX
   screenY = (x + y) * tileHeight / 4 + offsetY
   ```
3. Update `WorldMap.draw` / `scene.draw` in `scripts/src/engine/worldmap.js` and `scripts/src/engine/scene.js` to:
   - Use painter’s algorithm: render tiles from back (top of map) to front (bottom of map) so nearer tiles overlap farther ones.
   - Offset sprites so they align to the isometric diamond.
4. Adjust entity rendering (player, NPCs, objects) so their screen positions follow the same projection and they are drawn at the correct vertical anchor point.
5. Keep input handling unchanged: map screen coordinates back to grid coordinates for interactions if necessary, or continue to rely on grid-based movement.
6. Provide at least one fallback asset path or support existing `/oob` sprites stretched/rotated until dedicated isometric assets exist.

## Acceptance Criteria

- [ ] `renderMode: 'isometric'` can be set in `settings.js` and the engine starts without errors.
- [ ] The same `localeMap` renders as an isometric diamond grid with correct overlap ordering.
- [ ] Player and NPCs appear positioned on the correct tiles in isometric mode.
- [ ] Switching `renderMode` back to `orthographic` restores the original top-down view.
- [ ] No gameplay or input logic depends on the rendering mode.

## Related Files

- `scripts/src/settings.js`
- `scripts/src/engine/game.js`
- `scripts/src/engine/worldmap.js`
- `scripts/src/engine/scene.js`
- `scripts/src/engine/terrain.js`
- `scripts/src/engine/player.js`
- `scripts/src/engine/person.js`
