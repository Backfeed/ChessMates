SuggestedMoves = new Mongo.Collection('suggestedMoves');

SugMov = SugMovClass();

SuggestedMoves.allow({
  insert: function (uid)                         { return true; },
  update: function (uid, game, fields, modifier) { return true; },
  remove: function (uid, game)                   { return true; }
});

function SugMovClass() {

  var service =  {
    get: get,
    getRep: getRep
  };

  function get(id) {
    return SuggestedMoves.findOne({ _id: id });
  }

  function getRep(id) {
    return get(id).reputation;
  }

  return service;
}