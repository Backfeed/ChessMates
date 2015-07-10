angular.module('blockchess.games.evaluationModel', [])
.service('EvaluationModel', EvaluationModel)

function EvaluationModel(GamesModel) {

  var model = {
    getEvaluationByUser: getEvaluationByUser,
    flagFavorite: flagFavorite,
    evaluate: evaluate
  };

  return model;

  function evaluate(move, stars) {
    var evaluation = getEvaluationByUser(move);
    if (evaluation) {
      update(evaluation, { stars: stars });
    } else {
      create(move, stars);
    }
  }

  function getEvaluationByUser(move) {
    return _.find(move.evaluations, function(item) {
      return item.user_id === Meteor.userId();
    });
  }

  function create(move, stars) {
    move.evaluations.push({
      user_id: Meteor.userId(),
      created_at: Date.now(),
      favorite_move: false,
      stars: stars
    });
  }

  function update(evaluation, fields) {
    angular.extend(evaluation, fields);
  }

  function flagFavorite(move, flag) {
    console.log("flag: ", flag);
    if (flag) { unFlagFavorite(); } // In case another move is already flagged
    var evaluation = getEvaluationByUser(move);
    update(evaluation, { favorite_move: flag });
  }

  function unFlagFavorite() {
    var move = getFavoriteMoveByUser();
    console.log("move: ", move);
    if (move) {
      var evaluation = getEvaluationByUser(move);
      update(evaluation, { favorite_move: false });
    }
  }

  function getFavoriteMoveByUser() {
    var move;
    GamesModel.game.suggested_moves.forEach(function(sug_move) {
      sug_move.evaluations.forEach(function(eval) {
        if (eval.favorite_move && eval.user_id === Meteor.userId()) {
          move = sug_move;
        }
      });
    });
    return move;
  }

}