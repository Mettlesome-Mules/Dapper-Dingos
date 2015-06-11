'use strict';

/**
 * Module dependencies.
 */
 var mongoose = require('mongoose'),
 Schema = mongoose.Schema;



/**
 * Room Schema
 */
 var Room = new mongoose.Schema({
  name: {
    type: String,
   default: ''     
  },
  admin: {
   type: String,     default: 'guest'
  },
    messages: [
  ],
    queue: [],
  created: {
    type: Date,
    default: Date.now
  }
});

 module.exports = mongoose.model('Room', Room);