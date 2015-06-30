angular.module("blockchess").run(["$rootScope", "$location", function($rootScope, $location) {
    $rootScope.$on("$stateChangeError", function(event, next, previous, error) {
        // We can catch the error thrown when the $requireUser promise is rejected
        // and redirect the user back to the main page
        if (error === "AUTH_REQUIRED") {
            $location.path("/parties");
        }
    });
}]);

angular.module("blockchess").config(['$urlRouterProvider', '$stateProvider', '$locationProvider',
    function($urlRouterProvider, $stateProvider, $locationProvider){
        $locationProvider.html5Mode(true);
        $urlRouterProvider.otherwise("/games");
    }]);
