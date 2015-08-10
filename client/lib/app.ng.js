angular.module('blockchess', [
    'angular-meteor',
    'ui.router',
    'angularUtils.directives.dirPagination',
    'ngMaterial',
    'ui.bootstrap',
    'blockchess.config',
    'blockchess.util',
    'blockchess.clan',
    'blockchess.clans',
    'blockchess.game',
    'blockchess.games',
    'blockchess.topBar'
]);

function onReady() {
    angular.bootstrap(document, ['blockchess']);
}

if (Meteor.isCordova)
    angular.element(document).on("deviceready", onReady);
else
    angular.element(document).ready(onReady);
