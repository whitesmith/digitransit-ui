import cloneDeep from 'lodash/cloneDeep';
import forEach from 'lodash/forEach';
import values from 'lodash/values';

function filterLegStops(leg, filter) {
  if (leg.from.stop && leg.to.stop && leg.trip) {
    const stops = [leg.from.stop.gtfsId, leg.to.stop.gtfsId];
    return leg.trip.stoptimes
      .filter(stoptime => stops.indexOf(stoptime.stop.gtfsId) !== -1)
      .filter(filter);
  }
  return false;
}

/**
 * Check if legs start stop pickuptype or end stop pickupType is CALL_AGENCY
 *
 * leg must have:
 * from.stop.gtfsId
 * to.stop.gtfsId
 * trip.stoptimes (with props:)
 *   stop.gtfsId
 *   pickupType
 */
export function isCallAgencyPickupType(leg) {
  return (
    filterLegStops(leg, stoptime => stoptime.pickupType === 'CALL_AGENCY')
      .length > 0
  );
}

export function isCallAgencyDeparture(departure) {
  return departure.pickupType === 'CALL_AGENCY';
}

/**
 * Checks if both of the legs exist and are taken with a rented bicycle (rentedBike === true).
 *
 * @param {*} leg1 the first leg
 * @param {*} leg2 the second leg
 */
const continueWithRentedBicycle = (leg1, leg2) =>
  leg1 != null &&
  leg1.rentedBike === true &&
  leg2 != null &&
  leg2.rentedBike === true;

/**
 * The leg mode depicts different types of leg available.
 */
export const LegMode = {
  Bicycle: 'BICYCLE',
  BicycleWalk: 'BICYCLE_WALK',
  CityBike: 'CITYBIKE',
  Walk: 'WALK',
  Bus: 'BUS',
  Tram: 'TRAM',
  Ferry: 'FERRY',
  Rail: 'RAIL',
  Subway: 'SUBWAY',
  Airplane: 'AIRPLANE',
  Car: 'CAR'
};

/**
 * Extracts the mode for the given leg or mode.
 *
 * @param {*} legOrMode the leg or mode to extract the mode from
 * @returns LegMode, or undefined if the mode cannot be extracted
 */
export const getLegMode = legOrMode => {
  const mode =
    typeof legOrMode === 'string' || legOrMode instanceof String
      ? legOrMode
      : legOrMode && legOrMode.mode;
  
  const _legMode = (mode || '').toUpperCase();

  return values(LegMode).find(m => m === _legMode)
};

/**
 * Checks if both of the legs exist and are taken with mode 'BICYCLE'.
 *
 * @param {*} leg1 the first leg
 * @param {*} leg2 the second leg
 */
const continueWithBicycle = (leg1, leg2) =>
  getLegMode(leg1) === LegMode.Bicycle && getLegMode(leg2) === LegMode.Bicycle;

/**
 * Compresses the incoming legs (affects only legs with mode BICYCLE, WALK or CITYBIKE). These are combined
 * so that the person will be walking their bicycle and there won't be multiple similar legs
 * one after the other.
 *
 * @param {*} originalLegs an array of legs
 */
export const compressLegs = originalLegs => {
  const usingOwnBicycle =
    originalLegs[0] != null &&
    originalLegs[1] != null &&
    ((getLegMode(originalLegs[0]) === LegMode.Bicycle &&
      !originalLegs[0].rentedBike) ||
      (getLegMode(originalLegs[1]) === LegMode.Bicycle &&
        !originalLegs[1].rentedBike));
  const compressedLegs = [];
  let compressedLeg;

  forEach(originalLegs, currentLeg => {
    if (!compressedLeg) {
      compressedLeg = cloneDeep(currentLeg);
      return;
    }

    if (currentLeg.intermediatePlace) {
      compressedLegs.push(compressedLeg);
      compressedLeg = cloneDeep(currentLeg);
      return;
    }

    if (usingOwnBicycle && continueWithBicycle(compressedLeg, currentLeg)) {
      compressedLeg.duration += currentLeg.duration;
      compressedLeg.distance += currentLeg.distance;
      compressedLeg.to = currentLeg.to;
      compressedLeg.endTime = currentLeg.endTime;
      compressedLeg.mode = LegMode.Bicycle;
      return;
    }

    if (
      currentLeg.rentedBike &&
      continueWithRentedBicycle(compressedLeg, currentLeg)
    ) {
      compressedLeg.duration += currentLeg.duration;
      compressedLeg.distance += currentLeg.distance;
      compressedLeg.to = currentLeg.to;
      compressedLeg.endTime += currentLeg.endTime;
      compressedLeg.mode = LegMode.CityBike;
      return;
    }

    if (usingOwnBicycle && getLegMode(compressedLeg) === LegMode.Walk) {
      compressedLeg.mode = LegMode.BicycleWalk;
    }

    compressedLegs.push(compressedLeg);
    compressedLeg = cloneDeep(currentLeg);

    if (usingOwnBicycle && getLegMode(currentLeg) === LegMode.Walk) {
      compressedLeg.mode = LegMode.BicycleWalk;
    }
  });

  if (compressedLeg) {
    compressedLegs.push(compressedLeg);
  }

  return compressedLegs;
};

const sumDistances = legs =>
  legs.map(l => l.distance).reduce((x, y) => (x || 0) + (y || 0), 0);
const isWalkingLeg = leg =>
  [LegMode.BicycleWalk, LegMode.Walk].includes(getLegMode(leg));
const isBikingLeg = leg =>
  [LegMode.Bicycle, LegMode.CityBike].includes(getLegMode(leg));
const isCarLeg = leg =>
  LegMode.Car === getLegMode(leg);
const isBusLeg = leg =>
  LegMode.Bus === getLegMode(leg);
const isSubwayLeg = leg =>
  LegMode.Subway === getLegMode(leg);
const isTramLeg = leg =>
  LegMode.Tram === getLegMode(leg);
const isRailLeg = leg =>
  LegMode.Rail === getLegMode(leg);

/**
 * Checks if the itinerary consists of a single biking leg.
 *
 * @param {*} itinerary the itinerary to check the legs for
 */
export const onlyBiking = itinerary =>
  itinerary.legs.length === 1 && isBikingLeg(itinerary.legs[0]);

/**
 * Checks if any of the legs in the given itinerary contains biking.
 *
 * @param {*} itinerary the itinerary to check the legs for
 */
export const containsBiking = itinerary => itinerary.legs.some(isBikingLeg);

/**
 * Calculates and returns the total walking distance undertaken in an itinerary.
 * This could be used as a fallback if the backend returns an invalid value.
 *
 * @param {*} itinerary the itinerary to extract the total walking distance from
 */
export const getTotalWalkingDistance = itinerary =>
  // TODO: could be itinerary.walkDistance, but that is invalid for CITYBIKE legs
  sumDistances(itinerary.legs.filter(isWalkingLeg));

/**
 * Calculates and returns the total biking distance undertaken in an itinerary.
 *
 * @param {*} itinerary the itinerary to extract the total biking distance from
 */
export const getTotalBikingDistance = itinerary =>
  sumDistances(itinerary.legs.filter(isBikingLeg));

/**
 * Calculates and returns the total distance undertaken in an itinerary.
 *
 * @param {*} itinerary the itinerary to extract the total distance from
 */
export const getTotalDistance = itinerary => sumDistances(itinerary.legs);

/**
 * Gets the indicator color for the current amount of citybikes available.
 *
 * @param {number} bikesAvailable the number of bikes currently available
 * @param {*} config the configuration for the software installation
 */
export const getCityBikeAvailabilityIndicatorColor = (bikesAvailable, config) =>
  bikesAvailable > config.cityBike.fewAvailableCount ? '#64be14' : '#ff9000';

/**
 * Attempts to retrieve any relevant information from the leg that could be shown
 * as the related icon's badge.
 *
 * @param {*} leg the leg to extract the props from
 * @param {*} config the configuration for the software installation
 */
export const getLegBadgeProps = (leg, config) => {
  if (!leg.rentedBike || !leg.from || !leg.from.bikeRentalStation) {
    return undefined;
  }
  const { bikesAvailable } = leg.from.bikeRentalStation || 0;
  return {
    badgeFill: getCityBikeAvailabilityIndicatorColor(bikesAvailable, config),
    badgeText: `${bikesAvailable}`,
  };
};

/**
 * Retrieves all zones from the legs (from & to points) and the legs' stops.
 *
 * @param {*} legs The legs to retrieve the zones from.
 */
export const getZones = legs => {
  if (!Array.isArray(legs)) {
    return [];
  }

  const zones = {};
  legs.forEach(leg => {
    if (leg.from && leg.from.stop && leg.from.stop.zoneId) {
      zones[leg.from.stop.zoneId] = true;
    }
    if (leg.to && leg.to.stop && leg.to.stop.zoneId) {
      zones[leg.to.stop.zoneId] = true;
    }
    if (Array.isArray(leg.intermediatePlaces)) {
      leg.intermediatePlaces
        .filter(place => place.stop && place.stop.zoneId)
        .forEach(place => {
          zones[place.stop.zoneId] = true;
        });
    }
  });
  if (zones.A && zones.C) {
    zones.B = true;
  }
  return Object.keys(zones).sort();
};

/*
  Extra calculation for itineraries
    - Calories for walkLegs
    - CO2 for carLegs
    - Price for busLegs and subwayLegs
*/

export const getTotalWalkingCalories = (itinerary) =>
  itinerary.legs.filter(
    isWalkingLeg
  ).map(
    l => l.calories
  ).reduce(
    (x, y) => (x || 0) + (y || 0), 0
  );

export const getTotalCO2Emissions = (itinerary) =>
  itinerary.legs.filter(
    leg => (
      isCarLeg(leg) || isBusLeg(leg) || isSubwayLeg(leg) || isTramLeg(leg) || isRailLeg(leg)
    )
  ).map(
    l => l.co2
  ).reduce(
    (x, y) => (x || 0) + (y || 0), 0
  );

export const getTotalCost = (itinerary) =>
  itinerary.legs.filter(
    leg => (
      isBusLeg(leg) || isSubwayLeg(leg)
    )
  ).map(
    l => l.cost
  ).reduce(
    (x, y) => (x || 0) + (y || 0), 0
  );


// gCO2/m per transportation type
const CO2EmissionByMode = {
  [LegMode.Car]: 0.135,
  [LegMode.Bus]: 0.07,
  [LegMode.Subway]: 0.0305,
  [LegMode.Tram]: 0.023,
  [LegMode.Rail]: 0.028,
};

export const addExtraCalcsToLeg = leg => {
  if (isWalkingLeg(leg)) {
    // calories
    if (!leg.distance) return;
    leg.calories = leg.distance * 0.068;
  }

  if (isCarLeg(leg) || isBusLeg(leg) || isSubwayLeg(leg) || isTramLeg(leg) || isRailLeg(leg)) {
    // gCO2
    if (!leg.distance) return;
    leg.co2 = leg.distance * CO2EmissionByMode[getLegMode(leg)];
  }

  if (isBusLeg(leg) || isSubwayLeg(leg)) {
    // trip cost
    if (!leg.distance) return;
    leg.cost = (leg.distance / 1000) * 1.2;
  }
};

export const addExtraCalcsToItinerary = itinerary => {
  itinerary.legs.forEach(leg => {
    leg = addExtraCalcsToLeg(leg);
  });
  
  itinerary.calories = getTotalWalkingCalories(itinerary);
  itinerary.co2 = getTotalCO2Emissions(itinerary);
  itinerary.cost = getTotalCost(itinerary);
};

export const addExtraCalcsToItineraries = itineraries => {
  itineraries.forEach(itinerary => {
    itinerary = addExtraCalcsToItinerary(itinerary);
  });
};