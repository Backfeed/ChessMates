var dummyStake = 3; // Arbitrarily

Meteor.methods({
  protoRate: protoRate,
  protoEndTurn: protoEndTurn
});

function protoRate(userId, moveId, stars) {
  var user = getUserBy(userId);
  var stake = Protocol.getStakeBy(user);
  payReputationAtStake(user, stake);

  var evals = Protocol.getEvalsBy(moveId, stars);
  var fullstake = Protocol.calcFullStake(evals) + dummyStake;
  Protocol.distributeStakeToEvaluators(evals, stake, fullstake);
}

function protoEndTurn(gameId, turnIndex) {
  console.log('protoEndTurn: ' ,gameId, turnIndex);
  var winningMove = R.compose(max(R.prop('value')), R.map(Protocol.getMoveStats), getSuggestedMove)(gameId, turnIndex);
  awardWinner(winningMove);

  return { 
    from: winningMove.notation.substr(0,2), 
    to: winningMove.notation.substr(2) 
  };
  
}


/********* Helper methods *********/
function payReputationAtStake(user, stake) {
  R.compose(Protocol.updateReputation, addToRep(-stake))(user);
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
  return R.compose(getUserBy, toUid, find(isNotationEquals(winningNotation)))(moves);
}

function awardWinner(winningMove) {
  Meteor.users.update( { _id: winningMove.userId }, { $inc: { tokens: winningMove.tokens } } );
}