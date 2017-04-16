import { Meteor } from 'meteor/meteor';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import SimpleSchema from 'simpl-schema';
import { _ } from 'underscore';

import { Sketches } from './collections/sketches';
import { Rooms } from './collections/rooms';
import { 
  Schema,
} from './schema';

import {
  currentRound,
} from '../game-status';

import {
  getAllPrompts,
  getFallbackPrompts,
  getScoresForSketch,
  getFallbackScores,
} from '../sketch-net';
import gametype from '../gametypes';


function changeRoomStatus(room, status, callback) {
  Rooms.update({
    _id: room._id,
  }, {
    $set: {
      status,
    },
  }, callback);
}

function changeRoundStatus(room, round, status, callback) {
  Rooms.update({
    _id: room._id,
    "rounds.index": round.index,
  }, {
    $set:{
      "rounds.$.status": status,
    },
  }, callback);
}

export const errors = {
  validationError: 'validation-error',
  submitSketch: {
    insertFailure: 'submitSketch.insertFailure',
    scoreUpdateFailure: 'submitSketch.scoreUpdateFailure',
  },
  scoreSketch: {
    noAPI: 'scoreSketch.noAPI',
  },
  leaveRoom: {
    noRoom: 'leaveRoom.noRoom',
    playerNotInRoom: 'leaveRoom.playerNotInRoom',
    pullPlayer: 'leaveRoom.pullPlayer',
  },
  joinRoom: {
    noRoom: 'joinRoom.noRoom',
    joinability: 'joinRoom.joinability',
    uniqueName: 'joinRoom.uniqueName',
    pushPlayer: 'joinRoom.pushPlayer',
  },
  startRound: {
    noRoom: 'startRound.noRoom',
    roomStatus: 'startRound.roomStatus',
    roundStatus: 'startRound.roundStatus',
  },
  playRound: {
    noRoom: 'playRound.noRoom',
    roundStatus: 'playRound.roundStatus',
  },
  roundTimerOver: {
    noRoom: 'roundTimerOver.noRoom',
    roomStatus: 'roundTimerOver.roomStatus',
    roundStatus: 'roundTimerOver.roundStatus',
  },
  endRound: {
    noRoom: 'endRound.noRoom',
    roundStatus: 'endRound.roundStatus',
  },
  endGame: {
    noRoom: 'endGame.noRoom',
    roomStatus: 'endGame.roomStatus',
  },
  createRoom: {
    noName: 'createRoom.noName',
    uniqueName: 'createRoom.uniqueName',
    roundCount: 'createRoom.roundCount',
    roundTime: 'createRoom.roundTime',
    gametype: 'createRoom.gametype',
    insertRoom: 'createRoom.insertRoom',
  },
};

// SRS 3.2.3.5 : Recieving Sketches from Individuals at End of Round

export const submitSketch = new ValidatedMethod({
  name: 'submitSketch',
  validate: new SimpleSchema({
    player: {
      type: Schema.Player,
    },
    sketch: {
      type: String,
    },
    prompt: {
      type: String,
    },
    roundIndex: {
      type: Number,
    },
  }).validator(),
  run({ player, sketch, prompt, roundIndex }) {
    Sketches.insert({
      player,
      sketch,
      prompt,
    }, (error, sketchID) => {
      if (error) {
        throw new Meteor.Error(errors.submitSketch.insertFailure,
          'Failed to insert the sketch in the collection',
          `For player ${player.name}, prompt ${prompt}`);
      }

      Rooms.update({
        "players.name": player.name,
        "rounds.index": roundIndex,
      }, {
        $push: {
          "rounds.$.sketches": sketchID,
        },
      }, (error, result) => {
        if (error) {
          throw new Meteor.Error(errors.submitSketch.insertFailure,
            'Failed to insert sketch ID into the room');
        }
      });

      // Get the score from SketchNet, update the DB.
      // This should only run on the server, since the client shouldn't
      // hit the network.
      if (Meteor.isServer) {
        let scores = [];
        try {
          const result = Meteor.wrapAsync(getScoresForSketch)(sketch);
          if (result) {
            scores = result.data;
          }
        } catch (error) {
          console.error(`SketchNet API unreachable. Using fallback scores instead. ${error}`);
          scores = getFallbackScores();
        }

        Sketches.update(sketchID, {
          $set: {
            scores,
          },
        }, (error, result) => {
          if (error) {
            throw new Meteor.Error(submitSketch.scoreUpdateFailure,
              'Failed to add scores to the sketch',
              `For player ${player.name}, prompt ${prompt}, scores ${scores}`);
          }
        });
      }
    });
  },
});

// SRS 3.2.3.7 : Request for Round Results
// SRS 3.2.3.8 : Creating Scoreboard Statistics

// Used only for tuning Sketchnet, see React component SketchnetTuning.jsx
// Do not use for any other purpose!!
export const scoreSketch = new ValidatedMethod({
  name: 'scoreSketch',
  validate: new SimpleSchema({
    sketch: {
      type: String,
    },
  }).validator(),
  run({ sketch }) {
    // Get the score from SketchNet, update the DB.
    // This should only run on the server, since the client shouldn't
    // hit the network.
    if (Meteor.isServer) {
      let scores = [];
      try {
        const result = Meteor.wrapAsync(getScoresForSketch)(sketch);
        if (result) {
          scores = result.data;
        }
      } catch (error) {
        console.error(error);
        throw new Meteor.Error(errors.scoreSketch.noAPI);
      }
      return scores;
    }

    // Always return null when simulating.
    return null;
  },
});

export const leaveRoom = new ValidatedMethod({
  name: 'leaveRoom',
  validate: new SimpleSchema({
    room_id: {
      type: String,
    },
    player: {
      type: Schema.Player,
    },
  }).validator(),
  run({ room_id, player }) {
    const room = Rooms.findOne({
      _id: room_id,
    });
    if (!room) {
      throw new Meteor.Error(errors.leaveRoom.noRoom,
        'Couldn\'t find the room',
        `For room id ${room_id}`);
    }

    const playerInRoom = _.find(room.players, (existingPlayer) => {
      return existingPlayer.name === player.name;
    });
    if (!playerInRoom) {
      throw new Meteor.Error(errors.leaveRoom.playerNotInRoom,
        'Cannot leave room -- player was never in the room.',
        `For room id ${room_id}, player ${player.name}`);
    }

    // Remove the player from the room
    Rooms.update({
      _id: room_id,
    }, {
      $pull: {
        players: player,
      },
    }, (error, result) => {
      if (error) {
        throw new Meteor.Error(errors.leaveRoom.pullPlayer,
          'Failed to remove player from the room',
          `For room id ${room_id}, player ${player.name}`);
      }
    });
  },
});

// SRS 3.2.3.3 : Adding Participants to Room

export const joinRoom = new ValidatedMethod({
  name: 'joinRoom',
  validate: new SimpleSchema({
    room_id: {
      type: String,
    },
    player: {
      type: Schema.Player,
    },
  }).validator(),
  run({ room_id, player }) {
    const room = Rooms.findOne({
      _id: room_id,
    });
    if (!room) {
      throw new Meteor.Error(errors.joinRoom.noRoom,
        'Couldn\'t find the room',
        `For room id ${room_id}`);
    }

    if (room.status !== 'JOINABLE') {
      throw new Meteor.Error(errors.joinRoom.joinability,
        'Cannot join a non-joinable room',
        `For room id ${room_id}`);
    }

    const playerNameUnique = _.every(room.players, (existingPlayer) => {
      return existingPlayer.name != player.name;
    });
    if (!playerNameUnique) {
      throw new Meteor.Error(errors.joinRoom.uniqueName,
        'Cannot join room. Name must be unique.',
        `For room id ${room_id}, player ${player.name}`);
    }
    
    // Add the player to the room
    if (currentRound(room).status === 'CREATED') {
      // Round not started, push to the actual player list
      Rooms.update({
        _id: room_id,
      }, {
        $push: {
          players: player,
        },
      }, (error, result) => {
        if (error) {
          throw new Meteor.Error(errors.joinRoom.pushPlayer,
            'Failed to push player onto room\'s players Array',
            `Collection error ${error}`);
        }
      });
    } else {
      // In-between rounds, push to waiting players
      Rooms.update({
        _id: room_id,
      }, {
        $push: {
          joiningPlayers: player,
        },
      }, (error, result) => {
        if (error) {
          throw new Meteor.Error(errors.joinRoom.pushPlayer,
            'Failed to push player onto room\'s joiningPlayers Array',
            `Collection error ${error}`);
        }
      });
    }
  },
});

export const startRound = new ValidatedMethod({
  name: 'startRound',
  validate: new SimpleSchema({
    room_id: {
      type: String,
    },
  }).validator(),
  run({ room_id }) {
    const room = Rooms.findOne({
      _id: room_id,
    });
    if (!room) {
      throw new Meteor.Error(errors.startRound.noRoom,
        'Couldn\'t find the room',
        `For room id ${room_id}`);
    }

    // Add waiting players to the room
    _.each(room.joiningPlayers, (player) => {
      Rooms.update({
        _id: room_id,
      }, {
        $push: {
          players: player,
        },
        $pull: {
          $elemMatch: { joiningPlayers: { name: player.name } },
        },
      });
    });

    // Update the room and round status
    changeRoomStatus(room, 'PLAYING', (error, result) => {
      if (error) {
        throw new Meteor.Error(errors.startRound.roomStatus,
          'Failed to change room status to PLAYING');
      }
      changeRoundStatus(room, currentRound(room), 'PRE', (error, result) => {
        if (error) {
          throw new Meteor.Error(errors.startRound.roundStatus,
            'Failed to change round status to PRE');
        }
      });
    });
  },
});


export const playRound = new ValidatedMethod({
  name: 'playRound',
  validate: new SimpleSchema({
    room_id: {
      type: String,
    },
  }).validator(),
  run({ room_id }) {
    let room = Rooms.findOne({
      _id: room_id
    });
    if (!room) {
      throw new Meteor.Error(errors.playRound.noRoom,
        'Couldn\'t find the room',
        `For room id ${room_id}`);
    }

    changeRoundStatus(room, currentRound(room), 'PLAY', (error, result) => {
      if (error) {
        throw new Meteor.Error(errors.playRound.roundStatus, '',
          `${error}`);
      }
    });
  },
});

// SRS 3.2.3.4 : Send Next Prompt to Host UI

export const roundTimerOver = new ValidatedMethod({
  name: 'roundTimerOver',
  validate: new SimpleSchema({
    room_id: {
      type: String,
    },
  }).validator(),
  run({ room_id }) {
    let room = Rooms.findOne({
      _id: room_id
    });
    if (!room) {
      throw new Meteor.Error(errors.roundTimerOver.noRoom,
        'Couldn\'t find the room',
        `For room id ${room_id}`);
    }

    changeRoomStatus(room, 'JOINABLE', (error, result) => {
      if (error) {
        throw new Meteor.Error(errors.roundTimerOver.roomStatus, '',
          `${error}`);
      }
    });

    changeRoundStatus(room, currentRound(room), 'RESULTS', (error, result) => {
      if (error) {
        throw new Meteor.Error(errors.roundTimerOver.roundStatus, '',
          `${error}`);
      }
    });
  },
});

export const endRound = new ValidatedMethod({
  name: 'endRound',
  validate: new SimpleSchema({
    room_id: {
      type: String,
    },
  }).validator(),
  run({ room_id }) {
    let room = Rooms.findOne({
      _id: room_id
    });
    if (!room) {
      throw new Meteor.Error(errors.endRound.noRoom,
        'Couldn\'t find the room',
        `For room id ${room_id}`);
    }

    changeRoundStatus(room, currentRound(room), 'END', (error, result) => {
      if (error) {
        throw new Meteor.Error(errors.endRound.roundStatus, '',
          `${error}`);
      }
    });
  },
});


export const endGame = new ValidatedMethod({
  name: 'endGame',
  validate: new SimpleSchema({
    room_id: {
      type: String,
    },
  }).validator(),
  run({ room_id }) {
    let room = Rooms.findOne({
      _id: room_id
    });
    if (!room) {
      throw new Meteor.Error(errors.endGame.noRoom,
        'Couldn\'t find the room',
        `For room id ${room_id}`);
    }

    // TO DO: Figure out why this is erroring out, even though it still 
    // successfully changes to room status from Joinable -> Complete
    changeRoomStatus(room, 'COMPLETE', (error, result) => {
      if (error) {
        throw new Meteor.Error(errors.endGame.roomStatus, '',
          `${error}`);
      }
    });
  },
});

// SRS 3.2.3.2 : Creating a Room

export const createRoom = new ValidatedMethod({
  name: 'createRoom',
  validate: new SimpleSchema({
    room_name: {
      type: String,
    },
    round_count: {
      type: Number,
    },
    round_time: {
      type: Number,
    },
    prompts: {
      type: String,
      defaultValue: 'easy',
    },
  }).validator(),
  run({ room_name, round_count, round_time, prompts }) {
    if (!room_name || !room_name.length) {
      throw new Meteor.Error(errors.createRoom.noName,
        'Room name must be non-null and non-empty',
        `For room name ${room_name}`);
    } else if (Rooms.find({ name: room_name }).count() > 0) {
      throw new Meteor.Error(errors.createRoom.uniqueName,
        'Room name must be unique',
        `For room name ${room_name}`);
    } else if (round_count < 1) { // Keep this in sync with Schema.Room
      throw new Meteor.Error(errors.createRoom.roundCount,
        'There must be at least 1 round!',
        `Received round count ${round_count}`);
    } else if (round_time < 5) { // Keep this in sync with Schema.Round
      throw new Meteor.Error(errors.createRoom.roundTime,
        'Rounds must be at least 5 seconds',
        `Received round time ${round_time}`);
    }

    let rounds = [];
    try {
      rounds = gametype(prompts, {
        numRounds: round_count,
        roundTime: round_time,
      }).rounds;
    } catch (error) {
      throw new Meteor.Error(errors.createRoom.gametype,
        'Gametype failed to generate rounds, check that the gametype exists',
        `For gametype ${gametypeName}, error was ${error}`);
    }

    const roomID = Rooms.insert({ name: room_name, rounds: rounds }, (error, result) => {
      if (error) {
        throw new Meteor.Error(errors.createRoom.insertRoom, error);
      }
    });
    return roomID;
  },
});
