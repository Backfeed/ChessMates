Meteor.publish('timers', publish);

Meteor.methods({
  createTimer: create,
  startTurnTimer: startTurnTimer,
  isTimerInPlay: isTimerInPlay,
  clearTimerInterval: clear,
  endTimer: endTimer,
  timerResetGame: timerResetGame,
  destroyTimer: destroy
});

var GameInterval = GameInterval || {};

var log = _DEV.log('MODEL: TIMERS:');

function create(gameId) {
  Timers.insert({
    gameId: gameId,
    inPlay: false,
    timePerMove: 300000,
    timeLeft: 300000
  });
}

function startTurnTimer(gameId) {
  clear(gameId);
  var timer = Timers.findOne({ gameId: gameId });
  timer.timeLeft = timer.timePerMove;
  timer.inPlay = true;
  GameInterval[gameId] = Meteor.setInterval(timerInt, 1000);

  function timerInt() {
    timer.timeLeft -= 1000;
    if (timer.timeLeft <= 0) { Meteor.call('endTurn', gameId); }
    else                     { update(gameId, timer); }
  }
}

function isTimerInPlay(gameId) {
  return Timers.findOne({ gameId: gameId }).inPlay;
}

function clear(gameId) {
  Meteor.clearInterval(GameInterval[gameId]);
}

function endTimer(gameId) {
  clear(gameId);
  update(gameId, { $set: { inPlay: false } });
}

function timerResetGame(gameId) {
  var timeLeft = Timers.findOne({ gameId: gameId }).timePerMove;
  
  update(gameId,
    { 
      $set: {
        inPlay: true,
        timeLeft: timeLeft
      }
    }
  );
}


/********* Helper methods *********/
function update(gameId, query) {
  Timers.update({ gameId: gameId }, query );
}


/********* Publish and hooks *********/
function publish(gameId) {
  return Timers.find({ gameId: gameId });
}

function destroy(gameId) {
  Timers.remove({ gameId: gameId });
}