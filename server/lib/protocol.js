var dummyUserStake = 3;// Arbitrarily
 
Meteor.methods({
  protoRate: protoRate,
  protoEndTurn: protoEndTurn
});

function getFormatted(evaluations) {
  var formattedArray = [[],[],[],[],[]];
  _.each(evaluations, function(evl) {
    formattedArray[evl.stars-1].push(evl);
  });
  return formattedArray;
}

function log(msg) { console.log("PROTCOL: ", msg); }

function protoRate(userId, moveId, stars) {
  log('rate');
  var user = getUserBy(userId);
  var stake = getStakeBy(user);
  var evals = getEvalsBy(moveId, stars);
  var fullstake = calcFullStake(evals) + dummyUserStake;
  var notation = getNotationBy(moveId);
  
  payReputationAtStake(user, stake);
  distributeStakeToEvaluators(evals, stake, fullstake);
}

function payReputationAtStake(user, stake) {
  user.reputation -= stake;
  log("stake: updating " + Common.displayNameOf(user) + " reputation to = " + user.reputation);
  updateReputation(user);
}

function distributeStakeToEvaluators(evals, stake, fullstake) {
  compose(each(updateReputation), map(addStake), mapUsersBy, mapUids)(evals);

  function addStake(u) {
    u.reputation += Math.round(stake * getStakeBy(u) / fullstake * 100) / 100;
    return u;
  }
}

// getMoveBy :: String -> Object
function getMoveBy(moveId) {
  return SuggestedMoves.findOne({ _id: moveId });
}

// getEvalsBy :: String, Number -> [Object]
function getEvalsBy(moveId, stars) {
  var query = { moveId: moveId };
  if (stars)
    query.stars = stars;
  return Evaluations.find(query).fetch();
}

// getNotationBy :: String -> String
function getNotationBy(moveId) {
  return getMoveBy(moveId).notation;
}

// getStakeBy :: Object -> Number
function getStakeBy(user) {
  return user.reputation * 0.1;
}

// calcFullStake :: [Object] -> Number
function calcFullStake(evals) {
  return compose(sum, map(getStakeBy), mapUsersBy, mapUids)(evals);
}

function updateReputation(user) {
  Meteor.users.update({ _id: user._id }, { $set: { reputation: user.reputation } });
}

// calcRep :: [Object] -> Number
function calcRep (starEvals) {
  return compose(sum, map(property('reputation')), mapUsersBy, mapUids)(starEvals);
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

function logTurn(notation, totalRep, score) {
  log("move " + notation + " = " + score + " ( " + score / totalRep + " ) with " + totalRep + " reputation");
}

// getWinnerUser :: [Object], String -> Object
function getWinnerUser(moves, winningNotation) {
  return compose(getUserBy, toUid, find(isNotationEquals(winningNotation)))(moves);
}

function awardWinner(moves, winningNotation, credits) {
  var winningUser = getWinnerUser(moves, winningNotation);
  log("winning user = " + Common.displayNameOf(winningUser));
  winningUser.tokens += credits;
  Meteor.users.update( { _id: winningUser._id}, { $set: { tokens: winningUser.tokens }} );
}

function protoEndTurn(gameId, turnIndex) {
  log('endTurn');
  var star;
  var stars = [1000, 0, 1, 3, 7, 15, 31]; // TODO :: WTF is this?
  var turn = {};
  var moves = getSuggestedMove(gameId, turnIndex);

  _.each(moves, function(move) {
    var evals = getEvalsBy(move._id);
    var formattedEvaluations = getFormatted(evals);
    log("checking out move: " + move.notation);
    var score = 0;
    var totalRep = 0;

    //iterate through each star
    for (star = 1; star <= 5; star++) {

      var starEvals = formattedEvaluations[star-1];
      if (starEvals.length === 0) 
        continue;
      var funds = calcFunds(move, star);
      log("Total amount of funds collected for Star " + star + " = " + funds);

      var fullstake = calcFullStake(starEvals);
      distributeStakeToEvaluators(starEvals, funds, fullstake);
      var rep = calcRep(starEvals);
      //add the ponderated value of the star
      score += stars[star] * rep;

      //update the total (played) reputation for that move
      totalRep += rep;
    }

    //calculate the average value of the move
    turn[move.notation] = calcAvgMoveVal(totalRep, score);
    logTurn(move.notation, totalRep, score);
  });

  //select the move to be played
  log(turn);
  var winner;


  //first sort the move by the amount of value
  var sorted = [];
  for(move in turn) {
    sorted.push( [ move, turn[move].value ] );
  }
  sorted.sort(function(a, b) { return b[1] - a[1]; });
  log(sorted);


  //then identify the one with the highest overall score * rep || highest score || highest reputation
  winner = {value: sorted[0][1], move: sorted[0][0]}; //get the highest score
  for(var i = 1; i<sorted.length; i++) {
    if(sorted[i][1] === winner.value) {
      if(turn[sorted[i][0]].credits > turn[winner.move].credits) {
        winner = { value: sorted[i][1], move: sorted[i][0] };
      }
      else if(turn[sorted[i][0]].credits === turn[winner.move].credits) {
        if(turn[sorted[i][0]].reputation > turn[winner.move].reputation) {
          winner = { value: sorted[i][1], move: sorted[i][0] };
        }
      }
    }
  }

  log("AND THE WINNER MOVE IS: " + winner.move);
  
  awardWinner(moves, winner.move, turn[winner.move].credits);
  return { 
    from: winner.move.substr(0,2), 
    to: winner.move.substr(2) 
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
    var fullstake = calcFullStake(upToNowEvals) + dummyUserStake;
    funds += Math.round( stake * 3 / fullstake * 100) / 100;
  });
  return funds;
}