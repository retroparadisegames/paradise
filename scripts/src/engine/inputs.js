/*
 *
 *  Paradise/Inputs
 *  Declan Tyson
 *  v0.0.21
 *  06/02/2018
 *
 */

export const actions = {
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
