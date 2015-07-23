Clans            = new Mongo.Collection('clans');
Games            = new Mongo.Collection('games');
Timer            = new Mongo.Collection('timer');

Games.allow({
    insert: function (userId)                         { return true; },
    update: function (userId, game, fields, modifier) { return true; },
    remove: function (userId, game)                   { return true; }
});

Timer.allow({
  insert: function (userId)                         { return true; },
  update: function (userId, game, fields, modifier) { return true; },
  remove: function (userId, game)                   { return true; }
});

Clans.allow({
    insert: function (userId)                         { return true; },
    update: function (userId, game, fields, modifier) { return true; },
    remove: function (userId, game)                   { return true; }
});

Meteor.methods({
  log: log
});

// For testing Meter.call in shady places
function log(msg) { console.log('log', msg); }
