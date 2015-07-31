var stupidarray = [];

Meteor.methods({
  protoRate: protoRate,
  protoEndTurn: protoEndTurn
});

function getFormatted(evaluations) {
  var formattedArray = [[],[],[],[],[]];
  evaluations.forEach(function(evl) {
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
  var dummyUserStake = 3;// Arbitrarily
  var fullstake = calcFullStake(evals) + dummyUserStake;
  var notation = getNotationBy(moveId);
  
  payReputationAtStake(user, stake);
  distributeStakeToEvaluators(evals, stake, fullstake);
  distributeStakeToDummyUser(notation, stars, stake, fullstake);
}

function payReputationAtStake(user, stake) {
  user.reputation -= stake;
  log("stake: updating " + Common.displayNameOf(user) + " reputation to = " + user.reputation);
  updateUserReputation(user._id, user.reputation);
}

function distributeStakeToEvaluators(evals, stake, fullstake) {
  var u;
  _.each(evals, function(evl) {
    u = getUserBy(evl.userId);
    u.reputation += Math.round(stake * getStakeBy(u) / fullstake * 100) / 100;
    log("distribution: updating " + Common.displayNameOf(u) + " reputation to = " + u.reputation);
    updateUserReputation(u._id, u.reputation);
  });
}

function prepareDummy(notation, stars) {
  stupidarray[notation] = stupidarray[notation] || [undefined, undefined, undefined, undefined, undefined];
  stupidarray[notation][stars] = stupidarray[notation][stars] || 0;
}

function distributeStakeToDummyUser(notation, stars, stake, fullstake) {
  prepareDummy(notation, stars);
  stupidarray[notation][stars] += Math.round( stake * 3 / fullstake * 100) / 100;
}

// getMoveBy :: String -> Object
function getMoveBy(moveId) {
  return SuggestedMoves.findOne({ _id: moveId });
}

// getEvalsBy :: String, Number -> [Object]
function getEvalsBy(moveId, stars) {
  return Evaluations.find({ moveId: moveId, stars: stars }).fetch();
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
  return _.reduce(evals, addStake, 0);
  function addStake(memo, evl) { 
    var u = getUserBy(evl.userId);
    return memo + getStakeBy(u);
  }
}

function updateUserReputation(id, reputation) {
  Meteor.users.update({ _id: id }, { $set: { reputation: reputation } });
}

// calcRep :: [Object] -> Number
function calcRep (starEvals) {
  return _.reduce(starEvals, addRep, 0);
  function addRep(memo, evl) { return memo + getUserBy(evl.userId).reputation; }
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
  var m = _.find(moves, function(move) { return move.notation === winningNotation });
  return getUserBy(m.userId);
}


function AwardWinner(moves, winningNotation, credits) {
  var winningUser = getWinnerUser(moves, winningNotation);
  log("winning user = " + Common.displayNameOf(winningUser));
  winningUser.tokens += credits;
  Meteor.users.update( { _id: winningUser._id}, { $set: { tokens: winningUser.tokens }} );
}

function protoEndTurn(gameId, turnIndex) {
  log('endTurn');
  var star;
  var stars = [1000, 0, 1, 3, 7, 15, 31]; // TODO :: WTF is this?
  var turn = [];
  var moves = getSuggestedMove(gameId, turnIndex);

  _.each(moves, function(move) {
    var evals = getEvalsBy(move._id);
    var formattedEvaluations = getFormatted(evals);
    log("checking out move: " + move.notation);
    var score = 0;
    var totalRep = 0;

    //iterate through each star
    for (star = 1; star < 6; star++) {
      if (!stupidarray[move.notation][star])
        continue;

      var starEvals = formattedEvaluations[star-1];
      var funds = stupidarray[move.notation][star];
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
  
  AwardWinner(moves, winner.move, turn[winner.move].credits);
  var move = { from: winner.move.substr(0,2), to: winner.move.substr(2) };
  Meteor.call('executeMove',gameId, move, 'clan');
  stupidarray = [];
}