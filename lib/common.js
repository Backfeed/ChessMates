Clans          = new Mongo.Collection('clans');
Games          = new Mongo.Collection('games');
Timers         = new Mongo.Collection('timers');
SuggestedMoves = new Mongo.Collection('suggestedMoves');
Evaluations    = new Mongo.Collection('evaluations');
Comments       = new Mongo.Collection('comments');

Games.allow({
    insert: function (userId)                         { return true; },
    update: function (userId, game, fields, modifier) { return true; },
    remove: function (userId, game)                   { return true; }
});

Timers.allow({
  insert: function (userId)                         { return true; },
  update: function (userId, game, fields, modifier) { return true; },
  remove: function (userId, game)                   { return true; }
});

SuggestedMoves.allow({
  insert: function (userId)                         { return true; },
  update: function (userId, game, fields, modifier) { return true; },
  remove: function (userId, game)                   { return true; }
});

Evaluations.allow({
  insert: function (userId)                         { return true; },
  update: function (userId, game, fields, modifier) { return true; },
  remove: function (userId, game)                   { return true; }
});

Comments.allow({
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
