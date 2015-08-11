Meteor.publish('suggestedMoves', publish);

SuggestedMoves.before.insert(beforeInsert);
SuggestedMoves.after.insert(afterInsert);

Meteor.methods({
  validateSugMovExists: validateExists,
  noSugMov: isBlank
});

function validateExists(gameId, turnIndex) {
  if (isBlank(gameId, turnIndex))
    throw new Meteor.Error(403, 'No moves suggested');
}

function isBlank(gameId, turnIndex) {
  return !count(gameId, turnIndex);
}


/********* Helper methods *********/
function validateSufficientTokens(userId) {
  var userTokens = getUserBy(userId).tokens;
  if (userTokens < 1)
    throw new Meteor.Error(404, 'Insufficient funds: Suggesting a move costs 1 token, you have ' + userTokens + 'tokens');
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
function publish(options, gameId, turnIndex) {
  turnIndex = turnIndex || 1;
  return SuggestedMoves.find({ "gameId": "1", "turnIndex": turnIndex });
}

function beforeInsert(userId, move) {
  if (!userId) return;
  validateUniqueness(move);
  validateSufficientTokens(userId);
}

function afterInsert(userId, move) {
  if (!userId) return;
  Meteor.users.update(
    { _id: userId },
    { $inc: { tokens: -1 } }
  );
}