import PropTypes from 'prop-types';
import React from 'react';
import connectToStores from 'fluxible-addons-react/connectToStores';
import onlyUpdateForKeys from 'recompose/onlyUpdateForKeys';
import getContext from 'recompose/getContext';
import LazilyLoad, { importLazy } from '../LazilyLoad';
import ComponentUsageExample from '../ComponentUsageExample';
import MapContainer from './MapContainer';
import ToggleMapTracking from '../ToggleMapTracking';
import { dtLocationShape } from '../../util/shapes';
import { isBrowser } from '../../util/browser';
import MapLayerStore, { mapLayerShape } from '../../store/MapLayerStore';
import PositionStore from '../../store/PositionStore';
import GeoJsonStore from '../../store/GeoJsonStore';

const DEFAULT_ZOOM = 12;
const FOCUS_ZOOM = 16;

const onlyUpdateCoordChanges = onlyUpdateForKeys([
  'lat',
  'lon',
  'zoom',
  'mapTracking',
  'showStops',
  'showScaleBar',
  'origin',
  'children',
]);

const locationMarkerModules = {
  LocationMarker: () =>
    importLazy(import(/* webpackChunkName: "map" */ './LocationMarker')),
};

const jsonModules = {
  GeoJSON: () => importLazy(import(/* webpackChunkName: "map" */ './GeoJSON')),
};

const Component = onlyUpdateCoordChanges(MapContainer);

class MapWithTrackingStateHandler extends React.Component {
  static propTypes = {
    getGeoJsonConfig: PropTypes.func.isRequired,
    getGeoJsonData: PropTypes.func.isRequired,
    origin: dtLocationShape.isRequired,
    position: PropTypes.shape({
      hasLocation: PropTypes.bool.isRequired,
      isLocationingInProgress: PropTypes.bool.isRequired,
      lat: PropTypes.number.isRequired,
      lon: PropTypes.number.isRequired,
    }).isRequired,
    config: PropTypes.shape({
      defaultMapCenter: dtLocationShape,
      defaultEndpoint: dtLocationShape.isRequired,
    }).isRequired,
    children: PropTypes.array,
    renderCustomButtons: PropTypes.func,
    mapLayers: mapLayerShape.isRequired,
  };

  static defaultProps = {
    renderCustomButtons: undefined,
  };

  constructor(props) {
    super(props);
    const hasOriginorPosition =
      props.origin.ready || props.position.hasLocation;
    this.state = {
      geoJson: {},
      initialZoom: hasOriginorPosition ? FOCUS_ZOOM : DEFAULT_ZOOM,
      zoom: hasOriginorPosition ? FOCUS_ZOOM : DEFAULT_ZOOM,
      mapTracking: props.origin.gps && props.position.hasLocation,
      focusOnOrigin: props.origin.ready,
      origin: props.origin,
      shouldShowDefaultLocation: !hasOriginorPosition,
    };
  }

  async componentDidMount() {
    const { config, getGeoJsonData, getGeoJsonConfig } = this.props;
    if (
      !isBrowser ||
      !config.geoJson ||
      (!Array.isArray(config.geoJson.layers) && !config.geoJson.layerConfigUrl)
    ) {
      return;
    }

    const layers = config.geoJson.layerConfigUrl
      ? await getGeoJsonConfig(config.geoJson.layerConfigUrl)
      : config.geoJson.layers;
    if (!Array.isArray(layers) || layers.length === 0) {
      return;
    }

    const json = await Promise.all(
      layers.map(async ({ url, name, metadata, options = {} }) => ({
        url,
        data: await getGeoJsonData(url, name, metadata),
        options: options
      })),
    );
    if (this.isCancelled) {
      return;
    }
    const { geoJson } = this.state;
    json.forEach(({ url, data, options }) => {
      geoJson[url] = data;
      geoJson[url].options = options;
    });
    this.setState(geoJson);
  }

  componentWillReceiveProps(newProps) {
    if (
      // "current position selected"
      newProps.origin.lat != null &&
      newProps.origin.lon != null &&
      newProps.origin.gps === true &&
      ((this.state.origin.ready === false && newProps.origin.ready === true) ||
        !this.state.origin.gps) // current position selected
    ) {
      this.usePosition(newProps.origin);
    } else if (
      // "poi selected"
      !newProps.origin.gps &&
      (newProps.origin.lat !== this.state.origin.lat ||
        newProps.origin.lon !== this.state.origin.lon) &&
      newProps.origin.lat != null &&
      newProps.origin.lon != null
    ) {
      this.useOrigin(newProps.origin);
    }
  }

  componentWillUnmount() {
    this.isCancelled = true;
  }

  updateCurrentBounds = () => {
    if (!this.mapElement || !this.mapElement.leafletElement) {
      return;
    }
    const newBounds = this.mapElement.leafletElement.getBounds();
    const { bounds, zoom } = this.state;
    let updateBounds = true, updateZoom = true;
    if (bounds && bounds.equals(newBounds)) {
      updateBounds = false;
    }
    const newZoom = this.mapElement.leafletElement.getZoom()
    if (zoom && zoom == newZoom) {
      updateZoom = false;
    }

    if(updateBounds && updateZoom) {
      this.setState({
        bounds: newBounds,
        zoom: newZoom,
      });
      return;
    }
    if(updateBounds) {
      this.setState({
        bounds: newBounds,
      });
      return;
    }
    if(updateZoom) {
      this.setState({
        zoom: newZoom,
      });
      return;
    }
    
  };

  setMapElementRef = element => {
    if (element && this.mapElement !== element) {
      this.mapElement = element;
    }
  };

  enableMapTracking = () => {
    this.setState({
      mapTracking: true,
      focusOnOrigin: false,
    });
  };

  disableMapTracking = () => {
    this.setState({
      mapTracking: false,
      focusOnOrigin: false,
    });
  };

  usePosition(origin) {
    this.setState(prevState => ({
      origin,
      mapTracking: true,
      focusOnOrigin: false,
      initialZoom:
        prevState.initialZoom === DEFAULT_ZOOM ? FOCUS_ZOOM : undefined,
      shouldShowDefaultLocation: false,
    }));
  }

  useOrigin(origin) {
    this.setState(prevState => ({
      origin,
      mapTracking: false,
      focusOnOrigin: true,
      initialZoom:
        prevState.initialZoom === DEFAULT_ZOOM ? FOCUS_ZOOM : undefined,
      shouldShowDefaultLocation: false,
    }));
  }

  render() {
    const {
      position,
      origin,
      config,
      children,
      renderCustomButtons,
      mapLayers,
      ...rest
    } = this.props;
    const { geoJson } = this.state;

    let location;
    if (
      this.state.focusOnOrigin &&
      !this.state.origin.gps &&
      this.state.origin.lat != null &&
      this.state.origin.lon != null
    ) {
      location = this.state.origin;
    } else if (this.state.mapTracking && position.hasLocation) {
      location = position;
    } else if (this.state.shouldShowDefaultLocation) {
      location = config.defaultMapCenter || config.defaultEndpoint;
    }

    const leafletObjs = [];

    if (origin && origin.ready === true && origin.gps !== true) {
      leafletObjs.push(
        <LazilyLoad modules={locationMarkerModules} key="from">
          {({ LocationMarker }) => (
            <LocationMarker position={origin} type="from" />
          )}
        </LazilyLoad>,
      );
    }

    if (geoJson) {
      const { bounds, zoom } = this.state;
      Object.keys(geoJson)
        .filter(key => mapLayers.geoJson[key] !== false)
        .forEach(key => {
          const options = geoJson[key].options;

          const minZoom = options.minZoom;
          if(typeof minZoom != "undefined" && zoom < minZoom) return;

          const maxZoom = options.maxZoom;
          if(typeof maxZoom != "undefined" && zoom > maxZoom) return;

          leafletObjs.push(
            <LazilyLoad modules={jsonModules} key={key}>
              {({ GeoJSON }) => (
                <GeoJSON bounds={bounds} data={geoJson[key].data} options={geoJson[key].options} />
              )}
            </LazilyLoad>,
          );
        });
    }

    return (
      <Component
        lat={location ? location.lat : null}
        lon={location ? location.lon : null}
        zoom={this.state.initialZoom}
        mapTracking={this.state.mapTracking}
        className="flex-grow"
        origin={origin}
        leafletEvents={{
          onDragstart: this.disableMapTracking,
          onDragend: this.updateCurrentBounds,
          onZoomend: this.updateCurrentBounds,
        }}
        disableMapTracking={this.disableMapTracking}
        {...rest}
        leafletObjs={leafletObjs}
        mapRef={this.setMapElementRef}
      >
        {children}
        <div className="map-with-tracking-buttons">
          {renderCustomButtons && renderCustomButtons()}
          {position.hasLocation && (
            <ToggleMapTracking
              key="toggleMapTracking"
              handleClick={
                this.state.mapTracking
                  ? this.disableMapTracking
                  : this.enableMapTracking
              }
              className={`icon-mapMarker-toggle-positioning-${
                this.state.mapTracking ? 'online' : 'offline'
              }`}
            />
          )}
        </div>
      </Component>
    );
  }
}

// todo convert to use origin prop
const MapWithTracking = connectToStores(
  getContext({
    config: PropTypes.shape({
      defaultMapCenter: dtLocationShape,
    }),
  })(MapWithTrackingStateHandler),
  [PositionStore, MapLayerStore, GeoJsonStore],
  ({ getStore }) => {
    const position = getStore(PositionStore).getLocationState();
    const mapLayers = getStore(MapLayerStore).getMapLayers();
    const { getGeoJsonConfig, getGeoJsonData } = getStore(GeoJsonStore);
    return { position, mapLayers, getGeoJsonConfig, getGeoJsonData };
  },
);

MapWithTracking.description = (
  <div>
    <p>Renders a map with map-tracking functionality</p>
    <ComponentUsageExample description="">
      <MapWithTracking />
    </ComponentUsageExample>
  </div>
);

export { MapWithTracking as default, MapWithTrackingStateHandler as Component };
