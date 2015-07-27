angular.module('blockchess.game', [
  // Controllers
  'blockchess.game.controller',
  // Models (angular services who handle DB data)
  'blockchess.game.evaluationModel',
  'blockchess.game.model',
  // Components
  'blockchess.game.chess',
  // Services
  'blockchess.game.service',
  // Directives
  'blockchess.game.suggestedMoves',
  'blockchess.game.comments',
  'blockchess.game.players',
  'blockchess.game.timer',
  // Filters
  'blockchess.game.avgStars'
])
