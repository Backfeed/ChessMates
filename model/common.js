Games            = new Mongo.Collection('games');
timerStream      = new Meteor.Stream('timer');
connectionStream = new Meteor.Stream('connection');
movesStream      = new Meteor.Stream('engineMove');
restartStream    = new Meteor.Stream('restart');

Games.allow({
    insert: function (userId)                         { return true; },
    update: function (userId, game, fields, modifier) { return true; },
    remove: function (userId, game)                   { return true; }
});

Meteor.methods({
  log: log
});

// Streams
if (Meteor.isServer) {
  timerStream.permissions.write(function()      { return true; });
  timerStream.permissions.read(function()       { return true; });
  restartStream.permissions.write(function()    { return true; });
  restartStream.permissions.read(function()     { return true; });
  movesStream.permissions.write(function()      { return true; });
  movesStream.permissions.read(function()       { return true; });
  connectionStream.permissions.write(function() { return true; });
  connectionStream.permissions.read(function()  { return true; });  
}

// For testing Meter.call in shady places
function log(msg) { console.log('log', msg); }