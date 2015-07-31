var stupidarray = [];

Meteor.methods({
  protoRate: protoRate,
  protoEndTurn: function protoEndTurn(gameId, turnIndex) {
    log('endTurn');
    var star, i, j;
    var stars = [1000, 0, 1, 3, 7, 15, 31];
    var turn = [];
    var suggestedMoves = getSuggestedMove(gameId, turnIndex);

    //iterate through each move
    for(i = 0; i<suggestedMoves.length; i++) {
      var move = suggestedMoves[i];
      var evals = getEvalsBy(move._id);
      var formattedEvaluations = getFormatted(evals);
      log("checking out move: " + move.notation);
      var score = 0;
      var totalrep = 0;

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
        totalrep += rep;
      }

      //calculate the average value of the move
      turn[move.notation] = {reputation: totalrep, credits: score / totalrep, value: score}
      log("move " + move.notation + " = " + score + " ( " + score / totalrep + " ) with " + totalrep + " reputation");

    }

    //select the movie to be played
    log(turn);
    var winner;

    //check if there is only one evaluation on that movie/star
    if(turn.length === 1) {
      log("only one....... ");
    }

    //first sort the move by the amount of value
    var sorted = [];
    for(move in turn) {
      sorted.push( [ move, turn[move].value ] );
    }
    sorted.sort(function(a, b) { return b[1] - a[1]; });
    log(sorted);


    //then identify the one with the highest overall score * rep || highest score || highest reputation
    winner = {value: sorted[0][1], move: sorted[0][0]}; //get the highest score
    for(j=1; j<sorted.length; j++) {
      if(sorted[j][1] === winner.value) {
        if(turn[sorted[j][0]].credits > turn[winner.move].credits) {
          winner = { value: sorted[j][1], move: sorted[j][0] };
        }
        else if(turn[sorted[j][0]].credits === turn[winner.move].credits) {
          if(turn[sorted[j][0]].reputation > turn[winner.move].reputation) {
            winner = { value: sorted[j][1], move: sorted[j][0] };
          }
        }
      }
    }


    log("AND THE WINNER MOVE IS: " + winner.move);
//    var m = Games.findOne({ 'suggestedMoves.notation' : winner.move });
    var m = suggestedMoves.filter( function(move) { return move.notation === winner.move })
    //  var m = Array.from(suggestedMoves).find({notation: winner.move});
    log("winning user = " + m[0].userId);



    //distribute  tokens to the contributor who picked the winning move !
    var win = getUserBy(m[0].userId);
    win.tokens += turn[winner.move].credits;
    Meteor.users.update( { _id: win._id}, { $set: { 'tokens': win.tokens }} );

    //return winner.move;
    var move = { from: winner.move.substr(0,2), to: winner.move.substr(2) };
    //return move;

    Meteor.call('executeMove',gameId, move, 'clan');
    //executeMove(gameId, move, 'clan');

    stupidarray = [];

  }

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
  log("updating " + Common.displayNameOf(user) + " reputation to = " + user.reputation);
  updateUserReputation(user._id, user.reputation);
}

function distributeStakeToEvaluators(evals, stake, fullstake) {
  var i;
  var u;
  for (i = 0; i < evals.length; i++) {
    u = getUserBy(evals[i].userId);
    u.reputation += Math.round(stake * getStakeBy(u) / fullstake * 100) / 100;
    log("updating " + Common.displayNameOf(u) + " reputation to = " + u.reputation);
    updateUserReputation(u._id, u.reputation);
  }
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
  var fullstake = 0;
  var i;
  var u;
  for (i = 0; i < evals.length; i++) {
    u = getUserBy(evals[i].userId);
    fullstake += getStakeBy(u);
  }
  return fullstake;
}

function updateUserReputation(id, reputation) {
  Meteor.users.update({ _id: id }, { $set: { reputation: reputation } });
}

// calcRep :: [Object] -> Number
function calcRep (starEvals) {
  var rep = 0;
  for (i = 0; i < starEvals.length ; i++) {
    var u = getUserBy(starEvals[i].userId);
    rep += u.reputation;
  }
  return rep;
}

// :: String, Number -> [Object]
function getSuggestedMove(gameId, turnIndex) {
  return SuggestedMoves.find({ gameId: gameId, turnIndex: turnIndex }).fetch();
}