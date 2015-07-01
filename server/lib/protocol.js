//console.log('Hello World');

var A = {id:"Primavera",reputation:50, tokens:100};
var B = {id:"Yanik",  reputation:100, tokens:200};
var C = {id:"Tal",  reputation:20, tokens:50};
var D = {id:"Zeev", reputation:30, tokens:30};


var moves = [];


function starClick(move, user, star, contributor) {

  //calculate the reputation at stake
  var stake = user.reputation * 0.1;

  //store the evaluation + user into the global "moves" array
  if(! moves[move]) { moves[move] = []; moves[move][0] = contributor; } //XXX NB. moves[move][0] is akin to SuggestedMove.suggestor_user_id  XXX

  if(  moves[move][star]) {  moves[move][star].push( {user: user, reputation: user.reputation, stake: stake}); }
  else { moves[move][star] = [ { user: user, reputation: user.reputation, stake: stake } ] }

  //pay the reputation at stake
  user.reputation -= stake;

  //redistribute the stake to other evaluators of the same move/star
  var i; var fullstake = 0;
  for(i=0; i < moves[move][star].length; i++) {
    fullstake += moves[move][star][i].stake;
  }
  for(i=0; i < moves[move][star].length; i++) {
    var u = moves[move][star][i].user;
    var s = moves[move][star][i].stake;
    u.reputation += Math.round( stake * s / fullstake );
  }

  for(i=0; i < moves[move][star].length; i++) {
                //console.log(moves[move][star][i].user);
  }
}

var stars = [1000, 0, 1, 4, 9, 16, 25];

function endTurn() {
  var star; var i;
  var turn = [ ];

  //iterate through each move
  for (move in moves) {
    //console.log("checking out move: " + move);
    var average = 0; var totalrep = 0;

      //iterate through each star
      for (star in moves[move]) {
      //console.log("starring.. " + star);

        //calculate the weight of each star
        var rep = 0;
        for(i=0; i < moves[move][star].length; i++) {
          rep += moves[move][star][i].reputation;
        }

        //add the ponderated value of the star
        average += stars[star] * rep;

        //update the total reputation for that move
        totalrep += rep;
      }

      //calculate the average value of the move
      average /= totalrep;
      turn[move] = { reputation: totalrep, value: average }

      //console.log("move " + move + " = " + average + " with " + totalrep + " reputation");

      //distribute tokens to the contributor of that move
      moves[move][0].tokens += Math.round(average);
  }

  //select the move to be played

  //console.log(turn);

  //first sort the move by the amount of reputation engaged
  var sorted = [];
  for(move in turn) {
    sorted.push( [ move, turn[move].reputation ]);
  }
  sorted.sort(function(a, b) { return b[1] - a[1]; });
  //console.log(sorted);

  //then identify the highest ranked within the 3 highest reputable one.
  var winner = {value: 0, move: 0};
  var j = sorted.length > 3 ? 3 : sorted.length;
  for(i=0; i<j; i++)  {
    if( turn[sorted[i][0]].value > winner.value ) {
      //console.log("current value for " + sorted[i][0] + " = " + turn[sorted[i][0]].value);
      winner.move = sorted[i][0];
      winner.value = turn[sorted[i][0]].value;
    }
  }
  //console.log("AND THE WINNER IS: " + winner.move);

  //distribute 25 tokens to the contributor who picked the winning move !
  moves[winner.move][0].tokens += 25;

  return winner.move;



}




starClick("A2A3", A, 1, A);
starClick("A2A3", C, 2, A);
starClick("A2A3", D, 2, A);

starClick("H2G3", A, 2, B);
starClick("H2G3", B, 3, B);
starClick("H2G3", C, 3, B);
starClick("H2G3", D, 4, B);

starClick("K9D2", A, 5, A);

starClick("C3C2", B, 2, C);
starClick("C3C2", D, 5, C);

endTurn();


//console.log(A, B, C, D);
