SuggestedMoves = new Mongo.Collection('suggestedMoves');

SuggestedMoves.allow({
  insert: function (uid)                         { return true; },
  update: function (uid, game, fields, modifier) { return true; },
  remove: function (uid, game)                   { return true; }
});