angular.module('blockchess.games', [])
.config(config)
.controller('BlockchessGames', BlockchessGamesController)

function config($stateProvider){

    $stateProvider
        .state('games', {
            url: '/games',
            templateUrl: 'client/games/games.ng.html',
            controller: 'BlockchessGames'
        });
}

function BlockchessGamesController($scope) {
  angular.extend($scope, {
    suggestedMoves: []
  });

  $scope.$on('moveMade', function() {
    $scope.suggestedMoves = [];
  });
}