// Attribution:
// Used template from meteor/todos.
// MIT License: https://github.com/meteor/todos/blob/master/LICENSE.txt
// File: https://github.com/meteor/todos/blob/react/imports/startup/server/index.js
// Accessed: March 2, 2017

// Purpose: be able to import server startup (in server/main.js) through 
// a single entry point (this module)

// This defines a starting set of data to be loaded if the app is loaded with an empty db.
import './fixtures.js';

// Set up some rate limiting and other important security settings.
import './security.js';

// This defines all the collections, publications and methods that the application provides
// as an API to the client.
import './register-api.js';
