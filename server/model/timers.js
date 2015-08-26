Meteor.publish('timers', publish);

// TODO :: I think this will break with multiple games / clans
GameInterval = {};

Meteor.methods({
  startTurnTimer: startTurnTimer,
  isTimerInPlay: isTimerInPlay,
  clearTimerInterval: clear,
  endTimer: endTimer,
  timerResetGame: timerResetGame
});

function startTurnTimer(gameId) {
  clear();
  var timer = Timers.findOne({ gameId: gameId });
  timer.timeLeft = timer.timePerMove;
  GameInterval = Meteor.setInterval(timerInt, 1000);

  function timerInt() {
    timer.timeLeft -= 1000;
    if (timer.timeLeft <= 0) { Meteor.call('endTurn', gameId); }
    else                     { update(gameId, timer); }
  }
}

function isTimerInPlay(gameId) {
  return Timers.findOne({ gameId: gameId }).inPlay;
}

function clear() {
  Meteor.clearInterval(GameInterval);
}

function endTimer(gameId) {
  clear();
  update(gameId, { $set: { inPlay: false } });
}

function timerResetGame(gameId) {
  update(gameId,
    { 
      $set: {
        inPlay: true,
        timePerMove: 300000,
        timeLeft: 300000
      }
    }
  );
}


/********* Helper methods *********/
function update(gameId, query) {
  Timers.update({ gameId: gameId }, query );
}


/********* Publish and hooks *********/
function publish(options, gameId) {
  return Timers.find({ "gameId": "1" });
}