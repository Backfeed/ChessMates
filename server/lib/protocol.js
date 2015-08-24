Meteor.methods({
  protoRate: rate,
  protoEndTurn: endTurn
});

function rate(uid, moveId, newStars) {
  var uStake = calcUserStake(uid);
  var uRep = User.getRep(uid) - uStake;

  User.set(uid, 'reputation', uRep);

  var evaluations = getEvaluations(moveId);

  var multiplier = uStake / calcFullStake(newStars, evaluations);

  _.each(evaluations, distributeStake);

  SugMov.inc(moveId, "reputation", BASE_FUNDS * multiplier);

  function distributeStake(evl) {
    var amountToInc = User.getRep(evl.uid) * multiplier * getStarsFactor(evl.stars, newStars);
    User.inc(evl.uid, 'reputation', amountToInc);
  }
}

function endTurn(gameId, turnIndex) {
  var moves = SugMov.getBy(gameId, turnIndex).fetch();
  _.each(moves, distributeStake);

  var totalTurnRep = getTotalTurnRep(moves);
  _.each(moves, distributeTokens);

  var winningMove = getWinningMove(moves);

  return {
    from: winningMove.notation.substr(0,2),
    to: winningMove.notation.substr(2)
  };

  function distributeStake(m) {
    var lastEvaluatorId = getLastEvaluation(m._id).uid;
    User.inc(lastEvaluatorId, 'reputation', m.reputation);
  }

  function distributeTokens(m) {
    var evals = getEvaluations(m._id);

    var tokens = 0;
    
    _.each(evals, function(eval) {
      tokens += STARS_TOKENS[eval.stars-1] * User.getRep(eval.uid);
    });

    tokens = Math.round(tokens/totalTurnRep);

    User.inc(m.uid, 'tokens', tokens);
  }

}

function calcFullStake(newStars, evaluations) {
  var totalRep = 0;
  _.each(evaluations, function(evl) {
    totalRep += User.getRep(evl.uid) * getStarsFactor(evl.stars, newStars);
  });
  return totalRep + BASE_FUNDS;
}

function getStarsFactor(newStars, stars) {
  var distance = newStars > stars ? newStars - stars : stars - newStars;
  if (distance === 0)
    return 1;
  return 0;
}

function getEvaluators(moveId) {
  return R.compose(F.mapUsersBy ,F.mapUids, getEvaluations)(moveId);
}

function getEvaluations(moveId) {
  return Evaluations.find({ moveId: moveId, inactive: false }).fetch();
}

function getLastEvaluation(moveId) {
  var evals = getEvaluations(moveId);
  return evals[evals.length-1];
}

function calcUserStake(uid) {
  return R.compose(R.multiply(BASE_STAKE), User.getRep)(uid);
}

// TODO :: Make it relative to reputation of entire clan?
// The idea is that games that involve many players (and thus more reputation) should be rewarded higher than games with little players/reputation
function getTotalTurnRep(moves) {
  return R.compose(R.sum, R.map(User.getRep), mapUids, R.flatten, R.map(getEvaluations), F.mapIds)(moves)
}

function getWinningMove(moves) {
  return R.compose(getWithHighestScore, R.map(addScoreToMove))(moves);
}

function calcScore(move) {
  return R.compose(R.sum, R.map(evalToScore), getEvaluations, F.toId)(move)
}

function evalToScore(evaluation) { 
  if (evaluation.inactive)
    return 0;
  var starsVal = STARS_VAL[evaluation.stars-1];
  var uRep = User.getRep(evaluation.uid);
  return starsVal * uRep;
}

function addScoreToMove(move) {
  move.score = calcScore(move);
  return move;
}

function getWithHighestScore(moves) {
  return F.max(R.prop('score'), moves);
}

/********* Debug *********/
function log(msg, val) {
  console.log("PROTO: " + msg, val);
}
