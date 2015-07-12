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
    if (evaluation) { destroy(evaluation, move.evaluations[evaluation.stars-1]); }
    create(move, stars);
  }

  function getEvaluationByUser(move) {
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
    });
  }

  function destroy(evaluation, evaluations) {
    evaluations = _.reject(evaluations, function(evl) {
      return evl.user_id === Meteor.userId()
    });
  }

  function flagFavorite(move, flag) {
    if (flag) { unFlagFavorite(); } // In case another move is already flagged
    var evaluation = getEvaluationByUser(move);
    evaluation.favorite_move = flag;
  }

  function unFlagFavorite() {
    var move = getFavoriteMoveByUser();
    if (move) {
      var evaluation = getEvaluationByUser(move);
      evaluation.favorite_move = false;
    }
  }

  function getFavoriteMoveByUser() {
    var move;
    GamesModel.gameNotAuto.suggested_moves.forEach(function(sug_move) {
      sug_move.evaluations.forEach(function(eval) {
        if (eval.favorite_move && eval.user_id === Meteor.userId()) {
          move = sug_move;
        }
      });
    });
    return move;
  }

}
