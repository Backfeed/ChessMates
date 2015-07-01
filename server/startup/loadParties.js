Meteor.startup(function () {
  if (Parties.find().count() === 0) {
    var parties = [
    {'name': 'Dubstep-Free Zone',
    'description': 'Fast just got faster with Nexus S.'},
    {'name': 'All dubstep all the time',
    'description': 'Get it on!'},
    {'name': 'Savage lounging',
    'description': 'Leisure suit required. And only fiercest manners.'}
    ];
    for (var i = 0; i < parties.length; i++)
      Parties.insert({name: parties[i].name, description: parties[i].description});
  }

  if (Games.find().count() === 0) {
    var games = [
    {
      'time_per_move': 5,
      'pgn': 'wewe',
      'fen': 'gyvg'
    }
    ]
    for (var i = 0; i < games.length; i++)
      Games.insert({name: games[i].name, description: games[i].description});
  }
});

