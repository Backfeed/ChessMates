Clans          = new Mongo.Collection('clans');
Games          = new Mongo.Collection('games');
Timers         = new Mongo.Collection('timers');
SuggestedMoves = new Mongo.Collection('suggestedMoves');
Evaluations    = new Mongo.Collection('evaluations');
Comments       = new Mongo.Collection('comments');

Games.allow({
    insert: function (uid)                         { return true; },
    update: function (uid, game, fields, modifier) { return true; },
    remove: function (uid, game)                   { return true; }
});

Timers.allow({
  insert: function (uid)                         { return true; },
  update: function (uid, game, fields, modifier) { return true; },
  remove: function (uid, game)                   { return true; }
});

SuggestedMoves.allow({
  insert: function (uid)                         { return true; },
  update: function (uid, game, fields, modifier) { return true; },
  remove: function (uid, game)                   { return true; }
});

Evaluations.allow({
  insert: function (uid)                         { return true; },
  update: function (uid, game, fields, modifier) { return true; },
  remove: function (uid, game)                   { return true; }
});

Comments.allow({
  insert: function (uid)                         { return true; },
  update: function (uid, game, fields, modifier) { return true; },
  remove: function (uid, game)                   { return true; }
});

Clans.allow({
    insert: function (uid)                         { return true; },
    update: function (uid, game, fields, modifier) { return true; },
    remove: function (uid, game)                   { return true; }
});

Meteor.methods({
  log: log
});

// For testing Meteor.call in shady places
function log(msg) { console.log('log', msg); }
