angular.module("blockchess.config.routes", [])
.run(stateChangeError)
.run(stateChangeSuccess)
.config(routes);

function routes($urlRouterProvider, $locationProvider) {
  $locationProvider.html5Mode(true);
  $urlRouterProvider.otherwise("/games/");
}

function stateChangeError($rootScope, $state) {
  $rootScope.$on("$stateChangeError", function(event, next, previous, error) {
    // We can catch the error thrown when the $requireUser promise is rejected
    // and redirect the user back to the main page
    if (error === "AUTH_REQUIRED") {
      $state.go("games");
    }
  });
}

function stateChangeSuccess($rootScope, $meteor) {
  $rootScope.$on("$stateChangeSuccess", function() {
    $meteor.requireUser().then(function(u) {
      $rootScope.currentUser = u;
    });
  });
}