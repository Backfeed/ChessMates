Meteor.publish('suggestedMoves', function (options, gameId, turnIndex) {
  if (!turnIndex)
    turnIndex = 1;
  return SuggestedMoves.find({"gameId": "1", "turnIndex": turnIndex});
});

