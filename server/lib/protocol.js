Meteor.methods({
  protoRate: rate,
  protoEndTurn: endTurn
});

function rate(uid, moveId, newStars) {
  var uStake = calcUserStake(uid);
  var uRep = User.getRep(uid) - uStake;

  User.set(uid, 'reputation', uRep);

  var evaluations = Evals.getList(moveId);

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
  _.each(moves, distributeTokensAndRep);

  var winningMove = getWinningMove(moves);

  return {
    from: winningMove.notation.substr(0,2),
    to: winningMove.notation.substr(2)
  };

  function distributeStake(m) {
    var lastEval = Evals.getLast(m._id);
    if (lastEval)
      User.inc(lastEval.uid, 'reputation', m.reputation);
  }

  function distributeTokensAndRep(m) {
    var evals = Evals.getList(m._id);

    var tokens = 0;
    
    _.each(evals, function(eval) {
      tokens += STARS_TOKENS[eval.stars-1] * User.getRep(eval.uid);
    });

    tokens = Math.round(tokens/totalTurnRep);
    var reputation = tokens * SUG_MOVE_TOKENS_REP_RATIO;

    User.inc(m.uid, 'tokens', tokens);
    User.inc(m.uid, 'reputation', reputation);
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

function calcUserStake(uid) {
  return R.compose(R.multiply(BASE_STAKE), User.getRep)(uid);
}

// TODO :: Make it relative to reputation of entire clan?
// The idea is that games that involve many players (and thus more reputation) should be rewarded higher than games with little players/reputation
function getTotalTurnRep(moves) {
  return R.compose(R.sum, R.map(User.getRep), F.mapUids, R.flatten, R.map(Evals.getList), F.mapIds)(moves)
}

function getWinningMove(moves) {
  return R.compose(getWithHighestScore, R.map(addScoreToMove))(moves);
}



function addScoreToMove(move) {
  move.score = Protocol.calcMoveScore(move);
  return move;
}

function getWithHighestScore(moves) {
  return F.max(R.prop('score'), moves);
}

/********* Debug *********/
function log(msg, val) {
  console.log("PROTO: " + msg, val);
}
