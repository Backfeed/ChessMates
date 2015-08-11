var dummyStake = 3;// Arbitrarily

Protocol = (function() {

  return {
    
    distributeStakeToEvaluators: distributeStakeToEvaluators,
    updateReputation: updateReputation,
    calcFullStake: calcFullStake,
    getMoveStats: getMoveStats,
    getStakeBy: getStakeBy,
    getEvalsBy: getEvalsBy
    
  };

})();

function getMoveStats(move) {
  var starEvals      = [];
  var stars          = [1000, 0, 1, 3, 7, 15, 31];
  var funds          = 0;
  var fullstake      = 0;
  var score          = 0;
  var rep            = 0;
  var confidence     = 0;
  var formattedEvals = R.compose(getFormatted, getEvalsBy)(move._id);


  //iterate through each star
  for (var star = 1; star <= 5; star++) {
    starEvals = formattedEvals[star-1];
    
    if (starEvals.length === 0) 
      continue;

    funds = calcFunds(move, star);
    fullstake = calcFullStake(starEvals);

    if (Meteor.isServer)
      distributeStakeToEvaluators(starEvals, funds, fullstake);

    rep = calcRep(starEvals);
    score += stars[star] * rep;
    confidence += rep;
  }

  return {
    confidence: confidence,
    notation: move.notation,
    tokens: score / confidence,
    userId: move.userId,
    value: score
  };

}

// calcFunds :: Object, Number -> Number
function calcFunds(move, stars) {
  var funds = 0;
  var evals = getEvalsBy(move._id, stars);
  var upToNowEvals = [];
  _.each(evals, function(evl) {
    upToNowEvals.push(evl);
    var stake = evl.reputation * 0.1;
    var fullstake = calcFullStake(upToNowEvals) + dummyStake;
    funds += Math.round( stake * 3 / fullstake * 100) / 100;
  });
  return funds;
}

// calcFullStake :: [Object] -> Number
function calcFullStake(evals) {
  return R.compose(R.sum, R.map(getStakeBy), mapUsersBy, mapUids)(evals);
}

// getStakeBy :: Object -> Number
function getStakeBy(user) {
  return user.reputation * 0.1;
}

// getEvalsBy :: String, Number -> [Object]
function getEvalsBy(moveId, stars) {
  var query = { moveId: moveId };
  if (stars)
    query.stars = stars;
  return Evaluations.find(query).fetch();
}

function getFormatted(evaluations) {
  var formattedArray = [[],[],[],[],[]];
  _.each(evaluations, function(evl) {
    formattedArray[evl.stars-1].push(evl);
  });
  return formattedArray;
}

function distributeStakeToEvaluators(evals, stake, fullstake) {
  if (Meteor.isServer)
    R.compose(R.forEach(updateReputation), R.map(addStake), mapUsersBy, mapUids)(evals);

  function addStake(u) {
    u.reputation += R.compose(R.divide(100), Math.round, R.multiply(stake * 100 / fullstake), Protocol.getStakeBy)(u);
    return u;
  }
}

function updateReputation(user) {
  if (Meteor.isServer)
    Meteor.users.update({ _id: user._id }, { $set: { reputation: user.reputation } });
}

// calcRep :: [Object] -> Number
function calcRep (starEvals) {
  return R.compose(R.sum, R.map(R.prop('reputation')), mapUsersBy, mapUids)(starEvals);
}