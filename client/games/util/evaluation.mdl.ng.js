angular.module('blockchess.games.util.evaluationModel', [])
.service('EvaluationModel', EvaluationModel);

function EvaluationModel(GamesModel) {

  var model = {
    getUserEvaluationBy: getUserEvaluationBy,
    flagFavorite: flagFavorite,
    evaluate: evaluate,
    create: create
  };

  return model;

  function evaluate(move, stars) {
    var evaluation = getUserEvaluationBy(move);
    if (evaluation) { evaluation.stars = stars; }
    else            { create(move, stars); }
  }

  function getUserEvaluationBy(move) {
    if (!move.evaluations || !move.evaluations.length) { return false; }
    var evaluation = false;
    move.evaluations.forEach(function(evl) {
      if (evl.user_id === Meteor.userId()) {
        evaluation = evl;
      }
    });
    return evaluation;
  }

  function create(move, stars) {
    move.evaluations.push({
      user_id: Meteor.userId(),
      created_at: Date.now(),
      favorite_move: false,
      stars: stars
    });
  }

  function flagFavorite(move, flag) {
    if (flag && getFavoriteByUser()) { unFlagFavorite(); } // In case another move is already flagged
    var evaluation = getUserEvaluationBy(move);
    evaluation.favorite_move = flag;
  }

  function unFlagFavorite() {
    var evaluation = getUserEvaluationBy(move);
    evaluation.favorite_move = false;
  }

  function getFavoriteByUser() {
    var move;
    GamesModel.game.suggested_moves.forEach(function(sug_move) {
      sug_move.evaluations.forEach(function(evl) {
        if (evl.favorite_move && evl.user_id === Meteor.userId()) {
          move = sug_move;
        }
      });
    });
    return move;
  }

}