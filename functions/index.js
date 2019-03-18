const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp(functions.config().firebase);

exports.update_records = functions.database
  .ref('/search-history/{userID}/{nodeID}')
  .onCreate((snapshot, context) => {
    let database = admin.database();
    let new_record = snapshot.val();

    new_record = calculateBusKm(snapshot, context);

    let year = new Date().getFullYear();
    let month = new Date().getMonth();
    path = 'monthly-records/' + year + '/' + month + '/';
    path += context.params.userID + '/' + context.params.nodeID;
    database
      .ref(path)
      .set(new_record)
      .then(calculateMonthAverages)
      .catch(() => {});

    path = 'last-30-days-average/' + context.params.userID + '/';
    path += context.params.nodeID;
    return database
      .ref(path)
      .set(new_record)
      .then(clearOldRecords)
      .then(calculateAverages);
  });

exports.updateStatistics = functions.https.onRequest((req, res) => {
  clearOldRecords()
    .then(calculateAverages)
    .catch(() => {});
  res.send('Updating statistics');
});

calculateBusKm = (snapshot, context) => {
  let database = admin.database();
  const new_record = snapshot.val();

  busKm = 0;
  if (new_record['itinerary']) {
    Object.keys(new_record['itinerary']['legs']).forEach(leg => {
      if (new_record['itinerary']['legs'][leg]['mode'] === 'BUS') {
        busKm += new_record['itinerary']['legs'][leg]['distance'];
      }
    });
    new_record['itinerary']['publicTransportation'] = busKm;
  }
  return new_record;
};

clearOldRecords = () => {
  let database = admin.database();
  return database.ref('last-30-days-average/').once('value', snapshot => {
    let records = snapshot.val();
    let new_records = {};
    let oneMonthAgo = new Date().getTime() - 30 * 24 * 60 * 60 * 1000;
    Object.keys(records).forEach(user => {
      new_records[user] = {};
      Object.keys(records[user]).forEach(entry => {
        let recordTimestamp = records[user][entry]['timestamp'] * 1000;
        if (recordTimestamp > oneMonthAgo) {
          new_records[user][entry] = records[user][entry];
        }
      });
    });
    return database.ref('last-30-days-average/').set(new_records);
  });
};

calculateMonthAverages = () => {
  let year = new Date().getFullYear();
  let month = new Date().getMonth();

  let database = admin.database();
  return database
    .ref('monthly-records/' + year + '/' + month)
    .once('value', snapshot => {
      averages = calculateUserAverages(snapshot.val());
      averages['global'] = calculateGlobalAverages(averages);
      organizeAveragesPerCurrentMonth(averages);
    });
};

let organizeAveragesPerCurrentMonth = averages => {
  let database = admin.database();
  let year = new Date().getFullYear();
  let month = new Date().getMonth();

  Object.keys(averages).forEach(user => {
    database
      .ref('monthly-averages/' + user + '/' + year + '/' + month)
      .set(averages[user]);
  });

  database
    .ref('monthly-averages/' + 'global' + '/' + year + '/' + month)
    .set(averages['global']);
};

calculateAverages = () => {
  let database = admin.database();
  return database.ref('last-30-days-average/').once('value', snapshot => {
    averages = calculateUserAverages(snapshot.val());
    averages['global'] = calculateGlobalAverages(averages);
    database.ref('averages/').set(averages);
  });
};

let calculateGlobalAverages = averages => {
  busKmCounter = 0;
  (co2Counter = 0), (costCounter = 0), (calCounter = 0), (distanceCounter = 0);
  (co2Sum = 0), (costSum = 0), (calSum = 0), (distanceSum = 0), (busKmSum = 0);
  Object.keys(averages).forEach(average => {
    co2Counter++;
    costCounter++;
    calCounter++;
    distanceCounter++;
    busKmCounter++;

    co2Sum += averages[average]['co2'];
    costSum += averages[average]['cost'];
    calSum += averages[average]['calories'];
    distanceSum += averages[average]['walkDistance'];
    busKmSum += averages[average]['publicTransportation'];
  });
  return {
    co2: co2Counter !== 0 ? co2Sum / co2Counter : 0,
    calories: calCounter !== 0 ? calSum / calCounter : 0,
    cost: costCounter !== 0 ? costSum / costCounter : 0,
    walkDistance: distanceCounter !== 0 ? distanceSum / distanceCounter : 0,
    publicTransportation: busKmCounter !== 0 ? busKmSum / busKmCounter : 0,
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

  busKmCounter = 0;
  (co2Counter = 0), (costCounter = 0), (calCounter = 0), (distanceCounter = 0);
  (co2Sum = 0), (costSum = 0), (calSum = 0), (distanceSum = 0), (busKmSum = 0);

  Object.keys(history[user]).forEach(entry => {
    let itinerary = history[user][entry]['itinerary'];
    let timestamp = history[user][entry]['timestamp'] * 1000;
    let difference = Date.now() - timestamp;
    let searchedThisMonth = difference < monthMilliseconds;

    if (itinerary !== undefined && searchedThisMonth) {
      co2Counter++;
      costCounter++;
      calCounter++;
      distanceCounter++;
      busKmCounter++;

      co2Sum += itinerary['co2'];
      costSum += itinerary['cost'];
      calSum += itinerary['calories'];
      distanceSum += itinerary['walkDistance'];
      busKmSum += itinerary['publicTransportation'];
    }
  });

  return {
    co2: co2Counter !== 0 ? co2Sum / co2Counter : 0,
    calories: calCounter !== 0 ? calSum / calCounter : 0,
    cost: costCounter !== 0 ? costSum / costCounter : 0,
    walkDistance: distanceCounter !== 0 ? distanceSum / distanceCounter : 0,
    publicTransportation: busKmCounter !== 0 ? busKmSum / busKmCounter : 0,
  };
};
