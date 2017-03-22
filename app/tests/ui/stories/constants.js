export const players = [{
  name: "Alice",
  color: "red",
  }, {
  name: "Bob",
  color: "blue",
  }, {
  name: "Eve",
  color: "black",
}];

// TODO put a real sketch dataURL here
export const sketches = [{
  player: players[0],
  sketch: "",
  prompt: "apple",
}];

export const rooms = [{
  name: "Playtest 1",
  rounds: [{
    index: 0,
    prompt: "apple",
    sketches: sketches,
    time: 10,
    status: "RESULTS",
  }, {
    index: 1,
    prompt: "banana",
    sketches: [],
    time: 10,
    status: "CREATED",
  }],
  players: players,
  status: "JOINABLE",
  }, {
  name: "ECE Design Showcase",
  rounds: [],
  players: players.concat(players),
  status: "JOINABLE",
  }, {
  name: "Development (Playing)",
  rounds: [],
  players: players,
  status: "PLAYING",
  }, {
  name: "Should not see this",
  rounds: [],
  players: [],
  status: "COMPLETE",
}];
