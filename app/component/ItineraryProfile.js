import cx from 'classnames';
import ceil from 'lodash/ceil';
import PropTypes from 'prop-types';
import React from 'react';
import { intlShape } from 'react-intl';

import { displayDistance } from '../util/geo-utils';
import { getTotalDistance, getTotalWalkingDistance, getTotalWalkingCalories, containsBiking } from '../util/legUtils';
import WalkCalories from './WalkCalories';

const ItineraryProfile = ({ itinerary, small }, { config, intl }) => {
  const { elevationGained, elevationLost } = itinerary;
  return (
    <div className={cx('itinerary-profile-container', { small })}>
      {containsBiking(itinerary) &&
        Number.isFinite(elevationGained) &&
        Number.isFinite(elevationLost) && (
          <React.Fragment>
            <div className="itinerary-profile-item">
              <div className="itinerary-profile-item-title">
                {`${intl.formatMessage({
                  id: 'elevation-gained-total',
                  defaultMessage: 'Elevation gained',
                })}:`}
              </div>
              <div className="itinerary-profile-item-value">
                {`${ceil(elevationGained, 0)} m`}
              </div>
            </div>
            <div className="itinerary-profile-item">
              <div className="itinerary-profile-item-title">
                {`${intl.formatMessage({
                  id: 'elevation-lost-total',
                  defaultMessage: 'Elevation lost',
                })}:`}
              </div>
              <div className="itinerary-profile-item-value">
                {`${ceil(elevationLost, 0)} m`}
              </div>
            </div>
          </React.Fragment>
        )}
      <div className="itinerary-profile-item">
        <div className="itinerary-profile-item-title">
          {`${intl.formatMessage({
            id: 'distance-total',
            defaultMessage: 'Distance',
          })}:`}
        </div>
        <div className="itinerary-profile-item-value">
          {displayDistance(getTotalDistance(itinerary), config)}
        </div>
      </div>
      {config.showExtraCalculations && !small && (
        <div className="itinerary-profile-item padding-vertical-normal">
          <div className="itinerary-profile-item-title">
            {`${intl.formatMessage({
              id: 'itinerary-walk.title',
              defaultMessage: 'Total walking distance',
            })}:`}
          </div>
          <div className="itinerary-profile-item-value">
            {displayDistance(getTotalWalkingDistance(itinerary), config)}
            <WalkCalories walkCalories={getTotalWalkingCalories(itinerary)} />
          </div>
        </div>
      )}
    </div>
  );
};

ItineraryProfile.propTypes = {
  itinerary: PropTypes.shape({
    elevationGained: PropTypes.number,
    elevationLost: PropTypes.number,
    legs: PropTypes.arrayOf(
      PropTypes.shape({
        distance: PropTypes.number,
      }),
    ).isRequired,
  }).isRequired,
  small: PropTypes.bool,
};

ItineraryProfile.defaultProps = {
  small: false,
};

ItineraryProfile.contextTypes = {
  config: PropTypes.object.isRequired,
  intl: intlShape.isRequired,
};

export default ItineraryProfile;
