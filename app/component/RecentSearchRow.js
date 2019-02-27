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
      onClick={() => router.replace(search.routerLocation)}
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
        {
          Array.isArray(search.via) ?
            search.via.map( (v, i) => {
              return <RouteNumberContainer route={v} key={i} />
            })
          :
            <RouteNumberContainer route={search.via} />
        }
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
