angular.module('blockchess',[
    'angular-meteor',
    'ui.router',
    'angularUtils.directives.dirPagination',
    'ngMaterial',
    'ui.bootstrap',
    'nywton.chess',
    'blockchess.utilities',
    'blockchess.games'
]);

var themeIcons = ['$mdIconProvider' , function ($mdIconProvider) {

    $mdIconProvider
        .iconSet("social", "/packages/planettraining_material-design-icons/bower_components/material-design-icons/sprites/svg-sprite/svg-sprite-social.svg")
        .iconSet("action", "/packages/planettraining_material-design-icons/bower_components/material-design-icons/sprites/svg-sprite/svg-sprite-action.svg")
        .iconSet("communication", "/packages/planettraining_material-design-icons/bower_components/material-design-icons/sprites/svg-sprite/svg-sprite-communication.svg")
        .iconSet("content", "/packages/planettraining_material-design-icons/bower_components/material-design-icons/sprites/svg-sprite/svg-sprite-content.svg")
        .iconSet("toggle", "/packages/planettraining_material-design-icons/bower_components/material-design-icons/sprites/svg-sprite/svg-sprite-toggle.svg")
        .iconSet("navigation", "/packages/planettraining_material-design-icons/bower_components/material-design-icons/sprites/svg-sprite/svg-sprite-navigation.svg")
        .iconSet("image", "/packages/planettraining_material-design-icons/bower_components/material-design-icons/sprites/svg-sprite/svg-sprite-image.svg");

}];

angular.module('blockchess')
    .constant('TIME_PER_MOVE', 1000 * 60 * 5)
    .config(themeIcons);

function onReady() {
    angular.bootstrap(document, ['blockchess']);
}

if (Meteor.isCordova)
    angular.element(document).on("deviceready", onReady);
else
    angular.element(document).ready(onReady);

