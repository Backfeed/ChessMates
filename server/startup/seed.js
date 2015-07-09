Meteor.startup(function () {
  if (Games.find().count() === 0) {
    var games = [
      {
        'game_id': '1',
        'pgn': '1. e4 e5 2. Nf3 Nc6',
        'fen': 'r1bqkbnr/pppp1ppp/2n5/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 2 3',
        'settings': {
          'inPlay': false,
          'timePerMove': 30000,
          'timeLeft': 30000
        },
        'turns': [
          [{
            'user_id': '1',
            'created_at': '1435857130718',
            'updated_at': '1435857152171',
            'fen': 'r1bqkbnr/pppp1ppp/2n5/1B2p3/4P3/5N2/PPPP1PPP/RNBQK2R b KQkq - 3 3',
            'notation': 'e4',
            'avg_stars': '3.5',
            'relevance_score': '1',
            'reputation_sum': '1',
            'favorite_move': true,
            'comments': [
              {
                'user_id': '1',
                'created_at': '1435857130718',
                'text': 'This one will cause us to loose the diagonal'
              },
              {
                'user_id': '2',
                'created_at': '1435857230718',
                'text': 'no it wont'
              },
              {
                'user_id': '1',
                'created_at': '1435857330718',
                'text': 'oh yes it will'
              }
            ],
            'evaluations': [
              {
                'user_id': '1',
                'created_at': '1435857130718',
                'updated_at': '1435857152171',
                'stars': '3',
                'favorite_move': false
              }
            ]
          }]
        ],
        'suggested_moves': [
          {
            'user_id': '1',
            'created_at': '1435857130718',
            'updated_at': '1435857152171',
            'fen': 'r1bqkbnr/pppp1ppp/2n5/1B2p3/4P3/5N2/PPPP1PPP/RNBQK2R b KQkq - 3 3',
            'notation': 'e4',
            'avg_stars': '3.5',
            'relevance_score': '1',
            'reputation_sum': '1',
            'favorite_move': true,
            'comments': [
              {
                'user_id': '1',
                'created_at': '1435857130718',
                'text': 'This one will cause us to loose the diagonal'
              },
              {
                'user_id': '2',
                'created_at': '1435857230718',
                'text': 'no it wont'
              },
              {
                'user_id': '1',
                'created_at': '1435857330718',
                'text': 'oh yes it will'
              }
            ],
            'evaluations': [
              {
                'user_id': '1',
                'created_at': '1435857130718',
                'updated_at': '1435857152171',
                'stars': '3',
                'favorite_move': false
              }
            ]
          }
        ]
      }
    ];

    var new_game = [
      {
        'game_id': '1',
        'pgn': '',
        'fen': 'start',
        'settings': {
          'inPlay': false,
          'timePerMove': 30000,
          'timeLeft': 30000
        },
        'turns': [],
        'suggested_moves': []
      }
    ];
    _.forEach(new_game, function(game) {
      Games.insert(game);
    });
  }
});
