import L from 'leaflet';
import PropTypes from 'prop-types';
import React from 'react';

import PointFeatureMarker from './PointFeatureMarker';
import {
  isMultiPointTypeGeometry,
  isPointTypeGeometry,
} from '../../util/geo-utils';

import GeoJSONCluster from './GeoJSONCluster';
import MarkerClusterGroup from './MarkerClusterGroup';

/**
 * Extracts svg-formatted icon data from the given features' properties.
 *
 * @param {*[]} features the geojson features.
 */
const getIcons = features => {
  if (!Array.isArray(features) || features.length === 0) {
    return {};
  }

  const CustomIcon = L.Icon.extend({
    options: {
      iconSize: [30, 30],
      iconAnchor: [15, 15],
    },
  });

  return features
    .filter(
      feature =>
        feature.properties &&
        feature.properties.icon &&
        feature.properties.icon.id &&
        feature.properties.icon.svg,
    )
    .map(feature => feature.properties.icon)
    .reduce((icons, icon) => {
      /*
        For data URI SVG support in Firefox & IE it's necessary to URI encode the string
        & replace the '#' character with '%23'. `encodeURI()` won't do this.
      */
      const url = `data:image/svg+xml;charset=utf-8,${encodeURI(
        icon.svg,
      ).replace(/#/g, '%23')}`;
      icons[icon.id] = new CustomIcon({ iconUrl: url }); // eslint-disable-line no-param-reassign
      return icons;
    }, {});
};

/**
 * Generates a suitable leaflet marker with a tooltip and a popup attached (if applicable)
 * for the given feature.
 *
 * @param {*} feature the feature currently being manipulated.
 * @param {*} latlng the coordinates for the current feature.
 * @param {*} icons the custom icons collection, if available.
 */
const getMarker = (feature, latlng, icons = {}) => {
  const properties = feature.properties || {};
  const interactive = !!properties.popupContent;
  let marker;

  if (properties.icon) {
    marker = L.marker(latlng, {
      icon: icons[properties.icon.id],
      interactive,
    });
  } else if (properties.textOnly) {
    marker = L.circleMarker(latlng, {
      interactive,
    });
    marker.bindTooltip(properties.textOnly, {
      className: 'geoJsonText',
      direction: 'center',
      offset: [0, 0],
      permanent: true,
    });
  } else {
    marker = L.circleMarker(latlng, { interactive });
  }

  if (properties.popupContent) {
    marker.bindPopup(properties.popupContent, {
      className: 'geoJsonPopup',
    });
  }

  return marker;
};

class GeoJSON extends React.Component {
  static propTypes = {
    bounds: PropTypes.object,
    data: PropTypes.shape({
      features: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.string,
          geometry: PropTypes.shape({
            coordinates: PropTypes.array.isRequired,
            type: PropTypes.string.isRequired,
          }).isRequired,
          properties: PropTypes.object,
        }),
      ),
    }).isRequired,
    options: PropTypes.object.isRequired
  };

  static defaultProps = {
    bounds: undefined,
  };

  static contextTypes = { config: PropTypes.object.isRequired };

  // cache dynamic icons to allow references by id without data duplication
  componentWillMount() {
    const {
      data: { features },
    } = this.props;
    this.icons = getIcons(features);
  }

  // add some custom rendering control by feature props
  pointToLayer = (feature, latlng) => getMarker(feature, latlng, this.icons);

  styler = feature => {
    const { config } = this.context;
    const defaultLineStyle = {
      color: config.colors.primary,
      weight: 3,
      opacity: 0.8,
    };
    const defaultMarkerStyle = {
      color: config.colors.primary,
      fillColor: 'white',
      radius: 6,
      opacity: 1,
      fillOpacity: 1,
      weight: 2,
    };
    const textMarkerStyle = {
      color: config.colors.primary,
      radius: 0,
      opacity: 0,
      fillOpacity: 0,
      weight: 0,
    };

    const { geometry } = feature;
    if (isPointTypeGeometry(geometry) || isMultiPointTypeGeometry(geometry)) {
      if (feature.properties && feature.properties.textOnly) {
        return feature.style
          ? { ...textMarkerStyle, ...feature.style }
          : textMarkerStyle;
      }
      return feature.style
        ? { ...defaultMarkerStyle, ...feature.style }
        : defaultMarkerStyle;
    }
    return feature.style
      ? { ...defaultLineStyle, ...feature.style }
      : defaultLineStyle;
  };

  render() {
    const cluster = typeof this.props.options.cluster != "undefined" ? this.props.options.cluster : false;
    const maxClusterZoom = cluster ? false : 1;    
    const maxMarkers = typeof this.props.options.maxMarkers != "undefined" ? this.props.options.maxMarkers : false;
    const { bounds, data } = this.props;
    if (!data || !Array.isArray(data.features)) {
      return null;
    }

    const hasOnlyPointGeometries = data.features.every(feature =>
      isPointTypeGeometry(feature.geometry),
    );
    if (!hasOnlyPointGeometries) {
      return (
        <GeoJSONCluster
          data={this.props.data}
          style={this.styler}
          pointToLayer={this.pointToLayer}
          maxClusterZoom={maxClusterZoom}
        />
      );
    }

    return (
      <MarkerClusterGroup
        showCoverageOnHover={false}
        zoomToBoundsOnClick={false}
        spiderfyOnMaxZoom={false}
        disableClusteringAtZoom={maxClusterZoom || 17}
      >
        {data.features
          .filter(feature => {
            const [lon, lat] = feature.geometry.coordinates;
            if (bounds) {
              const latLng = L.latLng({ lat, lng: lon });
              if (!bounds.contains(latLng)) {
                return false;
              }
            }
            return true;
          })
          .map((feature, index) => {
            if(maxMarkers && index > maxMarkers) return;            
            
            return (
            <PointFeatureMarker
              feature={feature}
              icons={this.icons}
              key={feature.id}
            />
            )
          })}
      </MarkerClusterGroup>
    );
  }
}

export { GeoJSON as default, getIcons, getMarker };
