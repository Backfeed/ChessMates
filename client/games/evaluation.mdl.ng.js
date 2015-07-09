angular.module('blockchess.games.evaluationModel', [])
.service('EvaluationModel', EvaluationModel)

function EvaluationModel() {

  var model = {
    evaluate: evaluate
  };

  return model;

  function evaluate(move, stars) {
    var evaluation = getEvaluationByUser(move);
    if (evaluation) {
      updateEvaluation(evaluation, stars);
    } else {
      addEvaluation(move, stars);
    }
  }

  function getEvaluationByUser(move) {
    return _.find(move.evaluations, function(item) {
      return item.user_id === Meteor.userId();
    });
  }

  function addEvaluation(move, stars) {
    move.evaluations = [];
    move.evaluations.push({
      user_id: Meteor.userId(),
      created_at: Date.now(),
      stars: stars
    });
  }

  function updateEvaluation(evaluation, stars) {
    evaluation.stars = stars;
  }

}
