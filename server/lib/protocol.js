// TODO :: Make proper meteor constants
BASE_STAKE = 0.1;
BASE_FUNDS = 10;

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
  var winningMove = R.compose(max(R.prop('value')), R.map(Protocol.getMoveStats), SugMov.getBy)(gameId, turnIndex);
  User.inc(winningMove.uid, 'tokens', winningMove.tokens);

  return { 
    from: winningMove.notation.substr(0,2), 
    to: winningMove.notation.substr(2) 
  };
  
}

function calcFullStake(stars, evaluators) {
  // TODO :: Implement stars
  return R.compose(R.add(BASE_FUNDS), F.sumBy('reputation'))(evaluators);
}

function getEvaluators(moveId) {
  return R.compose(F.mapUsersBy ,F.mapUids, getEvaluations)(moveId);
}

function getEvaluations(moveId) {
  return Evaluations.find({ moveId: moveId });
}

function calcUserStake(uid) {
  return R.compose(R.multiply(BASE_STAKE), User.getRep)(uid);
}


/********* Debug *********/
function log(msg) {
  console.log("PROTO: " + msg);
}