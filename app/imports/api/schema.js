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
        type: Array,
        label: "SketchNet Scores",
        optional: true,
        defaultValue: [],
    },
    'scores.$': Object,
    'scores.$.label': {
        type: String,
        label: "Label / prompt",
    },
    'scores.$.confidence': {
        type: Number,
        label: "Confidence of the label",
    },
    prompt:{
        type: String,
        label: "Sketch Prompt",
    },
});

Schema.Round = new SimpleSchema({
    index: { // needed for ValidatedMethod updates
        type: Number,
        label: "Array Index",
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
        type: String, // Mongo ObjectID
    },
    time: {
        type: Number,
        label: "Round Timer setting",
        min: 10,
    },
    status: {
        type: String,
        label: "Round Status",
        allowedValues: ["CREATED", "PRE", "PLAY", "RESULTS", "END"],
        defaultValue: "CREATED",
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
    },
    'rounds.$':{
        type: Schema.Round,
    },
    players: {
        type: Array,
        label: "Player List",
        defaultValue: [],
    },
    'players.$': {
        type: Schema.Player,
    },
    joiningPlayers: {
        type: Array,
        label: "Players who will join in the next round",
        defaultValue: [],
    },
    'joiningPlayers.$': {
        type: Schema.Player,
    },
    status: {
        type: String,
        label: "Room Status",
        allowedValues: ["JOINABLE", "PLAYING", "COMPLETE"],
        defaultValue: "JOINABLE",
    }
});
