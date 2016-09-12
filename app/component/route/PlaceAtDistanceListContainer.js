import React from 'react';
import Relay from 'react-relay';
import Link from 'react-router/lib/Link';
import { intlShape } from 'react-intl';

import Distance from '../departure/Distance';
import RouteNumber from '../departure/RouteNumber';
import RouteDestination from '../departure/RouteDestination';
import DepartureTime from '../departure/DepartureTime';
import Icon from '../icon/icon';
import config from '../../config';
import ComponentUsageExample from '../documentation/ComponentUsageExample';

const departureRowContainerFragment = () => Relay.QL`
  fragment on DepartureRow {
    pattern {
      alerts {
        effectiveStartDate
        effectiveEndDate
        trip {
          gtfsId
        }
      }
      route {
        gtfsId
        shortName
        longName
        mode
        color
      }
      code
      headsign
    }
    stoptimes (startTime:$currentTime, timeRange:$timeRange, numberOfDepartures:2) {
      realtimeState
      realtimeDeparture
      scheduledDeparture
      realtimeArrival
      scheduledArrival
      realtime
      serviceDay
      stop {
        code
        platformCode
      }
      trip {
        gtfsId
      }
    }
  }
`;

const DepartureRow = (props) => {
  const departure = props.departure;
  let departureTimes;
  if (departure.stoptimes) {
    departureTimes = departure.stoptimes.map((departureTime) => {
      const canceled = departureTime.realtimeState === 'CANCELED';
      const key = `${departure.pattern.route.gtfsId}:${departure.pattern.headsign}:
        ${departureTime.realtimeDeparture}`;

      return (
        <DepartureTime
          key={key}
          departureTime={departureTime.serviceDay + departureTime.realtimeDeparture}
          realtime={departureTime.realtime}
          currentTime={props.currentTime}
          canceled={canceled}
        />
      );
    });
  }

  // TODO implement disruption checking

  return (
    <div className="next-departure-row">
      <Link to={`/linjat/${departure.pattern.code}`} key={departure.pattern.code}>
        <Distance distance={props.distance} />
        <RouteNumber
          mode={departure.pattern.route.mode}
          text={departure.pattern.route.shortName}
          hasDisruption={departure.hasDisruption}
        />
        <RouteDestination
          mode={departure.pattern.route.mode}
          destination={departure.pattern.headsign || departure.pattern.route.longName}
        />
        {departureTimes}
      </Link>
    </div>
  );
};

DepartureRow.displayName = 'DepartureRow';

DepartureRow.propTypes = {
  departure: React.PropTypes.object.isRequired,
  distance: React.PropTypes.number.isRequired,
  currentTime: React.PropTypes.number.isRequired,
};

const exampleDeparture1 = {
  pattern: {
    code: '28',
    headSign: 'Tampere',
    route: {
      gtfsId: '123',
      mode: 'RAIL',
      shortName: 'IC28',
    },
  },
  stoptimes: [
    {
      realtimeDeparture: 6900,
      realtime: true,
      serviceDay: 1473670000,
    },
    {
      realtimeDeparture: 8000,
      realtime: false,
      serviceDay: 1473670000,
    },
  ],
};

const exampleDeparture2 = {
  pattern: {
    code: '154',
    headSign: 'Kamppi',
    route: {
      gtfsId: '123',
      mode: 'BUS',
      shortName: '154',
    },
  },
  stoptimes: [
    {
      realtimeDeparture: 7396,
      realtime: true,
      serviceDay: 1473670000,
      realtimeState: 'CANCELED',
    },
    {
      realtimeDeparture: 9000,
      realtime: false,
      serviceDay: 1473670000,
    },
  ],
};

DepartureRow.description = (
  <div>
    <ComponentUsageExample description="example">
      <DepartureRow
        departure={exampleDeparture1}
        distance={123}
        currentTime={1473676196}
      />
    </ComponentUsageExample>
    <ComponentUsageExample description="with cancellation">
      <DepartureRow
        departure={exampleDeparture2}
        distance={123}
        currentTime={1473676196}
      />
    </ComponentUsageExample>
  </div>
);

export { DepartureRow };

const DepartureRowContainer = Relay.createContainer(DepartureRow, {
  fragments: {
    departure: departureRowContainerFragment,
  },

  initialVariables: {
    currentTime: 0,
    timeRange: config.nearbyRoutes.timeRange || 7200,
  },
});

const bicycleRentalRowContainerFragment = () => Relay.QL`
  fragment on BikeRentalStation {
    name
    stationId
    bikesAvailable
    spacesAvailable
  }
`;

const BicycleRentalStationRow = (props, context) => {
  let availabilityIcon = null;

  if (props.station.bikesAvailable === 0 && props.station.spacesAvailable === 0) {
    availabilityIcon = (<Icon img="icon-icon_not-in-use" />);
  } else if (props.station.bikesAvailable > config.cityBike.fewAvailableCount) {
    availabilityIcon = (<Icon img="icon-icon_good-availability" />);
  } else if (props.station.bikesAvailable > 0) {
    availabilityIcon = (<Icon img="icon-icon_poor-availability" />);
  } else {
    availabilityIcon = (<Icon img="icon-icon_no-availability" />);
  }

  // TODO implement disruption checking

  return (
    <div className="next-departure-row bicycle-rental-station-row">
      <Distance distance={props.distance} />
      <div className="bicycle-rental-station">
        <RouteNumber
          mode="citybike"
          text={props.station.stationId}
          hasDisruption={false}
        />
        <span className="city-bike-station-name">{props.station.name}</span>
        <span className="city-bike-station-availability">
          <span className="bikes-label">
            {context.intl.formatMessage({ id: 'bike-availability-short', defaultMessage: 'Bikes' })}
          </span>
          <span className="bikes-available">{props.station.bikesAvailable}</span>
          /
          {props.station.bikesAvailable + props.station.spacesAvailable}
          {availabilityIcon}
        </span>
      </div>
    </div>
  );
};

BicycleRentalStationRow.propTypes = {
  station: React.PropTypes.object.isRequired,
  distance: React.PropTypes.number.isRequired,
};

BicycleRentalStationRow.contextTypes = {
  intl: intlShape.isRequired,
};

BicycleRentalStationRow.displayName = 'BicycleRentalStationRow';

const exampleStation1 = {
  stationId: 'A27',
  name: 'Mannerheimintie',
  bikesAvailable: 12,
  spacesAvailable: 16,
};

const exampleStation2 = {
  stationId: 'A27',
  name: 'Mannerheimintie',
  bikesAvailable: 2,
  spacesAvailable: 16,
};

const exampleStation3 = {
  stationId: 'A27',
  name: 'Mannerheimintie',
  bikesAvailable: 0,
  spacesAvailable: 16,
};

BicycleRentalStationRow.description = (
  <div>
    <ComponentUsageExample description="plenty of bikes available">
      <BicycleRentalStationRow
        station={exampleStation1}
        distance={256}
        currentTime={1473676196}
      />
    </ComponentUsageExample>
    <ComponentUsageExample description="few bikes available">
      <BicycleRentalStationRow
        station={exampleStation2}
        distance={256}
        currentTime={1473676196}
      />
    </ComponentUsageExample>
    <ComponentUsageExample description="no bikes available">
      <BicycleRentalStationRow
        station={exampleStation3}
        distance={256}
        currentTime={1473676196}
      />
      </ComponentUsageExample>
    </div>
);

export { BicycleRentalStationRow };

const BicycleRentalStationRowContainer = Relay.createContainer(BicycleRentalStationRow, {
  fragments: {
    station: bicycleRentalRowContainerFragment,
  },

  initialVariables: {
    currentTime: 0,
  },
});


const carParkRowContainerFragment = () => Relay.QL`
  fragment on CarPark {
    name
  }
`;

const CarParkRow = (props) => (<div>{props.station.name}</div>);

CarParkRow.propTypes = {
  station: React.PropTypes.object.isRequired,
  distance: React.PropTypes.number.isRequired,
};

const CarParkRowContainer = Relay.createContainer(CarParkRow, {
  fragments: {
    station: carParkRowContainerFragment,
  },

  initialVariables: {
    currentTime: 0,
  },
});


const bikeParkRowContainerFragment = () => Relay.QL`
  fragment on BikePark {
    name
  }
`;

const BikeParkRow = (props) => (<div>{props.station.name}</div>);

BikeParkRow.propTypes = {
  station: React.PropTypes.object.isRequired,
  distance: React.PropTypes.number.isRequired,
};

const BikeParkRowContainer = Relay.createContainer(BikeParkRow, {
  fragments: {
    station: bikeParkRowContainerFragment,
  },

  initialVariables: {
    currentTime: 0,
  },
});

const placeAtDistanceFragment = variables => Relay.QL`
  fragment on placeAtDistance {
    distance
    place {
      id
      __typename
      ${DepartureRowContainer.getFragment('departure', { currentTime: variables.currentTime })}
      ${BicycleRentalStationRowContainer.getFragment('station', {
        currentTime: variables.currentTime })}
      ${BikeParkRowContainer.getFragment('station', { currentTime: variables.currentTime })}
      ${CarParkRowContainer.getFragment('station', { currentTime: variables.currentTime })}
    }
  }
`;

/* eslint-disable no-underscore-dangle */
const PlaceAtDistance = (props) => {
  let place;
  if (props.placeAtDistance.place.__typename === 'DepartureRow') {
    place = (
      <DepartureRowContainer
        distance={props.placeAtDistance.distance}
        departure={props.placeAtDistance.place}
        currentTime={props.currentTime}
      />
    );
  } else if (props.placeAtDistance.place.__typename === 'BikeRentalStation') {
    place = (
      <BicycleRentalStationRowContainer
        distance={props.placeAtDistance.distance}
        station={props.placeAtDistance.place}
        currentTime={props.currentTime}
      />
    );
  } else if (props.placeAtDistance.place.__typename === 'BikePark') {
    place = (
      <BikeParkRowContainer
        distance={props.placeAtDistance.distance}
        station={props.placeAtDistance.place}
        currentTime={props.currentTime}
      />
    );
  } else if (props.placeAtDistance.place.__typename === 'CarPark') {
    place = (
      <CarParkRowContainer
        distance={props.placeAtDistance.distance}
        station={props.placeAtDistance.place}
        currentTime={props.currentTime}
      />
    );
  }
  return (
    <div className="padding-vertical-normal border-bottom">
      {place}
    </div>
  );
};
/* eslint-enable no-underscore-dangle */

PlaceAtDistance.propTypes = {
  placeAtDistance: React.PropTypes.object.isRequired,
  currentTime: React.PropTypes.number.isRequired,
};

const PlaceAtDistanceContainer = Relay.createContainer(PlaceAtDistance, {
  fragments: {
    placeAtDistance: placeAtDistanceFragment,
  },

  initialVariables: {
    currentTime: 0,
  },
});

export const placeAtDistanceListContainerFragment = variables => Relay.QL`
  fragment on placeAtDistanceConnection {
    edges {
      node {
        place {
          id
          __typename
          ... on DepartureRow {
            stoptimes (startTime:$currentTime, timeRange:$timeRange, numberOfDepartures:2) {
              realtimeState
            }
          }
        }
        ${PlaceAtDistanceContainer.getFragment('placeAtDistance', {
          currentTime: variables.currentTime })},
      }
    }
  }
`;

/* eslint-disable no-underscore-dangle */
const PlaceAtDistanceList = (props) => {
  let rows = [];
  if (props.places && props.places.edges) {
    props.places.edges.forEach((edge) => {
      const node = edge.node;
      const hasDepartures = node.place.__typename !== 'DepartureRow' ||
        (node.place.stoptimes && node.place.stoptimes.length > 0);
      if (hasDepartures) {
        rows.push(
          <PlaceAtDistanceContainer
            key={node.place.id}
            currentTime={props.currentTime}
            placeAtDistance={node}
          />
        );
      }
    });
  }
  return (<div>{rows}</div>);
};
/* eslint-enable no-underscore-dangle */

PlaceAtDistanceList.propTypes = {
  places: React.PropTypes.object.isRequired,
  currentTime: React.PropTypes.number.isRequired,
};

export default Relay.createContainer(PlaceAtDistanceList, {
  fragments: {
    places: placeAtDistanceListContainerFragment,
  },

  initialVariables: {
    currentTime: 0,
    timeRange: config.nearbyRoutes.timeRange || 7200,
  },
});
