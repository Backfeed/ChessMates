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

function BlockchessGamesController($scope, $meteor, Engine) {
  $scope.suggestedMoves = $meteor.collection(SuggestedMoves);
  $scope.Engine = Engine;

  $scope.$on('singleMove', singleMove);
}

function singleMove(e, from, to, isLegal) {
  console.log(e, from, to, isLegal)
  if (isLegal) {
    debugger
    $scope.suggestedMoves.push({move: from+to})
  }
}