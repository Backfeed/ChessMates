/* jshint ignore:start */
Meteor.startup(function () {
  console.log('==========\n\n\n\n\n\n');

  if (Roles.getAllRoles().length === 0)    seedRoles();
  if (Meteor.users.find().count() === 0)   seedUsers();
  if (Clans.find().count() === 0)          seedClan();
  if (Timers.find().count() === 0)         seedTimer();
  if (Status.find().count() === 0)         seedStatus();
  if (SuggestedMoves.find().count() === 0) seedSuggestedMoves();
  if (Evaluations.find().count() === 0)    seedEvaluations();
  if (Comments.find().count() === 0)       seedComments();
  if (Games.find().count() === 0)          seedGame();
});

function seedTimer() {
  Timers.insert({
    'gameId': '1',
    'inPlay': false,
    'timePerMove': 300000,
    'timeLeft': 300000
  });
}

function seedStatus() {
  Status.insert({
    'gameId': '1',
    'turn': 'start',
    'turnIndex': 1,
    'restarted': true
  });
}

function seedSuggestedMoves() {
  var suggestedMoves = [
    {
      'gameId': '1',
      'turnIndex': 1,
      'userId': '1',
      'createdAt': '1435857130718',
      'fen': 'r1bqkbnr/pppp1ppp/2n5/1B2p3/4P3/5N2/PPPP1PPP/RNBQK2R b KQkq - 3 3',
      'notation': 'e4'
    },
    {
      'gameId': '1',
      'turnIndex': 2,
      'userId': '1',
      'createdAt': '1435857130718',
      'fen': 'r1bqkbnr/pppp1ppp/2n5/1B2p3/4P3/5N2/PPPP1PPP/RNBQK2R b KQkq - 3 3',
      'notation': 'd4'
    }
  ];
  _.forEach(suggestedMoves, function(sugMove) {
    SuggestedMoves.insert(sugMove);
  });
}

function seedEvaluations() {
  var evaluations = [
    {
      'moveId': '1',
      'userId': '1',
      'createdAt': '1435857130718',
      'favoriteMove': false,
      'stars': 4
    },
    {
      'moveId': '2',
      'userId': '1',
      'createdAt': '1435857130718',
      'favoriteMove': false,
      'stars': 2
    }
  ];
  _.forEach(evaluations, function(evaluation) {
    Evaluations.insert(evaluation);
  });
}

function seedComments() {
  var comments = [
    {
      'suggestedMoveId': '1',
      'userId': '1',
      'text': 'This one will cause us to loose the diagonal'
    },
    {
      'suggestedMoveId': '1',
      'userId': '1',
      'text': 'davay davay das vedanya'
    },
    {
      'suggestedMoveId': '1',
      'userId': '1',
      'text': 'whats goin on'
    },
    {
      'suggestedMoveId': '2',
      'userId': '1',
      'text': 'second move s bitch'
    },
    {
      'suggestedMoveId': '3',
      'userId': '1',
      'text': 'this is a comment for third move'
    }
  ];
  _.forEach(comments, function(comment) {
    Comments.insert(comment);
  });
}

function seedGame() {
  var newGame = [
    {
      'gameId': '1',
      'moves': [],
      'playedThisTurn': [],
      'pgn': [],
      'fen': 'start',
    }
  ];
  _.forEach(newGame, function(game) {
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

  _.forEach(users, function(user) {
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
