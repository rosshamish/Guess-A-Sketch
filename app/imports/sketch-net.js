import { HTTP } from 'meteor/http';

const sketchNetURL = 'http://localhost:5000';

export function getAllPrompts(callback) {
  const prompts = `${sketchNetURL}/prompts`;
  HTTP.get(prompts, {}, callback);
}

export function getScore(sketch) {
  return null;
}
