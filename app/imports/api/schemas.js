/**
 * Created by anjueappen on 3/4/17.
 */

export const Schemas = {};

Schemas.Players = new SimpleSchema({
    playerID: {
        type: String,
        label: "Player ID",
        regEx: SimpleSchema.RegEx.Id,
    },
    name: {
        type: String,
    },
    color:{
        type: String,
        optional: true,
    }
});
