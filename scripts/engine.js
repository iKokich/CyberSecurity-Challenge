// Ядро состояния и загрузки вопросов
const Engine = (() => {
  const state = {
    team: null,
    score: 0,
    index: 0,
    questions: []
  };

  const setTeam = (team) => { state.team = team; };
  const getTeam = () => state.team;

  const loadQuestions = async () => {
    const res = await fetch('../data/scenes.json', { cache: 'no-store' });
    const data = await res.json();
    state.questions = Array.isArray(data.questions) ? data.questions : [];
    return state.questions;
  };

  const getCurrent = () => state.questions[state.index];
  const hasNext = () => state.index < state.questions.length - 1;
  const next = () => { if (hasNext()) state.index += 1; };
  const reset = () => { state.score = 0; state.index = 0; };
  const addScore = (n = 1) => { state.score += n; };

  return {
    state, setTeam, getTeam,
    loadQuestions, getCurrent, hasNext, next, reset, addScore
  };
})();
