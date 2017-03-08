/**
 * Created by anjueappen on 3/4/17.
 */
import SimpleSchema from 'simpl-schema';

export const Schema = {};
const PROMPTS = ['cat', 'dog', 'monkey', 'freezer', 'ice cream']; //TODO: change to sketchnet API call?

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
        optional: true,
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
        defaultValue: PROMPTS[Math.floor(Math.random() * PROMPTS.length)],
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
    time: {
        type: Number,
        label: "Round Timer setting",
        min: 10,
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
    // TODO should be a list of player _ids, not player objects.
    // For normalization.
    'players.$': {
        type: Schema.Player,
    },

    status: {
        type: String,
        label: "Room Status",
        allowedValues: ["JOINABLE", "PLAYING", "COMPLETE"],
        defaultValue: "JOINABLE",
    }
});