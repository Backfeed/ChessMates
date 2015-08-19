// TODO :: Make proper meteor constants
BASE_STAKE = 0.1;
BASE_FUNDS = 10;
STARS_VAL = [0, 1, 3, 7, 15];
STARS_TOKENS = [0, 10, 20, 50, 100];

Meteor.methods({
  protoRate: protoRate,
  protoEndTurn: protoEndTurn
});

function protoRate(uid, moveId, stars) {
  // user should lose rep
  var uStake = calcUserStake(uid); // 1
  var uRep = User.getRep(uid) - uStake; // 10

  User.set(uid, 'reputation', uRep);

  var evaluators = getEvaluators(moveId);

  var multiplier = uStake / calcFullStake(stars, evaluators);
  _.each(evaluators, distributeStake);

  SugMov.inc(moveId, "reputation", BASE_FUNDS * multiplier);

  function distributeStake(u) {
    var amountToInc = u.reputation * multiplier;
    User.inc(u._id, 'reputation', amountToInc);
  }
}

function protoEndTurn(gameId, turnIndex) {
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

function calcFullStake(stars, evaluators) {
  // TODO :: Implement stars
  return R.compose(R.add(BASE_FUNDS), F.sumBy('reputation'))(evaluators);
}

function getEvaluators(moveId) {
  return R.compose(F.mapUsersBy ,F.mapUids, getEvaluations)(moveId);
}

function getEvaluations(moveId) {
  return Evaluations.find({ moveId: moveId }).fetch();
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
  return R.compose(trace('wining move'), getWithHighestScore, trace('moves with score'), R.map(addScoreToMove), trace('moves'))(moves);
}

function calcScore(move) {
  return R.compose(R.sum, R.map(evalToScore), getEvaluations, F.toId)(move)
}

function evalToScore(evaluation) { 
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
