Meteor.startup(function () {
  console.log('==========\n\n\n\n\n\n');
  if (Games.find().count() === 0) {
    var games = [
      {
        'game_id': '1',
        'moves': [],
        'pgn': [],
        'fen': 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
        'settings': {
          'inPlay': false,
          'timePerMove': 300000,
          'timeLeft': 300000
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
              // An array for each star value
              [
                {
                  'user_id': '1',
                  'created_at': '1435857130718',
                  'updated_at': '1435857152171',
                  'favorite_move': false
                }
              ],
              [],
              [],
              [],
              []
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
            'evaluations': [[],[],[],[],[]]
          }
        ]
      }
    ];

    var new_game = [
      {
        'game_id': '1',
        'pgn': [],
        'fen': 'start',
        'settings': {
          'timePerMove': 300000
        },
        'turns': [],
        'suggested_moves': []
      }
    ];
    _.forEach(new_game, function(game) {
      Games.insert(game);
    });
  }

    // the password for each user is the name of the user twice
  if (Meteor.users.find().count() === 0) {

    var users = [
      {
        "reputation" : 20,
        "tokens" : 50,
        "createdAt" : Date.now(),
        "services" : {
          "password" : {
            "bcrypt" : "$2a$10$nkfJ8m2JL6Ni0ecOQIaaWuo9XWAND0Wdsy5MZIHyKpTjXEbupJuhe"
          },
          "resume" : {
            "loginTokens" : []
          }
        },
        "emails" : [
          {
            "address" : "tal@backfeed.cc",
            "verified" : false
          }
        ]
      },
      {
        "reputation" : 30,
        "tokens" : 200,
        "createdAt" : Date.now(),
        "services" : {
          "password" : {
            "bcrypt" : "$2a$10$7.rs66fgwp.rnR5koBk9buJmPs9zIduT2i2QtLmzXUJb6lhRiNqtO"
          },
          "resume" : {
            "loginTokens" : []
          }
        },
        "emails" : [
          {
            "address" : "yaniv@backfeed.cc",
            "verified" : false
          }
        ]
      },
      {
        "reputation" : 30,
        "tokens" : 30,
        "createdAt" : Date.now(),
        "services" : {
          "password" : {
            "bcrypt" : "$2a$10$k3wvBtGFvmj4plnd6cPqkeiHU.p.VddexnIxli0i7JI/p8RPH5iEW"
          },
          "resume" : {
            "loginTokens" : []
          }
        },
        "emails" : [
          {
            "address" : "zeev@backfeed.cc",
            "verified" : false
          }
        ]
      },
      {
        "reputation" : 20,
        "tokens" : 100,
        "createdAt" : Date.now(),
        "services" : {
          "password" : {
            "bcrypt" : "$2a$10$/goye4kWv7rDtHYxjvYfNuDWCIINqKOCKWYEbBOjmgpN9lJ9Vbeii"
          },
          "resume" : {
            "loginTokens" : [
              {
                "when" : Date.now(),
                "hashedToken" : "uhc2qSU2gXKJLzKIl2is0+c8Q9/nPURWp32l4YBiPbs="
              }
            ]
          }
        },
        "emails" : [
          {
            "address" : "primavera@backfeed.cc",
            "verified" : false
          }
        ]
      }
    ];

    _.forEach(users, function(user) {
      Meteor.users.insert(user);
    });
  }
});
