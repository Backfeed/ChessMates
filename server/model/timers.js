Meteor.publish('timers', publish);

// TODO :: I think this will break with multiple games / clans
GameInterval = {};

Meteor.methods({
  updateTimer: updateTimer,
  startTurn: startTurn,
  endTurn: endTurn,
  endGame: endGame
});

function publish(options, gameId) {
  return Timers.find({ "gameId": "1" });
}

function startTurn(gameId) {
  var timer = Timers.findOne({ gameId: gameId });
  timer.timeLeft = timer.timePerMove;
  Meteor.clearInterval(GameInterval);
  GameInterval = Meteor.setInterval(function() {
    timer.timeLeft -= 1000;
    if (timer.timeLeft <= 0) { endTurn(gameId); }
    else                     { updateTimer(gameId, timer); }
  }, 1000);
}

function updateTimer(gameId, timer) {
  Timers.update({ gameId: gameId }, timer );
}

function endTurn(gameId) {
  Meteor.clearInterval(GameInterval);
  var timer = Timers.findOne({ gameId: gameId });
  if (timer.inPlay) {
    var game = Games.findOne({ gameId: gameId });
    var move = Meteor.call('protoEndTurn', gameId, game.turnIndex);
  }
}

function endGame(gameId) {
  Meteor.clearInterval(GameInterval);
  Timers.update({ gameId: gameId },
    {
      $set:  {
        inPlay: false
      }
    }
 );
}

