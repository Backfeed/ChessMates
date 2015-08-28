Meteor.publish('timers', publish);

var GameInterval = GameInterval || {};

Meteor.methods({
  createTimer: create,
  startTurnTimer: startTurnTimer,
  isTimerInPlay: isTimerInPlay,
  clearTimerInterval: clear,
  endTimer: endTimer,
  timerResetGame: timerResetGame,
  destroyTimer: destroy
});

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
  log("clear", gameId, GameInterval[gameId], GameInterval);
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

function log() {
  console.log('\n\n');
  console.log('SERVER: MODEL: TIMERS: ');
  _.each(arguments, function(msg) {
    console.log(msg);
  });
  console.log('\n\n');
}