import { Meteor } from 'meteor/meteor';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import SimpleSchema from 'simpl-schema';

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
    gametype: 'createRoom.gametype',
    insertRoom: 'createRoom.insertRoom',
  },
};


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
        // TODO remove
        console.log('failed to insert sketch');
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

    if (room.status != 'JOINABLE') {
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

    changeRoomStatus(room, 'COMPLETE', (error, result) => {
      throw new Meteor.Error(errors.endGame.roomStatus, '',
        `${error}`);
    })
  },
});

export const createRoom = new ValidatedMethod({
  name: 'createRoom',
  validate: new SimpleSchema({
    room_name: {
      type: String,
    },
    round_count: {
      type: Number,
      minCount: 1,
    },
    round_time: {
      type: Number,
      minCount: 5,
    },
    gametypeName: {
      type: String,
      defaultValue: 'standard',
    },
  }).validator(),
  run({ room_name, round_count, round_time, gametypeName }) {
    if (!room_name || !room_name.length) {
      throw new Meteor.Error(errors.createRoom.noName,
        'Room name must be non-null and non-empty',
        `For room name ${room_name}`);
    } else if (Rooms.find({ name: room_name }).count() > 0) {
      throw new Meteor.Error(errors.createRoom.uniqueName,
        'Room name must be unique',
        `For room name ${room_name}`);
    }

    let rounds = [];
    try {
      rounds = gametype(gametypeName, {
        _numRounds: round_count,
        _roundTime: round_time,
      }).rounds;
    } catch (error) {
      throw new Meteor.Error(errors.createRoom.gametype,
        'Gametype failed to generate rounds, check that the gametype exists',
        `For gametype ${gametypeName}, error was ${error}`);
    }

    const roomID = Rooms.insert({ name: room_name, rounds: rounds }, (error, result) => {
      if (error) {
        throw new Meteor.Error(errors.createRoom.insertRoom);
      }
    });
    return roomID;
  },
});
