Protocol = getProtocol();

function getProtocol() {

  return {

    calcEvalsScore: calcEvalsScore,
    calcMoveScore: calcMoveScore,
    calcConfidence: calcConfidence

  };

}

function evalToScore(evaluation) { 
  if (!evaluation.active)
    return 0;
  var starsVal = STARS_VAL[evaluation.stars-1];
  var uRep = User.getRep(evaluation.uid);
  return starsVal * uRep;
}

function calcEvalsScore(evaluations) { 
  return R.compose(R.sum, R.map(evalToScore))(evaluations);
}

function calcMoveScore (move) {
  return R.compose(calcEvalsScore, Evals.getList, F.toId)(move);
}

function calcConfidence(evaluations) {
  return R.compose(R.sum, R.map(User.getRep), mapUids, F.filterActive)(evaluations);
}
