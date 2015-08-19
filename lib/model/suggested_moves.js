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
    getBy: getBy,
    getRep: getRep,
    incRep: incRep
  };

  function get(id) {
    return SuggestedMoves.findOne({ _id: id });
  }

  function getBy(gameId, turnIndex) {
    return SuggestedMoves.find({ gameId: gameId, turnIndex: turnIndex });
  }

  function getRep(id) {
    return get(id).reputation;
  }

  function incRep(id, n) {
    SuggestedMoves.update({ _id: id }, { $inc: { reputation: n } });
  }

  return service;
}