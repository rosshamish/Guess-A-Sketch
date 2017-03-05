/**
 * Created by anjueappen on 3/4/17.
 */
import SimpleSchema from 'simpl-schema';

export const Schema = {};

Schema.Player = new SimpleSchema({
    playerID: {//TODO: unique
        type: String,
        label: "Player ID",
        regEx: SimpleSchema.RegEx.Id,
    },
    name: {
        type: String,
        label: "Player Name",
    },
    color:{
        type: String,
        label: "Player Color",
        optional: true,
    },
});

Schema.Sketch = new SimpleSchema({
    sketchID: { //TODO: unique
        type: String,
        label: "Sketch ID",
        regEx: SimpleSchema.RegEx.Id,
    },
    player:{
        type: Schema.Player,
        label: "Sketch Artist",
    },
    sketch:{
        type: String,
        label: "Base64 Encoded Sketch",
    },
    scores:{
        type: Object,
        label: "SketchNet Scores",
        defaultValue: {},
    },
    prompt:{
        type: String,
        label: "Sketch Prompt",
    },
});

Schema.Round = new SimpleSchema({
    roundID:{//TODO: unique
        type: String,
        label: "Round ID",
        regEx: SimpleSchema.RegEx.Id,

    },
    prompt:{
        type: String,
        label: "Round Prompt",
    },
    sketches:{
        type: Array,
        label: "Round Sketches",
        defaultValue: [],
        minCount: 0,
    },
    "sketches.$": {
        type: Schema.Sketch,
    },

});

Schema.Room = new SimpleSchema({
    roomID: {//TODO: unique
        type: String,
        label: "Room ID",
        // regEx: SimpleSchema.RegEx.Id,
    },
    name: {//TODO: unique
        type: String,
        label: "Room Name",
    },
    rounds: {
        type: Array,
        label: "Round List",
        minCount: 1,
        optional: true, //TODO: Remove this
    },
    'rounds.$':{
        type: Schema.Round,
    },

    players: {
        type: Array,
        label: "Player List",
        defaultValue: []
        // optional: true, //TODO: Remove this

    },
    'players.$': {
        type: Schema.Player,
    },

    status: {
        type: String,
        label: "Room Status",
        allowedValues: ["JOINABLE", "COMPLETE", "PLAYING"],
        defaultValue: "JOINABLE",
    }
});