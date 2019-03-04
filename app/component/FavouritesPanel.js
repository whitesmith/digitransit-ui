import PropTypes from 'prop-types';
import React from 'react';
import Relay from 'react-relay/classic';
import connectToStores from 'fluxible-addons-react/connectToStores';
import shouldUpdate from 'recompose/shouldUpdate';

import FavouriteRouteListContainer from './FavouriteRouteListContainer';
import FavouriteLocationsContainer from './FavouriteLocationsContainer';
import NextDeparturesListHeader from './NextDeparturesListHeader';
import NoFavouritesPanel from './NoFavouritesPanel';
import Loading from './Loading';
import { dtLocationShape } from '../util/shapes';
import { TAB_FAVOURITES } from '../util/path';
import withBreakpoint from '../util/withBreakpoint';
import { isBrowser } from '../util/browser';
import { withAuthentication } from './session';

class FavouriteRouteListContainerRoute extends Relay.Route {
  static queries = {
    routes: (Component, variables) => Relay.QL`
      query {
        routes (ids:$ids) {
          ${Component.getFragment('routes', {
            ids: variables.ids,
          })}
    }}`,
  };

  static paramDefinitions = {
    ids: { required: true },
  };

  static routeName = 'FavouriteRouteRowRoute';
}

const FavouriteRoutes = ({ routes, origin }) => (
  <Relay.RootContainer
    Component={FavouriteRouteListContainer}
    forceFetch
    route={
      new FavouriteRouteListContainerRoute({
        ids: routes,
        origin,
      })
    }
    renderLoading={Loading}
  />
);

FavouriteRoutes.propTypes = {
  routes: PropTypes.array.isRequired,
  origin: dtLocationShape.isRequired,
};

class FavouritesPanel extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      favoriteStops: [],
      favoriteLocations: [],
      favoriteRoutes: [],
      loading: false,
    };
  }

  componentDidUpdate(prevProps) {
    const { firebase, authUser } = this.props;
    if (authUser !== prevProps.authUser && authUser) {
      this.setState({ loading: true });
      firebase.getUserFavorites().then(snap => {
        const results = [];
        snap.forEach(s => {
          results.unshift(s.val());
        });
        this.setState({
          favoriteStops: results.filter(f => f.type === 'stop'),
          favoriteLocations: results.filter(f => f.type === 'location'),
          favoriteRoutes: results.filter(f => f.type === 'route').map(f => f.id),
          loading: false
        });
      });
    }
  }

  render() {
    const { favoriteLocations, favoriteRoutes, loading } = this.state;

    const {
      authUser,
      origin,
      routes,
      currentTime,
      favouriteLocations,
      favouriteStops,
      breakpoint
    } = this.props;
    if (isBrowser) {
      let locationsToShow = [];
      let routesToShow = [];
      if (authUser) {
        locationsToShow = favoriteLocations;
        routesToShow = favoriteRoutes;
      } else {
        locationsToShow = [...favouriteLocations, ...favouriteStops];
        routesToShow = routes;
      }
      return (
        <div className="frontpage-panel">
          <FavouriteLocationsContainer
            origin={origin}
            currentTime={currentTime}
            favourites={locationsToShow}
          />
          <div
            className={`nearby-table-container ${breakpoint !== 'large' &&
              `mobile`}`}
          >
            {routesToShow.length > 0 ? (
              <table className="nearby-departures-table">
                <thead>
                  <NextDeparturesListHeader />
                </thead>
                <tbody>
                  <FavouriteRoutes routes={routesToShow} origin={origin} />
                </tbody>
              </table>
            ) : (
                <NoFavouritesPanel />
              )}
          </div>
        </div>
      );
    }
    return null;
  }
}

FavouritesPanel.propTypes = {
  routes: PropTypes.array.isRequired,
  origin: dtLocationShape.isRequired, // eslint-disable-line react/no-typos
  currentTime: PropTypes.number.isRequired,
  favouriteLocations: PropTypes.array,
  favouriteStops: PropTypes.array,
  breakpoint: PropTypes.string.isRequired,
  firebase: PropTypes.object,
  authUser: PropTypes.object,
};

const FilteredFavouritesPanel = shouldUpdate(
  (props, nextProps) =>
    nextProps.currentTime !== props.currentTime ||
    nextProps.routes !== props.routes ||
    nextProps.favouriteLocations !== props.favouriteLocations ||
    nextProps.favouriteStops !== props.favouriteStops ||
    nextProps.origin.gps !== props.origin.gps ||
    (!nextProps.origin.gps &&
      (nextProps.origin.lat !== props.origin.lat ||
        nextProps.origin.lon !== props.origin.lon)),
)(withAuthentication(withBreakpoint(FavouritesPanel)));

export default connectToStores(
  ctx => (
    React.createElement(FilteredFavouritesPanel, { ...ctx, tab: TAB_FAVOURITES })
  ),
  [
    'FavouriteRoutesStore',
    'TimeStore',
    'FavouriteLocationStore',
    'FavouriteStopsStore',
  ],
  context => ({
    routes: context.getStore('FavouriteRoutesStore').getRoutes(),
    currentTime: context
      .getStore('TimeStore')
      .getCurrentTime()
      .unix(),
    favouriteLocations: context
      .getStore('FavouriteLocationStore')
      .getLocations(),
    favouriteStops: context.getStore('FavouriteStopsStore').getStops(),
  }),
);
