var stupidarray = {} ;

Meteor.methods({
  distributeReputation: function distributeReputation(gameId, notation, evarray) {
    Meteor.call('validateGame',gameId);
    // Redistribute reputation after move

    var game = Games.findOne({ game_id: gameId });
    console.log('distributeReputation');

    var curreval = _.last(evarray);
    console.log(curreval)

    // pay reputation at stake
    var user = Meteor.users.findOne(curreval.user_id);
    var stake = user.reputation * 0.1;
    user.reputation -= stake;
    Meteor.users.update( { _id: curreval.user_id}, { $set: { 'reputation': user.reputation }} );

    console.log("updating " + user.emails + " reputation to = " + user.reputation);

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

      console.log("stupidarray for "+ notation + " ==== " + stupidarray[notation])

      for (i = 0; i < evarray.length; i++) {
        var u = Meteor.users.findOne(evarray[i].user_id);
        console.log(u.emails + " ===  " + u.reputation);
      }

  },


  endTurn: function endTurn(gameId) {
    var star, i, j;
    var stars = [1000, 0, 1, 3, 7, 15, 31];
    var turn = [];

    console.log('endTurn');
    Meteor.clearInterval(GameInterval);

    if (Meteor.isServer) {
      var game = Games.findOne({ game_id: gameId })
    }


    //iterate through each move
    for(j=0; j<game.suggested_moves.length; j++) {
      var move = game.suggested_moves[j];

      console.log("checking out move: " + move.notation);
      var score = 0;
      var totalrep = 0;

      //iterate through each star
      for (star = 1; star < 6; star++) {

        if (!stupidarray[move.notation][star]) {
          continue;
        }

        var evarray = move.evaluations[star-1]
        console.log("evalulelauloelulealueoluloaelualoe ---- " + move.evaluations[star-1])

      console.log("checking......... star sytem = " + star +   "(from "+ stupidarray[move.notation])
      console.log("lalalal")

        //re-allocate the Funds to all players
        var funds = stupidarray[move.notation][star];
        console.log("Total amount of funds collected for Star " + star + " = " + funds);
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
        for (i = 0; i < move.evaluations[star-1].length ; i++) {

          var u = Meteor.users.findOne(move.evaluations[star-1][i].user_id);
          rep += u.reputation;
        }

        //add the ponderated value of the star
        score += stars[star] * rep;

        //update the total (played) reputation for that move
        totalrep += rep;
      }

      //calculate the average value of the move
      turn[move.notation] = {reputation: totalrep, credits: score / totalrep, value: score}
      console.log("move " + move.notation + " = " + score + " ( " + score / totalrep + " ) with " + totalrep + " reputation");

    }


    //select the movie to be played
    console.log(turn);
    var winner;

    //check if there is only one evaluation on that movie/star
    if(turn.length == 1) {
      console.log("only one....... ");
    }

    //first sort the move by the amount of value
    var sorted = [];
    for(move in turn) {
      sorted.push( [ move, turn[move].value ] );
    }
    sorted.sort(function(a, b) { return b[1] - a[1]; });
    console.log(sorted);


    //then identify the one with the highest overall score * rep || highest score || highest reputation
    winner = {value: sorted[0][1], move: sorted[0][0]}; //get the highest score
    for(i=1; i<sorted.length; i++) {
      if(sorted[i][1] == winner.value) {
        if(turn[sorted[i][0]].credits > turn[winner.move].credits) {
          winner = { value: sorted[i][1], move: sorted[i][0] };
        }
        else if(turn[sorted[i][0]].credits == turn[winner.move].credits) {
          if(turn[sorted[i][0]].reputation > turn[winner.move].reputation) {
            winner = { value: sorted[i][1], move: sorted[i][0] };
          }
        }
      }
    }


    console.log("AND THE WINNER IS: " + winner.move);
//    var m = Games.findOne({ 'suggested_moves.notation' : winner.move });
    var m = game.suggested_moves.filter( function(move) { return move.notation == winner.move })
    //  var m = Array.from(game.suggested_moves).find({notation: winner.move});
    console.log("winning user = " + m[0].user_id);



    //distribute  tokens to the contributor who picked the winning move !
    var win = Meteor.users.findOne(m[0].user_id);
    win.tokens += turn[winner.move].credits;
    Meteor.users.update( { _id: win._id}, { $set: { 'tokens': win.tokens }} );

    return winner.move;

    stupidarray = [];

  }
});
