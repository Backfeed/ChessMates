//console.log('Hello World');

var A = {id:"Primavera",reputation:20, tokens:100};
var B = {id:"Yanik",	reputation:30, tokens:200};
var C = {id:"Tal",	reputation:20, tokens:50};
var D = {id:"Zeev",	reputation:30, tokens:30};


var moves = [ ];


function starClick(move, user, star, contributor) {

  //calculate the reputation at stake
  var stake = user.reputation * 0.1;
  stake = +stake.toFixed(3);

  //store the evaluation + user into the global "moves" array
  if(! moves[move]) {
    moves[move] = [];
    moves[move][0] = contributor; } //XXX NB. moves[move][0] is akin to SuggestedMove.suggestor_user_id  XXX

  var evaluation = { user: user, reputation: user.reputation, stake: stake};

  if(! moves[move][star]) { //create a dummy user to collect the funds, stake = 3
    moves[move][star] = [];
    moves[move][star][0] = { user: { id: 0, reputation: 0, tokens: 0 }, reputation: 0, stake: 3 };
  }
  moves[move][star].push(evaluation); //append the new evaluation to the star-array

  //pay the reputation at stake
  user.reputation -= stake;
  user.reputation = +user.reputation.toFixed(3);

  //redistribute the stake to other evaluators of the same move/star
  var i; var fullstake = 0;
  for(i=0; i < moves[move][star].length; i++) {
    fullstake += moves[move][star][i].stake;
  }
  for(i=0; i < moves[move][star].length; i++) {
    var u = moves[move][star][i].user;
    var s = moves[move][star][i].stake;
    //console.log(u);
    u.reputation += Math.round( stake * s / fullstake );
  }

  for(i=0; i < moves[move][star].length; i++) {
    //console.log(moves[move][star][i].user);
  }
}



var stars = [1000, 0, 1, 3, 7, 15, 31];

function endTurn() {
  var star; var i, star;
  var turn = [ ];

  //iterate through each move
  for (move in moves) {
    //console.log("checking out move: " + move);
    var score = 0; var totalrep = 0;

    //iterate through each star
    for (star=1; star < moves[move].length; star++) {

      if(!moves[move][star]) { continue; }


      //re-allocate the Funds to all players
      var funds = moves[move][star][0].user.reputation;
      //console.log("Total amount of funds collected for Star " + star + " = " + funds);

      //redistribute the stake to other evaluators of the same move/star
      var j; var fullstake = 0;
      for(j=1; j < moves[move][star].length; j++) {
        fullstake += moves[move][star][j].stake;
      }
      for(j=1; j < moves[move][star].length; j++) {
        var u = moves[move][star][j].user;
        var s = moves[move][star][j].stake;
        //console.log("before......."); console.log(u);
        u.reputation += Math.round( funds * s / fullstake );
        //console.log("after................"); console.log(u);
      }



      //calculate the weight of each star
      var rep = 0;
      for(i=1; i < moves[move][star].length; i++) {
        rep += moves[move][star][i].reputation;
      }

      //add the ponderated value of the star
      score += stars[star] * rep;

      //update the total (played) reputation for that move
      totalrep += rep;
    }

    //calculate the average value of the move
    turn[move] = { reputation: totalrep, credits: score/totalrep, value: score   }

    //console.log("move " + move + " = " + score + " ( " + score/totalrep + " ) with " + totalrep + " reputation");

    //distribute tokens to the contributor of that move
    //moves[move][0].tokens += Math.round(average);
  }

  //select the move to be played

  //console.log(turn);

  /*
   //first sort the move by the amount of reputation engaged
   var sorted = [];
   for(move in turn) {
   sorted.push( [ move, turn[move].reputation ]);
   }
   sorted.sort(function(a, b) { return b[1] - a[1]; });
   console.log(sorted);

   //then identify the highest ranked within the 3 highest reputable one.
   var winner = {value: 0, move: 0};
   var j = sorted.length > 3 ? 3 : sorted.length;
   for(i=0; i<j; i++)  {
   if( turn[sorted[i][0]].value > winner.value ) {
   console.log("current value for " + sorted[i][0] + " = " + turn[sorted[i][0]].value);
   winner.move = sorted[i][0];
   winner.value = turn[sorted[i][0]].value;
   }
   }
   */

  //first sort the move by the amount of value
  var sorted = [];
  for(move in turn) {
    sorted.push( [ move, turn[move].value ] );
  }
  sorted.sort(function(a, b) { return b[1] - a[1]; });
  //console.log(sorted);

  //then identify the one with the highest overall score * rep || highest score || highest reputation
  var winner = {value: sorted[0][1], move: sorted[0][0]}; //get the highest score
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


  //console.log("AND THE WINNER IS: " + winner.move);
  //console.log("winning user = " + moves[winner.move][0].id);

  //distribute  tokens to the contributor who picked the winning move !
  moves[winner.move][0].tokens += turn[winner.move].credits;
  moves[winner.move][0].tokens = +moves[winner.move][0].tokens.toFixed(3);

  //reallocate its stake to the last players;

  return winner.move;



}




starClick("A2A3", A, 1, A);
starClick("A2A3", C, 2, A);
starClick("A2A3", D, 2, A);

starClick("H2G3", A, 3, B);
starClick("H2G3", B, 3, B);
starClick("H2G3", C, 3, B);
starClick("H2G3", D, 3, B);

starClick("K9D2", A, 5, A);

starClick("C3C2", B, 2, C);
starClick("C3C2", D, 5, C);

endTurn();


//console.log(A, B, C, D);

