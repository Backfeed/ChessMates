angular.module('blockchess.games.util.evaluationModel', [])
.service('EvaluationModel', EvaluationModel);

function EvaluationModel(GamesModel) {

  var model = {
    getUserEvaluationBy: getUserEvaluationBy,
    flagFavorite: flagFavorite,
    evaluate: evaluate
  };

  return model;

  function evaluate(move, stars) {
    var evaluation = getUserEvaluationBy(move);
    if (evaluation) { destroy(evaluation, move.evaluations[evaluation.stars-1]); }
    create(move, stars);
  }

  function getUserEvaluationBy(move) {
    if (!move.evaluations.length) { return false; }
    var evaluation = false;
    move.evaluations.forEach(function(evaluationArray) {
      evaluationArray.forEach(function(evl) {
        if (evl.user_id === Meteor.userId()) {
          evaluation = evl;
        }
      });
    });
    return evaluation;
  }

  function create(move, stars) {
    move.evaluations[stars-1].push({
      user_id: Meteor.userId(),
      created_at: Date.now(),
      favorite_move: false,
      stars: stars
    });

    GamesModel.gameNotAuto.save().then(function(){
      console.log('Evalution Updated');
      Meteor.call('distributeReputation', "1", move.notation, move.evaluations[stars-1]);
    });
  }

  function destroy(evaluation, evaluations) {
    evaluations = _.reject(evaluations, function(evl) {
      return evl.user_id === Meteor.userId()
    });
    GamesModel.gameNotAuto.save();
  }

  function flagFavorite(move, flag) {
    if (flag) { unFlagFavorite(); } // In case another move is already flagged
    var evaluation = getUserEvaluationBy(move);
    evaluation.favorite_move = flag;
  }

  function unFlagFavorite() {
    var move = getFavoriteMoveByUser();
    if (move) {
      var evaluation = getUserEvaluationBy(move);
      evaluation.favorite_move = false;
    }
  }

  function getFavoriteMoveByUser() {
    var move;
    GamesModel.game.suggested_moves.forEach(function(sug_move) {
      sug_move.evaluations.forEach(function(evalArr) {
        evalArr.forEach(function(eval) {
          if (eval.favorite_move && eval.user_id === Meteor.userId()) {
            move = sug_move;
          }
        });
      });
    });
    return move;
  }

}
