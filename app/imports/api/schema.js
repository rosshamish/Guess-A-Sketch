/**
 * Created by anjueappen on 3/4/17.
 */
import SimpleSchema from 'simpl-schema';

export const Schema = {};

Schema.Player = new SimpleSchema({
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
    name: {
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