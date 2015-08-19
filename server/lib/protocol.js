// TODO :: Make proper meteor constants
BASE_STAKE = 0.1;
BASE_FUNDS = 10;
// var dummyStake = 3; // Arbitrarily

Meteor.methods({
  protoRate: protoRate,
  protoEndTurn: protoEndTurn
});

function log(msg) {
  console.log("PROTO: " + msg);
}

function protoRate(uid, moveId, stars) {
  // user should lose rep
  var uStake = calcUserStake(uid); // 1
  var uRep = User.getRep(uid) - uStake; // 10

  Meteor.users.update({ _id: uid }, { $set: { reputation: uRep } });

  var evaluators = getEvaluators(moveId);

  var multiplier = uStake / calcFullStake(stars, evaluators);
  
  _.each(evaluators, function(u) {
    Meteor.users.update(u._id, { $inc: { reputation: u.reputation * multiplier } });
  });

  SuggestedMoves.update({ _id: moveId }, { $inc: { reputation: BASE_FUNDS * multiplier } });

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

function protoEndTurn(gameId, turnIndex) {
  var winningMove = R.compose(max(R.prop('value')), R.map(Protocol.getMoveStats), getSuggestedMove)(gameId, turnIndex);
  awardWinner(winningMove);

  return { 
    from: winningMove.notation.substr(0,2), 
    to: winningMove.notation.substr(2) 
  };
  
}


/********* Helper methods *********/
function payReputationAtStake(user, uStake) {
  R.compose(Protocol.updateReputation, addToRep(-uStake))(user);
}

// getMoveBy :: String -> Object
function getMoveBy(moveId) {
  return SuggestedMoves.findOne({ _id: moveId });
}

// getNotationBy :: String -> String
function getNotationBy(moveId) {
  return getMoveBy(moveId).notation;
}

// :: String, Number -> [Object]
function getSuggestedMove(gameId, turnIndex) {
  return SuggestedMoves.find({ gameId: gameId, turnIndex: turnIndex }).fetch();
}

// calcAvgMoveVal :: Number, Number -> Object
function calcAvgMoveVal(totalRep, score) {
  return {
    reputation: totalRep, 
    credits: score / totalRep, 
    value: score
  };
}

// getWinnerUser :: [Object], String -> Object
function getWinnerUser(moves, winningNotation) {
  return R.compose(F.getUserBy, toUid, find(isNotationEquals(winningNotation)))(moves);
}

function awardWinner(winningMove) {
  Meteor.users.update( { _id: winningMove.uid }, { $inc: { tokens: winningMove.tokens } } );
}