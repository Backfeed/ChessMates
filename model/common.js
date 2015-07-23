Clans            = new Mongo.Collection('clans');
Games            = new Mongo.Collection('games');
Timer            = new Mongo.Collection('timer');
Status           = new Mongo.Collection('status');
Turns            = new Mongo.Collection('turns');

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

Status.allow({
  insert: function (userId)                         { return true; },
  update: function (userId, game, fields, modifier) { return true; },
  remove: function (userId, game)                   { return true; }
});

Turns.allow({
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

//Games.after.update(function(userId, doc, fieldNames, modifier, options){
//  console.log('game collection updated');
//});
