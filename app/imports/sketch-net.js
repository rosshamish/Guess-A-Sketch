import { HTTP } from 'meteor/http';
import { Meteor } from 'meteor/meteor';

const sketchNetURL = 'http://localhost:5000';

export function getAllPrompts(callback) {
  const prompts = `${sketchNetURL}/prompts`;
	var response = HTTP.call('GET', prompts, {}, function( error, response ) {
	  if ( error ) {
	    console.log( error );
	  } else {
	    callback(response.data);
	  }
	});
}

export function getScore(sketch) {
  return null;
}