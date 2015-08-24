/* jshint ignore:start */
Meteor.startup(function () {
  console.log('==========\n\n\n\n\n\n');

  // if (Roles.getAllRoles().length === 0)    seedRoles();
  // if (F.getUsersBy().count() === 0)   seedUsers();
  // if (Clans.find().count() === 0)          seedClan();
  // if (Timers.find().count() === 0)         seedTimer();
  // if (SuggestedMoves.find().count() === 0) seedSuggestedMoves();
  // //if (Evaluations.find().count() === 0)    seedEvaluations(); //Cause a bug on startup
  // if (Games.find().count() === 0)          seedGame();
});

function seedTimer() {
  Timers.insert({
    'gameId': '1',
    'inPlay': false,
    'timePerMove': 300000,
    'timeLeft': 300000
  });
}

function seedSuggestedMoves() {
  var suggestedMoves = [
    {
      'gameId': '1',
      'turnIndex': 1,
      'uid': '1',
      'createdAt': '1435857130718',
      'fen': 'r1bqkbnr/pppp1ppp/2n5/1B2p3/4P3/5N2/PPPP1PPP/RNBQK2R b KQkq - 3 3',
      'notation': 'e4'
    },
    {
      'gameId': '1',
      'turnIndex': 2,
      'uid': '1',
      'createdAt': '1435857130718',
      'fen': 'r1bqkbnr/pppp1ppp/2n5/1B2p3/4P3/5N2/PPPP1PPP/RNBQK2R b KQkq - 3 3',
      'notation': 'd4'
    }
  ];
  _.each(suggestedMoves, function(sugMove) {
    SuggestedMoves.insert(sugMove);
  });
}

function seedEvaluations() {
  var evaluations = [
    {
      'moveId': '1',
      'uid': '1',
      'createdAt': '1435857130718',
      'stars': 4
    },
    {
      'moveId': '2',
      'uid': '1',
      'createdAt': '1435857130718',
      'stars': 2
    }
  ];
  _.each(evaluations, function(evaluation) {
    Evaluations.insert(evaluation);
  });
}

function seedGame() {
  var newGame = [
    {
      'gameId': '1',
      'moves': [],
      'turnIndex': 1,
      'playedThisTurn': [],
      'pgn': [],
      'fen': 'start'
    }
  ];
  _.each(newGame, function(game) {
    Games.insert(game);
  });
}

function seedRoles() {
  Roles.createRole('admin'); // can change setting during the game
  Roles.createRole('clan-master'); // can change setting and invite to join...
}

function seedUsers() {
  // the password for each user is 'taltal'
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
      "reputation" : 20,
      "tokens" : 50,
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
      "reputation" : 20,
      "tokens" : 50,
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
      "tokens" : 50,
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
    },
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
          "address" : "elad@backfeed.cc",
          "verified" : false
        }
      ]
    },
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
          "address" : "ore@backfeed.cc",
          "verified" : false
        }
      ]
    },
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
          "address" : "adam@backfeed.cc",
          "verified" : false
        }
      ]
    },
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
          "address" : "ronny@backfeed.cc",
          "verified" : false
        }
      ]
    },
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
          "address" : "michel@backfeed.cc",
          "verified" : false
        }
      ]
    },
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
          "address" : "shahar@backfeed.cc",
          "verified" : false
        }
      ]
    },
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
          "address" : "dana@backfeed.cc",
          "verified" : false
        }
      ]
    },
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
          "address" : "philh@backfeed.cc",
          "verified" : false
        }
      ]
    },
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
          "address" : "matan@backfeed.cc",
          "verified" : false
        }
      ]
    },
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
          "address" : "latif@backfeed.cc",
          "verified" : false
        }
      ]
    }
  ];

  _.each(users, function(user) {
    user.username = user.emails[0].address.split('@')[0];
    var id = Accounts.createUser(user);
    Meteor.users.update({_id:id}, user);
    addRoles(id, user.username);
  });

  function addRoles(id, name) {
    var admins = ['admin', 'genesis', 'clan-master'];
    var member = 'genesis';
    // Adam and Yaniv are admins
    if (name === 'adam' || name === 'yaniv') {
      Roles.setUserRoles(id , admins);
    } else {
      Roles.setUserRoles(id, member);
    }
  }
}

function seedClan() {
  Clans.insert({
    description: "We are legions. We are everywhere. Expect us when you least expect us.",
    playersIds: [],
    imageUrl: 'http://backfeed.cc/wp-content/uploads/2015/05/loop_white.gif',
    title: "Backfeed kickass clan",
    totalTokens: 0
  });
}
/* jshint ignore:end */
