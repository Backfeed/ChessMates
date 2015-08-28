Meteor.publish('suggestedMoves', publish);

SuggestedMoves.before.insert(beforeInsert);
SuggestedMoves.after.insert(afterInsert);

Meteor.methods({
  createSugMov: create,
  destroySugMoves: destroyList,
  validateSugMovExists: validateExists,
  noSugMov: isBlank
});

var log = _DEV.log('MODEL: SUG MOV:');

function validateExists(gameId, turnIndex) {
  if (isBlank(gameId, turnIndex))
    throw new Meteor.Error(403, 'No moves suggested');
}

function isBlank(gameId, turnIndex) {
  return !count(gameId, turnIndex);
}

function create(gameId, turnIndex, notation, fen) {
  SuggestedMoves.insert({
    gameId: gameId,
    turnIndex: turnIndex,
    notation: notation,
    fen: fen,
    uid: Meteor.userId(),
    createdAt: Date.now()
  });
}

function destroyList(gameId) {
  SuggestedMoves.remove({ gameId: gameId });
}

/********* Helper methods *********/
function validateSufficientTokens(uid) {
  var userTokens = F.getUserBy(uid).tokens;
  if (userTokens < MOVE_COST)
    throw new Meteor.Error(404, 'Insufficient funds: Suggesting a move costs ' + MOVE_COST + ' token, you have ' + userTokens + 'tokens');
}

function validateUniqueness(move) {
  var suggested = SuggestedMoves.find({ "gameId": "1", "fen": move.fen });
  if (suggested.count() > 0)
    throw new Meteor.Error(404, 'Move Already Suggested');
}

function count(gameId, turnIndex) {
  return SuggestedMoves.find({gameId: gameId, turnIndex: turnIndex}).count();
}


/********* Publish and hooks *********/
function publish(gameId, turnIndex) {
  turnIndex = turnIndex || Games.findOne(gameId).turnIndex;
  return SuggestedMoves.find({ gameId: gameId, turnIndex: turnIndex });
}

function beforeInsert(uid, move) {
  if (!uid) return;
  validateUniqueness(move);
  validateSufficientTokens(uid);
}

function afterInsert(uid, move) {
  if (!uid) return;
  
  deduceCoinsFor(uid)

  logMove(uid, move);
}

function logMove(uid, move) {
  var text = User.displayNameOf(uid) + " suggests " + move.notation;
  Meteor.call('log', move.gameId, move.turnIndex, text, 'sugMove');
}

function deduceCoinsFor(uid) {
  Meteor.users.update(
    { _id: uid },
    { $inc: { tokens: -MOVE_COST } }
  );
}