# 002 · Dating Page — Fix 3-way chat rendering and persist matches between sessions
**Status:** wontfix

## Context

The dating page lets the player view potential matches and enter a 3-way chat with two other characters. Currently the page fails in two ways: the chat view throws a rendering error and renders no dialogue, and any matches made (or chat participants chosen) are lost as soon as the player leaves or refreshes the page.

## Goal

Make the dating page usable by resolving the chat rendering/state bug and ensuring match data survives across sessions.

## Proposed Approach

1. **Reproduce and diagnose the chat error**
   - Open the dating page and start a 3-way chat.
   - Capture the console error and identify whether it originates in component state, missing dialogue data, or an undefined participant reference.

2. **Fix chat rendering/state**
   - Ensure the chat component receives all three participants (player + two matches) before rendering messages.
   - Guard against `undefined` speaker names or empty dialogue arrays.
   - Render a fallback "…" or idle state when no one has a line, rather than crashing.
   - Verify the message list re-renders when dialogue advances.

3. **Persist match data**
   - Define a `matches` data shape (e.g. `{ id, participants: [name, name], createdAt, lastMessageAt }`).
   - Save matches to `localStorage` whenever a match is created or a chat ends.
   - Load saved matches when the dating page initialises and merge them with any runtime state.
   - Keep an in-memory cache on the game/player object so the UI stays reactive without constant storage reads.

4. **Add minimal test/debug hooks**
   - Expose a way to clear saved matches from the dating menu for local development.
   - Log storage read/write events behind `window.debug`.

## Acceptance Criteria

- [ ] Opening a 3-way chat from the dating page renders without errors.
- [ ] All three participants are visible and the current speaker is highlighted.
- [ ] Advancing dialogue shows the next line from the correct speaker.
- [ ] Creating a match updates the matches list immediately.
- [ ] Refreshing the page restores the previous matches list from storage.
- [ ] Returning to the dating page after leaving shows the same matches.

## Related Files

- `scripts/src/engine/person.js`
- `scripts/src/engine/people.js`
- `scripts/src/engine/game.js`
- `scripts/src/engine/scene.js`
- `scripts/src/engine/menu.js`
- `scripts/src/constants.js`
- `scripts/src/settings.js`
- `scripts/src/scenes/testmenu.js`
