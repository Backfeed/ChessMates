angular.module('blockchess.games', [])
.config(config)
.controller('BlockchessGames', GamesController)

function config($stateProvider){

    $stateProvider
        .state('games', {
            url: '/games',
            templateUrl: 'client/games/games.ng.html',
            controller: 'BlockchessGames'
        });
}

function GamesController($scope, $meteor, Engine) {
  $scope.Engine = Engine;
  var gameId = "1";
  $scope.selected_move = {}
  $scope.suggestedMoves = $meteor.collection(SuggestedMoves);
  $scope.evaluations    = $meteor.collection(Evaluations).subscribe('evaluations', $scope.selected_move._id);
  $scope.comments       = $meteor.collection(Comments).subscribe('evaluations', $scope.selected_move._id);
  $scope.evauluateMove = evauluateMove
  $scope.select = select

  $meteor.autorun($scope, function() {
    $meteor.subscribe('suggested_moves', {}, gameId).then(function(){
      console.log($scope.suggested_moves);
    });
  });

  $scope.$on('singleMove', singleMove);

  function singleMove(e, from, to, isLegal) {
    console.log(e, from, to, isLegal)
    if (isLegal) {
      $scope.suggestedMoves.push({fen: from+to, game_id: gameId, currentUser_id: $scope.currentUser._id});
    } else {
      console.log('fool');
      alert("that's illegal fool");
    }
  }

  function evauluateMove() {
    console.log($scope.selected_move);
    $scope.evaluations.push({
      user_id: $scope.currentUser._id,
      game_id: gameId,
      suggested_move_id: $scope.selected_move._id,
      favorite_move: $scope.selected_move.favorite_move,
      stars: $scope.selected_move.stars
    });
  }

  function addComment() {
    console.log($scope.comment);
    $scope.comments.push({
      user_id: $scope.currentUser._id,
      game_id: gameId,
      suggested_move_id: $scope.selected_move._id,
      body: $scope.comment.body
    });
    $scope.comment = ''
  }

  function select(move) {
    console.log(move);
    $scope.selected_move = move;
  }

}
