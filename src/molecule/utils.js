import { PASSAGES } from "./data";

export function pickPassage(level) {
  const list = PASSAGES[level];
  return list[Math.floor(Math.random() * list.length)];
}

export function computeStats(passage, typed) {
  let correct = 0;
  let wrong = 0;
  for (let i = 0; i < typed.length; i++) {
    if (typed[i] === passage[i]) correct++;
    else wrong++;
  }
  return { correct, wrong };
}
