var stupidarray = [];

Meteor.methods({
  protoEvluate: function protoEvluate(gameId, notation, evarray) {
    Meteor.call('validateGame',gameId);
    // Redistribute reputation after move

    log('distributeReputation');

    var curreval = _.last(evarray);
    log('user: ', Common.displayNameOf(user), ' stars: ', curreval.stars);

    // pay reputation at stake
    var user = Meteor.users.findOne(curreval.user_id);
    var stake = user.reputation * 0.1;
    user.reputation -= stake;
    Meteor.users.update( { _id: curreval.user_id}, { $set: { 'reputation': user.reputation }} );

    log("updating " + Common.displayNameOf(user) + " reputation to = " + user.reputation);

    //check if it's the first evaluation, to prepare the dummy user
    if(!stupidarray[notation]) {
      stupidarray[notation] = [undefined, undefined, undefined, undefined, undefined];
    }

      // redistribute the stake to all other evaluators
      var i;
      var fullstake = 0;
      for (i = 0; i < evarray.length; i++) {
        var u = Meteor.users.findOne(evarray[i].user_id);
        fullstake += u.reputation * 0.1;
      }
      //add the stake of the dummy user, arbitrarily set at 3
      fullstake += 3;

      for (i = 0; i < evarray.length; i++) {
        var u = Meteor.users.findOne(evarray[i].user_id);
        u.reputation += Math.round(stake * (u.reputation * 0.1) / fullstake * 100) / 100;
        Meteor.users.update({_id: u._id}, {$set: {'reputation': u.reputation}});
      }
      //redistribute some of the stake also to the dummy user
     if(!stupidarray[notation][curreval.stars]) { stupidarray[notation][curreval.stars] = 0;}
      stupidarray[notation][curreval.stars] += Math.round( stake * 3 / fullstake * 100) /100;

      for (i = 0; i < evarray.length; i++) {
        var u = Meteor.users.findOne(evarray[i].user_id);
        log(u.emails + " ===  " + u.reputation);
      }

  },
  protoEndTurn: function protoEndTurn(gameId) {
    var star, i, j;
    var stars = [1000, 0, 1, 3, 7, 15, 31];
    var turn = [];

    log('endTurn');


    var suggested_moves = SuggestedMove.find({ game_id: gameId });

    //iterate through each move
    for(j=0; j<suggested_moves.length; j++) {
      var move = suggested_moves[j];
      var formattedEvaluations = getFormatted(move.evaluations);
      log("checking out move: " + move.notation);
      var score = 0;
      var totalrep = 0;

      //iterate through each star
      for (star = 1; star < 6; star++) {

        if (!stupidarray[move.notation][star]) {
          continue;
        }

        var evarray = formattedEvaluations[star-1];

        //re-allocate the Funds to all players
        var funds = stupidarray[move.notation][star];
        log("Total amount of funds collected for Star " + star + " = " + funds);
        var k, fullstake = 0;

        //redistribute the stake to other evaluators of the same move/star
        for (k = 0; k < evarray.length; k++) {
          var u = Meteor.users.findOne(evarray[k].user_id);
          fullstake += u.reputation * 0.1;
        }

        for (k = 0; k < evarray.length; k++) {
          var u = Meteor.users.findOne(evarray[k].user_id);
          u.reputation += Math.round(funds * (u.reputation * 0.1) / fullstake * 100) / 100;
          Meteor.users.update({_id: u._id}, {$set: {'reputation': u.reputation}});
        }



        //calculate the weight of each star
        var rep = 0;
        for (i = 0; i < evarray.length ; i++) {

          var u = Meteor.users.findOne(evarray[i].user_id);
          rep += u.reputation;
        }

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
    for(i=1; i<sorted.length; i++) {
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
//    var m = Games.findOne({ 'suggested_moves.notation' : winner.move });
    var m = suggested_moves.filter( function(move) { return move.notation === winner.move })
    //  var m = Array.from(suggested_moves).find({notation: winner.move});
    log("winning user = " + m[0].user_id);



    //distribute  tokens to the contributor who picked the winning move !
    var win = Meteor.users.findOne(m[0].user_id);
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
