const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp(functions.config().firebase);

exports.calculateAverages = functions.https.onRequest((req, res) => {
  let database = admin.database();
  return database.ref('search-history/').once('value', snapshot => {
    averages = calculateUserAverages(snapshot.val());
    averages['global'] = calculateGlobalAverages(averages);
    database.ref('averages/').set(averages);
    res.status(200).send('Done');
  });
});

let calculateGlobalAverages = averages => {
  (co2Counter = 0), (costCounter = 0), (calCounter = 0);
  (co2Sum = 0), (costSum = 0), (calSum = 0);
  Object.keys(averages).forEach(average => {
    co2Counter++;
    costCounter++;
    calCounter++;

    co2Sum += averages[average]['co2'];
    costSum += averages[average]['cost'];
    calSum += averages[average]['calories'];
  });
  return {
    co2: co2Counter !== 0 ? co2Sum / co2Counter : 0,
    calories: calCounter !== 0 ? calSum / calCounter : 0,
    cost: costCounter !== 0 ? costSum / costCounter : 0,
  };
};

let calculateUserAverages = history => {
  averages = {};
  Object.keys(history).forEach(user => {
    averages[user] = averagesForUser(history, user);
  });
  return averages;
};

let averagesForUser = (history, user) => {
  var monthMilliseconds = 1000 * 60 * 60 * 24 * 30;

  (co2Counter = 0), (costCounter = 0), (calCounter = 0);
  (co2Sum = 0), (costSum = 0), (calSum = 0);

  Object.keys(history[user]).forEach(entry => {
    let itinerary = history[user][entry]['itinerary'];
    let timestamp = history[user][entry]['timestamp'] * 1000;
    let difference = Date.now() - timestamp;
    let searchedThisMonth = difference < monthMilliseconds;

    if (itinerary !== undefined && searchedThisMonth) {
      co2Counter++;
      costCounter++;
      calCounter++;

      co2Sum += itinerary['co2'];
      costSum += itinerary['cost'];
      calSum += itinerary['calories'];
    }
  });

  return {
    co2: co2Counter !== 0 ? co2Sum / co2Counter : 0,
    calories: calCounter !== 0 ? calSum / calCounter : 0,
    cost: costCounter !== 0 ? costSum / costCounter : 0,
  };
};
