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
  var gameId = "1"; // TODO: Get dynamically from current game
  
  angular.extend($scope, {
    fen            : 'start',
    selected_move  : {},
    Engine : Engine, // DEV ONLY
    isCurrentUserPlayed: isCurrentUserPlayed,
    foo: {},
    game: $meteor.object(Games, { game_id: gameId }).subscribe('games'),
    executeMove: executeMove,
    restart: restart // DEV ONLY
  });

  $scope.$watch('game.fen', function(){
    if ($scope.game.fen && $scope.fen !== $scope.game.fen)
    {
      $scope.foo.game.load($scope.game.fen);
      $scope.foo.board.position($scope.game.fen);
      $scope.fen = $scope.game.fen;
    }
  });

  //TODO why not inject a service here? could we avoid broadcasting data to the whole app?
  $scope.$on('singleMove', singleMove);
  $scope.$on('suggestedMovesSelected', suggestedMovesSelected);
  $scope.$on('angularStockfish::bestMove', onAIMove);

  function isCurrentUserPlayed() {
    var flag = false;
    $scope.game.suggested_moves.forEach(function(move){
      if (move.user_id === $scope.currentUser._id) { flag = true; }
    });
    return flag;
  }

  // For development
  function restart () {
    $scope.foo.game.reset();
    $scope.foo.board.position('start');
    $scope.game.fen = 'start';
    $scope.game.pgn = '';
    $scope.game.turns = [];
    $scope.game.suggested_moves = [];
  }

  function executeMove() {
    //TODO fix this. For now pressing the button will play the first selected move(for dev)
    $scope.foo.game.move($scope.game.suggested_moves[0].notation);
    $scope.foo.board.position($scope.foo.game.fen());
    Engine.getMove($scope.foo.game.history({ verbose: true }).map(function(move){ return move.from + move.to }).join(" "));
  }

  function onAIMove(e, from, to, promotion) {
    $scope.foo.game.move({ from: from, to: to, promotion: promotion });
    $scope.foo.board.position($scope.foo.game.fen());
    $scope.fen = $scope.foo.game.fen(); // save for returning the piece to before suggestion position
    $scope.game.fen = $scope.foo.game.fen(); //TODO all users should see the updated position
    $scope.game.pgn = $scope.foo.game.pgn();
    logTurn();
  }

  function singleMove(e) {
    if (!isCurrentUserPlayed()) {
      $scope.game.suggested_moves.push({
        user_id: Meteor.userId(),
        notation: getNotation($scope.foo.game.pgn()),
        avg_stars: '4.5',
        created_at: Date.now(),
        fen: $scope.foo.game.fen(),
        comments: []
      });
      alert('success on suggesting a move');
    } else {
      alert('Can only suggest one move per turn');
    }

    //TODO move the piece back in a more elegant way
    $scope.foo.game.undo();
    $scope.foo.board.position($scope.fen);
  }

  //TODO only highlight
  function suggestedMovesSelected(e, move) {
    $scope.selected_move = move;
    $scope.foo.board.position(move.fen);
  }

  function logTurn(){
    if ($scope.game.turns) {
      $scope.game.turns.push($scope.game.suggested_moves);
    } else {
      $scope.game.turns = [$scope.game.suggested_moves];
    }
    $scope.game.suggested_moves = [];
  }

  function getNotation(pgn){
    return pgn.slice(pgn.lastIndexOf('.')+2, pgn.length);
  }

}
