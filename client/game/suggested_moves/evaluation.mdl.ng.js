angular.module('blockchess.game.evaluationModel', [])
.service('EvaluationModel', EvaluationModel);

function EvaluationModel(GamesModel) {

  var model = {
    getUserEvaluationBy: getUserEvaluationBy,
    getFavoriteByUser: getFavoriteByUser,
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
      if (evl.userId === Meteor.userId()) {
        evaluation = evl;
      }
    });
    return evaluation;
  }

  function create(move, stars) {
    move.evaluations.push({
      userId: Meteor.userId(),
      createdAt: Date.now(),
      favoriteMove: false,
      stars: stars
    });
  }

  function flagFavorite(move, flag) {
    if (flag && getFavoriteByUser()) { unFlagFavorite(); } // In case another move is already flagged
    var evaluation = getUserEvaluationBy(move);
    evaluation.favoriteMove = flag;
  }

  function unFlagFavorite() {
    var move = getFavoriteByUser();
    var evaluation = getUserEvaluationBy(move);
    evaluation.favoriteMove = false;
  }

  function getFavoriteByUser(id) {
    if (!GamesModel.suggestedMoves) { return false; }
    var move;
    GamesModel.suggestedMoves.forEach(function(sugMove) {
      sugMove.evaluations.forEach(function(evl) {
        if (evl.favoriteMove && evl.userId === (id || Meteor.userId()) ) {
          move = sugMove;
        }
      });
    });
    return move;
  }

}
