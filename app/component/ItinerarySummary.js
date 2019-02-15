import PropTypes from 'prop-types';
import React from 'react';
import Duration from './Duration';
import WalkDistance from './WalkDistance';
import WalkCalories from './WalkCalories';
import CO2Emissions from './CO2Emissions';
import {
  getTotalWalkingDistance,
  getTotalWalkingCalories,
  getTotalCO2Emissions,
  getTotalBikingDistance,
  containsBiking,
  onlyBiking,
} from '../util/legUtils';

const ItinerarySummary = ({ itinerary, children }) => (
  <div className="itinerary-summary">
    <Duration
      duration={itinerary.duration}
      className="duration--itinerary-summary"
    />
    {children}
    {containsBiking(itinerary) && (
      <WalkDistance
        className="biking-distance--itinerary-summary"
        icon="icon_biking"
        walkDistance={getTotalBikingDistance(itinerary)}
      />
    )}
    {!onlyBiking(itinerary) && (
      <span className="walking-distance--itinerary-summary">
        <WalkDistance walkDistance={getTotalWalkingDistance(itinerary)} />
        <WalkCalories walkCalories={getTotalWalkingCalories(itinerary)} />
      </span>
    )}
    <CO2Emissions 
      className="co2-emissions--itinerary-summary"
      co2Emissions={getTotalCO2Emissions(itinerary)} />
  </div>
);

ItinerarySummary.description = () =>
  "Displays itinerary summary row; itinerary's duration and walk distance";

ItinerarySummary.propTypes = {
  itinerary: PropTypes.object.isRequired,
  children: PropTypes.node.isRequired,
};

ItinerarySummary.displayName = 'ItinerarySummary';

export default ItinerarySummary;
