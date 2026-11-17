'use strict';
(() => {
  const music = document.getElementById('birthdayMusic');
  const toggle = document.getElementById('musicToggle');
  let wanted = true;
  let started = false;
  let attempt = 0;
  music.volume = 0.23;
  function foregroundPlaying() {
    return [...document.querySelectorAll('#reveal audio, #reveal video')]
      .some(player => !player.paused && !player.ended);
  }
  function label() {
    const speaking = foregroundPlaying();
    toggle.textContent = !wanted ? '♪ Music off' : speaking ? '♪ Paused for voice' : music.paused ? '♪ Play music' : '♫ Music on';
    toggle.setAttribute('aria-pressed', String(wanted && started));
    toggle.setAttribute('aria-label', !wanted || !started ? 'Play birthday background music' : 'Turn off birthday background music');
  }
  function sync() {
    const generation = ++attempt;
    if (!wanted || foregroundPlaying() || document.hidden) {
      music.pause();
      label();
      return;
    }
    const result = music.play();
    if (result) result.then(() => {
      if (generation !== attempt || !wanted || foregroundPlaying() || document.hidden) {
        if (!wanted || foregroundPlaying() || document.hidden) music.pause();
      } else started = true;
      label();
    }).catch(label);
  }
  toggle.addEventListener('click', () => {
    if (!started) wanted = true;
    else wanted = !wanted;
    sync();
  });
  document.addEventListener('pointerdown', event => {
    if (event.target.closest('#musicToggle')) return;
    if (wanted && music.paused) sync();
  });
  document.addEventListener('keydown', event => {
    if ((event.key === 'Enter' || event.key === ' ') && wanted && music.paused && !event.target.closest('#musicToggle')) sync();
  });
  document.addEventListener('play', event => {
    if (event.target === music) { started = true; label(); return; }
    if (event.target.closest('#reveal')) { ++attempt; music.pause(); label(); }
  }, true);
  for (const type of ['pause', 'ended']) document.addEventListener(type, event => {
    if (event.target !== music && event.target.closest('#reveal')) setTimeout(sync, 0);
  }, true);
  document.getElementById('reveal').addEventListener('close', () => setTimeout(sync, 0));
  document.addEventListener('visibilitychange', sync);
  music.addEventListener('error', () => {
    toggle.textContent = 'Music unavailable';
    toggle.disabled = true;
  });
  label();
  sync();
})();
