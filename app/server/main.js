import '/imports/startup/server';

import { Meteor } from 'meteor/meteor';

const PROMPTS = ['cat', 'dog', 'monkey', 'freezer', 'ice cream'];

Meteor.startup(() => {
  Rooms.remove({}); // Clear all rooms from the database
});

Meteor.methods({
    /**
     * Insert a room into Mongo Room schema
     * @param id <REMOVE THIS PARAM>
     * @param {String} name user-specified room name.
     * @param {Integer} numRounds number of rounds that game will have.
     */
  insertRoom(id, name, numRounds) {
    //range(numRounds).forEach(() => this.generateRound());
    Rooms.insert({name, roundCount: numRounds, complete: false });
  },

    /**
     * Deliberate insetion of round (no current use cases)
     * @param prompt
     */
  insertRound(prompt) {},

    /**
     * Generate and insert round into database.
     * Prompt is randomly selected from existing list of prompts //TODO: need to make this
     */
  generateRound() {
    const prompt = PROMPTS[Math.floor(Math.random() * PROMPTS.length)];
    const id = Math.floor(Math.random() * PROMPTS.length); // TODO: change this

        // TODO: Actually insert round into collection

    return id;
  },
});

