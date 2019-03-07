import PropTypes from 'prop-types';
import React from 'react';
import { FormattedMessage } from 'react-intl';
import CO2Emissions from './CO2Emissions';
import WalkCalories from './WalkCalories';

const RouteInformation = ({itinerary}, context) => {
  const { config } = context;
  
  if(config.showExtraCalculations) {
    
    if(!itinerary.calories || !itinerary.co2) return null;
    
    return (
      <div className="itinerary-route-information row">
        {
          itinerary.calories > 0 && (
            <div className="columns">
              <p className="itinerary-route-value">
                <WalkCalories walkCalories={itinerary.calories} />
              </p>
              <small>
                <FormattedMessage
                  id="trip-calories"
                  defaultMessage="Calories burned on the journey"
                />
              </small>
            </div>
          )
        }
        {
          itinerary.co2 > 0 && (
            <div className="columns">
              <p className="itinerary-route-value">
                <CO2Emissions co2Emissions={itinerary.co2} />
              </p>
              <small>
                <FormattedMessage
                  id="trip-co2-emissions"
                  defaultMessage="CO2 emissions of the journey"
                />
              </small>
            </div>
          )
        }
      </div>
    )
  }

  return (
  <div className="itinerary-route-information row">
    <div className="columns">
      <FormattedMessage
        id="weather-at-destination"
        defaultMessage="Weather at the destination"
      />
    </div>
    <div className="columns">
      <FormattedMessage
        id="trip-co2-emissions"
        defaultMessage="CO2 emissions of the journey"
      />
    </div>
  </div>
  )
};

RouteInformation.propTypes = {
  itinerary: PropTypes.object,
};

RouteInformation.contextTypes = {
  config: PropTypes.object,
};

export default RouteInformation;
