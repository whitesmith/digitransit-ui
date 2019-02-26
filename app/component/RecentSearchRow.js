import React from 'react';
import PropTypes from 'prop-types';
import { routerShape } from 'react-router';
import RouteNumberContainer from './RouteNumberContainer';
import WalkDistance from './WalkDistance';
import Duration from './Duration';
import { PREFIX_ITINERARY_SUMMARY, navigateTo } from '../util/path';

const RecentSearchRow = ({ search }, { router }) => {
  return (
    <tr
      className="next-departure-row-tr recent-search-row"
      onClick={() => {
        const { legs } = search;
        const firstLeg = legs[0];
        const lastLeg = legs[legs.length - 1];
        const origin = {
          address: firstLeg.from.name,
          lat: firstLeg.from.lat,
          lon: firstLeg.from.lon,
          ready: true,
        };
        const destination = {
          address: lastLeg.to.name,
          lat: lastLeg.to.lat,
          lon: lastLeg.to.lon,
          ready: true,
        };

        navigateTo({
          origin,
          destination,
          context: '/',
          router,
          base: {},
        });
      }}
      style={{ cursor: 'pointer' }}
    >
      <td className="td-origin td-destination">
        <span className="route-destination">
          <span className="destination">{search.from}</span>
        </span>
      </td>
      <td className="td-destination">
        <span className="route-destination">
          <span className="destination">{search.to}</span>
        </span>
      </td>
      <td className="td-route-number">
        <RouteNumberContainer route={search.via} />
      </td>
      <td className="td-duration">
        <Duration duration={search.duration} />
      </td>
      <td className="td-distance">
        {search.walkDistance ? (
          <WalkDistance walkDistance={search.walkDistance} />
        ) : (
          '-'
        )}
      </td>
    </tr>
  );
};

RecentSearchRow.propTypes = {
  search: PropTypes.object.isRequired,
};

RecentSearchRow.contextTypes = {
  router: routerShape.isRequired,
};

export default RecentSearchRow;
