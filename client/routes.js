angular.module("blockchess").run(["$rootScope", "$location", function($rootScope, $location) {
  $rootScope.$on("$stateChangeError", function(event, next, previous, error) {
        // We can catch the error thrown when the $requireUser promise is rejected
        // and redirect the user back to the main page
        if (error === "AUTH_REQUIRED") {
          $location.path("/games");
        }
      });
}]);

angular.module("blockchess").config(['$urlRouterProvider', '$stateProvider', '$locationProvider',
  function($urlRouterProvider, $stateProvider, $locationProvider){
    $locationProvider.html5Mode(true);


    $stateProvider
    .state('game', {
      url: '/game/:game_id',
      templateUrl: 'client/games/game.ng.html',
      controller: 'GameCtrl',
      resolve: {
        "currentUser": ["$meteor", function($meteor){
          return $meteor.requireUser();
        }]
      }
    });


    $urlRouterProvider.otherwise("/games");

  }]);
