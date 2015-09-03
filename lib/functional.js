F = (function() {
  /***************** PURE *****************/
  // toFixed :: Number, Number -> String
  var toFixed = R.curry(function(l, x) {
    return x.toFixed(l);
  });

  var max = R.curry(function(f, xs) {
    return _.max(xs, f);
  });

  // sumBy :: String, [Object] -> Number
  var sumBy = R.curry(function(prop, xs) {
    return R.compose(R.sum, R.pluck(prop))(xs);
  });

  var trace = R.curry(function(tag, x){
    console.log(tag, x);
    return x;
  });

  // decimel :: Number, Number -> Number
  var decimel = R.curry(function(l, n) {
    if (!n) return;
    if (_.contains(n.toString(), 'e'))
      n = R.compose(parseFloat, R.head, R.split('e'), R.toString)(n);
    return R.compose(parseFloat, toFixed(l))(n);
  });

  var toBool = function(x) {
    return !!x;
  }

  var toPercent =  R.curry(function(divider, n) {
    return Math.round((n / divider) * 100);
  });

  // capitalize :: String -> String
  var capitalize = function (string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  var isActive = R.compose(toBool, R.prop('active'));

  var filterActive = R.filter(isActive);

  var filterBy = R.curry(function(attr, val, xs) {
    var predicate = {};
    predicate[attr] = val;
    return _.where(xs, predicate);
  });


  /***************** App specific *****************/
  // isMine :: Object -> String
  var isMine = R.propEq(this.uid, 'uid');

  // getMine :: [Object] -> [Object]
  var getMine = R.filter(isMine);

  // getUserBy :: String -> Object
  var getUserBy = function(uid) {
    return Meteor.users.findOne(uid);
  } 

  // TODO :: Use _ or ramda for this
  var mapFields = function(fields, bool) {
    var fieldsObj = {};
    _.each(fields, function(field) {
      fieldsObj[field] = bool;
    });
    return fieldsObj;
  }

  // getUsersBy :: Object / undefined -> [Object]
  var getUsersBy = function(q, fields, bool) {
    q = q || {};
    if (fields)
      fields = mapFields(fields, !bool);
    return Meteor.users.find(q, { fields: fields });
  }

  var mapUsersBy = R.map(getUserBy);

  var toUid = R.prop('uid');
  var mapUids = R.map(toUid);

  var toId = R.prop('_id');
  var mapIds = R.map(toId);

  return {

    toFixed: toFixed,
    max: max,
    sumBy: sumBy,
    trace: trace,
    decimel: decimel,
    isMine: isMine,
    getMine: getMine,
    getUserBy: getUserBy,
    mapFields: mapFields,
    capitalize: capitalize,
    getUsersBy: getUsersBy,
    mapUsersBy: mapUsersBy,
    toPercent: toPercent,
    filterBy: filterBy,
    toUid: toUid,
    mapUids: mapUids,
    toId: toId,
    mapIds: mapIds,
    filterActive: filterActive

  };

})();