Clan             = new Mongo.Collection('clan');
Game             = new Mongo.Collection('game');
Timer            = new Mongo.Collection('timer');
Status           = new Mongo.Collection('status');
SuggestedMove    = new Mongo.Collection('suggested_move');
Evaluation       = new Mongo.Collection('evaluation');
Comment          = new Mongo.Collection('comment');

Game.allow({
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

SuggestedMove.allow({
  insert: function (userId)                         { return true; },
  update: function (userId, game, fields, modifier) { return true; },
  remove: function (userId, game)                   { return true; }
});

Evaluation.allow({
  insert: function (userId)                         { return true; },
  update: function (userId, game, fields, modifier) { return true; },
  remove: function (userId, game)                   { return true; }
});

Comment.allow({
  insert: function (userId)                         { return true; },
  update: function (userId, game, fields, modifier) { return true; },
  remove: function (userId, game)                   { return true; }
});

Clan.allow({
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
