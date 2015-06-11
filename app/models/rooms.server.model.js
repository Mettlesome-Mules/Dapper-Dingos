'use strict';

/**
 * Module dependencies.
 */
 var mongoose = require('mongoose'),
 Schema = mongoose.Schema;



/**
 * Room Schema
 */
 var Rooms = new mongoose.Schema({
  name: {
    type: String,
   default: ''     
  },
  admin: {
   type: String,     default: 'guest'
  },
    messages: [
  ],
  created: {
    type: Date,
    default: Date.now
  }
});

 module.exports = mongoose.model('Room', Rooms);