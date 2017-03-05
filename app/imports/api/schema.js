/**
 * Created by anjueappen on 3/4/17.
 */

export const Schema = {};

Schema.Player = new SimpleSchema({
    playerID: {
        type: String,
        label: "Player ID",
        regEx: SimpleSchema.RegEx.Id,
        unique: true,
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

Schema.Round = new SimpleSchema({
    roundID:{
        type: String,
        label: "Round ID",
        regEx: SimpleSchema.RegEx.Id,
        unique: true,

    },
    prompt:{
        type: String,
        label: "Round Prompt",
    },
    sketches:{
        type:[Schema.Sketch],
        label: "Round Sketches",
        defaultValue: [],
        minCount: 0,
    },
});

Schema.Sketch = new SimpleSchema({
    sketchID: {
        type: String,
        label: "Sketch ID",
        regEx: SimpleSchema.RegEx.Id,
        unique: true,
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

Schema.Room = new SimpleSchema({
    roomID: {
        type: String,
        label: "Room ID",
        regEx: SimpleSchema.RegEx.Id,
        unique: true,
    },
    name: {
        type: String,
        label: "Room Name",
        unique: true,
    },
    rounds: {
        type: [Schema.Round],
        label: "Round List",
        minCount: 1,
    },
    players: {
        type: [Schema.Player],
        label: "Player List",
    },
    status: {
        type: String,
        label: "Room Status",
        allowedValues: ["JOINABLE", "COMPLETE", "PLAYING"],
        defaultValue: "JOINABLE",
    }
});