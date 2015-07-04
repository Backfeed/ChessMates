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
  // For development
  $scope.Engine = Engine;
  // avoid binding break
  $scope.foo = {};
  // For development
  $scope.playAI = function() {
    Engine.getMove($scope.foo.game.history({ verbose: true }).map(function(move){ return move.from + move.to }).join(" "));
  };

  var gameId = "1";

  angular.extend($scope, {
    fen            : 'start',
    selected_move  : {}
  });

  $scope.game = $meteor.object(Games, { game_id: gameId }).subscribe('games');

  function onBestMove(e, from, to, promotion) {
    $scope.foo.game.move({ from: from, to: to, promotion: promotion });
    $scope.foo.board.position($scope.foo.game.fen());
  }

  //TODO why not inject a service here? could we avoid broadcasting data to the whole app?
  $scope.$on('singleMove', singleMove);
  $scope.$on('suggestedMovesSelected', suggestedMovesSelected);
  $scope.$on('angularStockfish::bestMove', onBestMove);

  function singleMove(e, board, game) {
    //TODO validate that this is the first time the player makes a suggestion
    var pgn = game.pgn();
    var notation = pgn.slice(pgn.lastIndexOf('.')+2, pgn.length);
    var newMove = {
        user_id: Meteor.userId(),
        notation: notation,
        avg_stars: '4.5',
        created_at: Date.now(),
        fen: game.fen(),
        comments: []
    };
    $scope.game.suggested_moves.push(newMove);

    //TODO alert the user that the move has been suggested
    alert('success on suggesting a move');
    //TODO move the piece back
    $scope.foo.board.position($scope.fen);

  }

  function suggestedMovesSelected(e, move) {
    $scope.selected_move = move;
    $scope.foo.board.position(move.fen);
  }

}
