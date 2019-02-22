import React from 'react';
import RouteNumberContainer from './RouteNumberContainer';
import WalkDistance from './WalkDistance';
import Duration from './Duration';

const RecentSearchRow = ({search}, context) => {
  return (
    <tr
      className="next-departure-row-tr recent-search-row"
      onClick={() => console.log("go to search")}
      style={{ cursor: 'pointer' }}
    >
      <td className="td-origin td-destination">
        <span className="route-destination">
          <span className="destination">
            {search.from}
          </span>
        </span>
      </td>
      <td className="td-destination">
        <span className="route-destination">
          <span className="destination">
            {search.to}
          </span>
        </span>
      </td>
      <td className="td-route-number">
        <RouteNumberContainer
          route={search.via}
        />
      </td>
      <td className="td-duration">
        <Duration duration={search.duration} />
      </td>
      <td className="td-distance">
        {
          search.walkingDistance ?
            (<WalkDistance walkDistance={search.walkingDistance} />)
          :
            '-'
        }
      </td>
    </tr>
  );
}

export default RecentSearchRow