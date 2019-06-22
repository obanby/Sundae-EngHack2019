/*
  A singlton module that provides the sentiment event handling
  throughout the system
*/
const events = require("events");
module.exports = new events.EventEmitter();
