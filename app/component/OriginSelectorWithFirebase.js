import PropTypes from 'prop-types';
import React from 'react';
import { routerShape } from 'react-router';
import { dtLocationShape } from '../util/shapes';
import { navigateTo, TAB_NEARBY } from '../util/path';
import { isBrowser } from '../util/browser';
import OriginSelectorRow from './OriginSelectorRow';
import { suggestionToLocation, getIcon } from '../util/suggestionUtils';
import GeopositionSelector from './GeopositionSelector';
import { filterFavouriteHelper, isGeocodingResult } from './OriginSelector';

class OriginSelectorWithFirebase extends React.Component {
  constructor(props) {
    super(props);
    this.state = { names: [] };
  }

  componentDidMount() {
    const { firebase } = this.props;
    const { config } = this.context;

    Promise.all([
      firebase.getUserLocations(),
      firebase.getUserFavorites(),
    ]).then(result => {
      const oldSearches = [];
      const favouriteLocations = [];
      const favouriteStops = [];

      result[1].forEach(s => {
        const f = s.val();
        if (f.type === 'location') {
          favouriteLocations.push(f);
        } else if (f.type === 'stop') {
          favouriteStops.push(f);
        }
      });

      result[0].forEach(s => {
        let val = s.val();
        if(Object.keys(val).length === 1) {
          val = val[Object.keys(val)[0]];
        }
        oldSearches.push[val];
      });

      const favouriteLocationRows = favouriteLocations.map(f => (
        <OriginSelectorRow
          key={`fl-${f.locationName}`}
          icon={getIcon('favourite')}
          onClick={() => {
            this.setOrigin({ ...f, address: f.locationName });
          }}
          label={f.locationName}
        />
      ));

      const favouriteStopRows = favouriteStops.map(f => (
        <OriginSelectorRow
          key={`fs-${f.locationName}`}
          icon={getIcon('favourite')}
          onClick={() => {
            this.setOrigin({ ...f, address: f.locationName });
          }}
          label={f.locationName}
        />
      ));

      const notInFavouriteLocations = item =>
        favouriteLocations.filter(favourite =>
          filterFavouriteHelper(item, favourite)
        ).length === 0;

      const notInFavouriteStops = item =>
        favouriteStops.filter(favourite =>
          filterFavouriteHelper(item, favourite)
        ).length === 0;

      const oldSearchRows = oldSearches
        .filter(isGeocodingResult)
        .filter(notInFavouriteLocations)
        .filter(notInFavouriteStops)
        .map(s => (
          <OriginSelectorRow
            key={`o-${s.properties.label || s.properties.name}`}
            icon={getIcon(s.properties.layer)}
            label={s.properties.label || s.properties.name}
            onClick={() => {
              this.setOrigin(suggestionToLocation(s));
            }}
          />
        ));

      const defaultOriginRows = config.defaultOrigins.map(o => (
        <OriginSelectorRow
          key={`o-${o.label}`}
          icon={o.icon}
          label={o.label}
          onClick={() => {
            this.setOrigin({ ...o, address: o.label });
          }}
        />
      ));

      this.setState({
        names: [
          ...favouriteLocationRows,
          ...favouriteStopRows,
          ...oldSearchRows,
          ...defaultOriginRows,
        ],
      });
    });
  }

  setOrigin = newOrigin => {
    const { destination, tab } = this.props;
    const { router } = this.context;
    navigateTo({
      origin: { ...newOrigin, ready: true },
      destination,
      context: '/',
      router,
      base: {},
      tab,
    });
  };

  render() {
    const { destination, origin, tab } = this.props;

    const names = !isBrowser ? [] : this.state.names;

    return (
      <ul>
        <GeopositionSelector
          destination={destination}
          origin={origin}
          tab={tab}
        />
        {names.slice(0, 3)}
      </ul>
    );
  }
}

OriginSelectorWithFirebase.propTypes = {
  destination: dtLocationShape.isRequired,
  origin: dtLocationShape.isRequired,
  tab: PropTypes.string,
  firebase: PropTypes.object,
};

OriginSelectorWithFirebase.defaultProps = {
  tab: TAB_NEARBY,
};

OriginSelectorWithFirebase.contextTypes = {
  config: PropTypes.object.isRequired,
  router: routerShape.isRequired,
};

export default OriginSelectorWithFirebase;
