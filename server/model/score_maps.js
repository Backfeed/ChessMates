Meteor.methods({
  createScoreMap: create,
  setPlayerScoreForTurn: setPlayerScoreForTurn
});

function create(gameId) {
  ScoreMaps.insert({
    gameId: gameId
  })
}

function setPlayerScoreForTurn(gameId, turnIndex, playerId, score) {
  var setObj = {
    $push: {}
  };

  setObj.$push[turnIndex] = {
    score: score,
    uid: playerId
  }

  ScoreMaps.update(
    { gameId: gameId },
    setObj
  );
}