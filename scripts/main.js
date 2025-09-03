import { createEngine } from './engine.js';

fetch('./data/scenes.json')
  .then(r => r.json())
  .then(scenes => {
    scenes.forEach(s => { if (s.bg) { const i = new Image(); i.src = s.bg; } });
    createEngine({ scenes, onScore: score => console.log('Score:', score) });
  })
  .catch(err => console.error('Не удалось загрузить сцены:', err));
