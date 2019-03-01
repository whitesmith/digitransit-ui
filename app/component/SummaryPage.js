import PropTypes from 'prop-types';
/* eslint-disable react/no-array-index-key */
import React from 'react';
import Relay from 'react-relay/classic';
import moment from 'moment';
import get from 'lodash/get';
import sortBy from 'lodash/sortBy';
import some from 'lodash/some';
import polyline from 'polyline-encoded';
import { FormattedMessage } from 'react-intl';
import { routerShape } from 'react-router';
import isEqual from 'lodash/isEqual';
import { dtLocationShape } from '../util/shapes';
import storeOrigin from '../action/originActions';
import DesktopView from './DesktopView';
import MobileView from './MobileView';
import MapContainer from './map/MapContainer';
import ItineraryTab from './ItineraryTab';
import PrintableItinerary from './PrintableItinerary';
import SummaryPlanContainer from './SummaryPlanContainer';
import SummaryNavigation from './SummaryNavigation';
import ItineraryLine from './map/ItineraryLine';
import LocationMarker from './map/LocationMarker';
import MobileItineraryWrapper from './MobileItineraryWrapper';
import Loading from './Loading';
import { getHomeUrl } from '../util/path';
import { defaultRoutingSettings } from '../util/planParamUtil';
import { getIntermediatePlaces } from '../util/queryUtils';
import { validateServiceTimeRange } from '../util/timeUtils';
import withBreakpoint from '../util/withBreakpoint';
import { withAuthentication } from './session';
import { addExtraCalcsToItinerary } from '../util/legUtils';

export const ITINERARYFILTERING_DEFAULT = 1.5;

function getActiveIndex(state) {
  return (state && state.summaryPageSelected) || 0;
}

class SummaryPage extends React.Component {
  static contextTypes = {
    queryAggregator: PropTypes.shape({
      readyState: PropTypes.shape({
        done: PropTypes.bool.isRequired,
        error: PropTypes.string,
      }).isRequired,
    }).isRequired,
    router: routerShape.isRequired,
    location: PropTypes.object.isRequired,
    config: PropTypes.object,
    executeAction: PropTypes.func.isRequired,
    headers: PropTypes.object.isRequired,
  };

  static propTypes = {
    printPage: PropTypes.object,
    location: PropTypes.shape({
      state: PropTypes.object,
    }).isRequired,
    params: PropTypes.shape({
      hash: PropTypes.string,
    }).isRequired,
    plan: PropTypes.shape({
      plan: PropTypes.shape({
        itineraries: PropTypes.array,
      }).isRequired,
    }).isRequired,
    serviceTimeRange: PropTypes.shape({
      start: PropTypes.number.isRequired,
      end: PropTypes.number.isRequired,
    }).isRequired,
    content: PropTypes.node,
    map: PropTypes.shape({
      type: PropTypes.func.isRequired,
    }),
    from: dtLocationShape.isRequired,
    to: dtLocationShape.isRequired,
    routes: PropTypes.arrayOf(
      PropTypes.shape({
        fullscreenMap: PropTypes.bool,
        printPage: PropTypes.object,
      }).isRequired,
    ).isRequired,
    breakpoint: PropTypes.string.isRequired,
  };

  static defaultProps = {
    map: undefined,
  };

  constructor(props, context) {
    super(props, context);
    context.executeAction(storeOrigin, props.from);
  }

  lastFirstSearchId = null;

  state = { center: null, loading: false };

  componentDidMount() {
    const host =
      this.context.headers &&
      (this.context.headers['x-forwarded-host'] || this.context.headers.host);

    if (
      get(this.context, 'config.showHSLTracking', false) &&
      host &&
      host.indexOf('127.0.0.1') === -1 &&
      host.indexOf('localhost') === -1
    ) {
      import('../util/feedbackly');
    }
  }

  componentWillReceiveProps(nextProps) {
    if (!isEqual(nextProps.from, this.props.from)) {
      this.context.executeAction(storeOrigin, nextProps.from);
    }

    if (nextProps.breakpoint === 'large' && this.state.center) {
      this.setState({ center: null });
    }
  }

  setLoading = loading => {
    this.setState({ loading });
  };

  setError = error => {
    this.context.queryAggregator.readyState.error = error;
  };

  updateCenter = (lat, lon) => {
    this.setState({ center: { lat, lon } });
  };

  renderMap() {
    const {
      plan: { plan },
      location: { state, query },
      from,
      to,
    } = this.props;
    const {
      config: { defaultEndpoint },
    } = this.context;
    const activeIndex = getActiveIndex(state);
    const itineraries = (plan && plan.itineraries) || [];

    const leafletObjs = sortBy(
      itineraries.map((itinerary, i) => (
        <ItineraryLine
          key={i}
          hash={i}
          legs={itinerary.legs}
          passive={i !== activeIndex}
          showIntermediateStops={i === activeIndex}
        />
      )),
      // Make sure active line isn't rendered over
      i => i.props.passive === false,
    );

    if (from.lat && from.lon) {
      leafletObjs.push(
        <LocationMarker
          className="from"
          key="fromMarker"
          position={from}
          type="from"
        />,
      );
    }

    if (to.lat && to.lon) {
      leafletObjs.push(
        <LocationMarker
          className="to"
          key="toMarker"
          position={to}
          type="to"
        />,
      );
    }

    getIntermediatePlaces(query).forEach((location, i) => {
      leafletObjs.push(
        <LocationMarker className="via" key={`via_${i}`} position={location} />,
      );
    });

    // Decode all legs of all itineraries into latlong arrays,
    // and concatenate into one big latlong array
    const bounds = []
      .concat(
        [[from.lat, from.lon], [to.lat, to.lon]],
        ...itineraries.map(itinerary =>
          [].concat(
            ...itinerary.legs.map(leg =>
              polyline.decode(leg.legGeometry.points),
            ),
          ),
        ),
      )
      .filter(a => a[0] && a[1]);

    const centerPoint = {
      lat: from.lat || to.lat || defaultEndpoint.lat,
      lon: from.lon || to.lon || defaultEndpoint.lon,
    };
    const delta = 0.0269; // this is roughly equal to 3 km
    const defaultBounds = [
      [centerPoint.lat - delta, centerPoint.lon - delta],
      [centerPoint.lat + delta, centerPoint.lon + delta],
    ];
    return (
      <MapContainer
        className="summary-map"
        leafletObjs={leafletObjs}
        fitBounds
        bounds={bounds.length > 1 ? bounds : defaultBounds}
        showScaleBar
      />
    );
  }

  render() {
    const {
      queryAggregator: {
        readyState: { done, error },
      },
    } = this.context;

    const { firebase, authUser } = this.props;

    const hasItineraries =
      this.props.plan &&
      this.props.plan.plan &&
      Array.isArray(this.props.plan.plan.itineraries);
    let itineraries = hasItineraries ? this.props.plan.plan.itineraries : [];

    // Remove old itineraries if new query cannot find a route
    if (error && hasItineraries) {
      itineraries = [];
    }

    if (
      this.props.routes[this.props.routes.length - 1].printPage &&
      hasItineraries
    ) {
      return React.cloneElement(this.props.content, {
        itinerary: itineraries[this.props.params.hash],
        focus: this.updateCenter,
      });
    }

    // Call props.map directly in order to render to same map instance
    const map = this.props.map
      ? this.props.map.type(
          {
            itinerary: itineraries && itineraries[this.props.params.hash],
            center: this.state.center,
            ...this.props,
          },
          this.context,
        )
      : this.renderMap();

    let earliestStartTime;
    let latestArrivalTime;

    if (hasItineraries) {
      earliestStartTime = Math.min(...itineraries.map(i => i.startTime));
      latestArrivalTime = Math.max(...itineraries.map(i => i.endTime));

      const itinerary = itineraries[0];
      const searchId = itinerary.__dataID__;

      // is the user is logged and this search id was not yet stored, push search to firebase
      if (this.lastFirstSearchId !== searchId && authUser) {
        this.lastFirstSearchId = searchId;

        addExtraCalcsToItinerary(itinerary);

        let routerLocation = null;
        const { from, to, router } = this.props;
        if (router.location) {
          const { pathname, search } = router.location;
          routerLocation = {
            pathname,
            search,
          };
        }

        const searchToSave = {
          searchId,
          itinerary,
          from,
          to,
          routerLocation,
        };

        firebase.addUserSearch(searchToSave);
      }

    }

    const serviceTimeRange = validateServiceTimeRange(
      this.props.serviceTimeRange,
    );
    if (this.props.breakpoint === 'large') {
      let content;
      if (this.state.loading === false && (done || error !== null)) {
        content = (
          <SummaryPlanContainer
            plan={this.props.plan.plan}
            serviceTimeRange={serviceTimeRange}
            itineraries={itineraries}
            params={this.props.params}
            error={error}
            setLoading={this.setLoading}
            setError={this.setError}
          >
            {this.props.content &&
              React.cloneElement(this.props.content, {
                itinerary:
                  hasItineraries && itineraries[this.props.params.hash],
                focus: this.updateCenter,
              })}
          </SummaryPlanContainer>
        );
      } else {
        content = (
          <div style={{ position: 'relative', height: 200 }}>
            <Loading />
          </div>
        );
      }

      return (
        <DesktopView
          title={
            <FormattedMessage
              id="summary-page.title"
              defaultMessage="Itinerary suggestions"
            />
          }
          homeUrl={getHomeUrl(this.props.from, this.props.to)}
          header={
            <SummaryNavigation
              params={this.props.params}
              serviceTimeRange={serviceTimeRange}
              startTime={earliestStartTime}
              endTime={latestArrivalTime}
            />
          }
          content={content}
          map={map}
          scrollable
        />
      );
    }

    let content;

    if ((!done && !error) || this.state.loading !== false) {
      content = (
        <div style={{ position: 'relative', height: 200 }}>
          <Loading />
        </div>
      );
    } else if (this.props.params.hash) {
      content = (
        <MobileItineraryWrapper
          itineraries={itineraries}
          params={this.props.params}
          fullscreenMap={some(
            this.props.routes.map(route => route.fullscreenMap),
          )}
          focus={this.updateCenter}
        >
          {this.props.content &&
            itineraries.map((itinerary, i) =>
              React.cloneElement(this.props.content, { key: i, itinerary }),
            )}
        </MobileItineraryWrapper>
      );
    } else {
      content = (
        <SummaryPlanContainer
          plan={this.props.plan.plan}
          serviceTimeRange={serviceTimeRange}
          itineraries={itineraries}
          params={this.props.params}
          error={error}
          setLoading={this.setLoading}
          setError={this.setError}
        />
      );
    }

    return (
      <MobileView
        header={
          !this.props.params.hash ? (
            <SummaryNavigation
              params={this.props.params}
              serviceTimeRange={serviceTimeRange}
              startTime={earliestStartTime}
              endTime={latestArrivalTime}
            />
          ) : (
            false
          )
        }
        homeUrl={getHomeUrl(this.props.from, this.props.to)}
        content={content}
        map={map}
      />
    );
  }
}

export default Relay.createContainer(withAuthentication(withBreakpoint(SummaryPage)), {
  fragments: {
    plan: () => Relay.QL`
      fragment on QueryType {
        plan(
          fromPlace: $fromPlace,
          toPlace: $toPlace,
          intermediatePlaces: $intermediatePlaces,
          numItineraries: $numItineraries,
          modes: $modes,
          date: $date,
          time: $time,
          walkReluctance: $walkReluctance,
          walkBoardCost: $walkBoardCost,
          minTransferTime: $minTransferTime,
          walkSpeed: $walkSpeed,
          maxWalkDistance: $maxWalkDistance,
          wheelchair: $wheelchair,
          ticketTypes: $ticketTypes,
          disableRemainingWeightHeuristic: $disableRemainingWeightHeuristic,
          arriveBy: $arriveBy,
          transferPenalty: $transferPenalty,
          ignoreRealtimeUpdates: $ignoreRealtimeUpdates,
          maxPreTransitTime: $maxPreTransitTime,
          walkOnStreetReluctance: $walkOnStreetReluctance,
          waitReluctance: $waitReluctance,
          bikeSpeed: $bikeSpeed,
          bikeSwitchTime: $bikeSwitchTime,
          bikeSwitchCost: $bikeSwitchCost,
          bikeBoardCost: $bikeBoardCost,
          optimize: $optimize,
          triangle: $triangle,
          carParkCarLegWeight: $carParkCarLegWeight,
          maxTransfers: $maxTransfers,
          waitAtBeginningFactor: $waitAtBeginningFactor,
          heuristicStepsPerMainStep: $heuristicStepsPerMainStep,
          compactLegsByReversedSearch: $compactLegsByReversedSearch,
          itineraryFiltering: $itineraryFiltering,
          modeWeight: $modeWeight
          preferred: $preferred,
          unpreferred: $unpreferred),
        {
          ${SummaryPlanContainer.getFragment('plan')}
          ${ItineraryTab.getFragment('searchTime')}
          itineraries {
            startTime
            endTime
            walkDistance
            ${ItineraryTab.getFragment('itinerary')}
            ${PrintableItinerary.getFragment('itinerary')}
            ${SummaryPlanContainer.getFragment('itineraries')}
            legs {
              ${ItineraryLine.getFragment('legs')}
              transitLeg
              mode
              distance
              duration
              legGeometry {
                points
              }
              route {
                mode
                shortName
                color
              }
            }
          }
        }
      }
    `,
    serviceTimeRange: () => Relay.QL`
      fragment on serviceTimeRange {
        start
        end
      }
    `,
  },
  initialVariables: {
    ...{
      from: null,
      to: null,
      fromPlace: null,
      toPlace: null,
      intermediatePlaces: null,
      numItineraries:
        typeof matchMedia !== 'undefined' &&
        matchMedia('(min-width: 900px)').matches
          ? 5
          : 3,
      date: moment().format('YYYY-MM-DD'),
      time: moment().format('HH:mm:ss'),
      arriveBy: false,
      disableRemainingWeightHeuristic: false,
      transferPenalty: null,
      modes: null,
      maxWalkDistance: 0,
      preferred: null,
      unpreferred: null,
      ticketTypes: null,
      itineraryFiltering: ITINERARYFILTERING_DEFAULT,
      minTransferTime: null,
      walkBoardCost: null,
      walkReluctance: null,
      walkSpeed: null,
      wheelchair: null,
    },
    ...defaultRoutingSettings,
  },
});
