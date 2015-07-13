angular.module('blockchess.games.util', [
  // Models (angular services who handle DB data)
  'blockchess.games.util.model',
  'blockchess.games.util.evaluationModel',
  // Services
  'blockchess.games.util.gameBoardService',
  'blockchess.games.util.boardService',
  'blockchess.games.util.service',
  'blockchess.games.util.engine',
  // Directives
  'blockchess.games.util.board',
  'blockchess.games.util.suggestedMoves',
  'blockchess.games.util.suggestedMovesPanel',
  'blockchess.games.util.comments',
  'blockchess.games.util.timer',
  // Modals
  'blockchess.games.util.suggestMoveModal'
]);