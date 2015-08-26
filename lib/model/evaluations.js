Evaluations = new Mongo.Collection('evaluations');

Evals = EvalsClass();

Evaluations.allow({
  insert: function (uid)                         { return true; },
  update: function (uid, game, fields, modifier) { return true; },
  remove: function (uid, game)                   { return true; }
});

function EvalsClass() {
  return {

    getList: getList,
    getLast: getLast

  };
}

function getList(moveId) {
  return Evaluations.find({ moveId: moveId, active: true }).fetch();
}

function getLast(moveId) {
  return _.last(getList(moveId));
}