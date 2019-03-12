import PropTypes from 'prop-types';
import React from 'react';
import L from 'leaflet';
import GeoJSONCluster from './GeoJSONCluster';
import GeoJsonPopup from './popups/GeoJsonPopup';

const GeoJsonIcon = L.Icon.extend({
  options: {
    iconSize: [30, 30],
    iconAnchor: [15, 15],
  },
});

class GeoJSON extends React.Component {
  static propTypes = { 
    data: PropTypes.object.isRequired,
    options: PropTypes.object.isRequired
  };

  static contextTypes = { config: PropTypes.object.isRequired };

  // cache dynamic icons to allow references by id without data duplication
  componentWillMount() {
    // cache dynamic icons in advance to allow references by id without data duplication
    const icons = {};

    this.props.data.features.forEach(feature => {
      const p = feature.properties;

      if(p && p.icon) {
        let svgSource = p.icon.data || p.icon.svg;

        if (p.icon.id && svgSource) {
          /*
            For data URI SVG support in Firefox & IE it's necessary to URI encode the string
            & replace the '#' character with '%23'. `encodeURI()` won't do this.
          */
          const url = `data:image/svg+xml;charset=utf-8,${encodeURI(
            svgSource,
          ).replace(/#/g, '%23')}`;
          icons[p.icon.id] = new GeoJsonIcon({ iconUrl: url });
        }
      }
    });
    this.icons = icons;
  }

  pointToLayer = (feature, latlng) => {
    // add some custom rendering control by feature props
    const props = feature.properties || {};
    let marker;

    if (props.textOnly) {
      marker = L.circleMarker(latlng, {
        interactive: false,
      });
      marker.bindTooltip(props.name, {
        className: 'geoJsonText',
        direction: 'center',
        offset: [0, 0],
        permanent: true,
      });
    } else if (props.icon) {
      marker = L.marker(latlng, {
        icon: this.icons[props.icon.id],
        interactive: (props.popupContent != null),
      });
    } else {
      marker = L.circleMarker(latlng, { interactive: (props.popupContent != null) });
    }
    if (props.popupContent) {
      marker.bindPopup(GeoJsonPopup({
        name: props.name,
        icon: props.icon.id,
        content: props.popupContent
      }), { className: 'geoJsonPopup' });
    }
    return marker;
  };

  styler = feature => {
    const defaultLineStyle = {
      color: this.context.config.colors.primary,
      weight: 3,
      opacity: 0.8,
    };
    const defaultMarkerStyle = {
      color: this.context.config.colors.primary,
      fillColor: 'white',
      radius: 6,
      opacity: 1,
      fillOpacity: 1,
      weight: 2,
    };
    const textMarkerStyle = {
      color: this.context.config.colors.primary,
      radius: 0,
      opacity: 0,
      fillOpacity: 0,
      weight: 0,
    };

    if (
      feature.geometry &&
      ['Point', 'MultiPoint'].includes(feature.geometry.type)
    ) {
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

    return (
      <GeoJSONCluster
        data={this.props.data}
        style={this.styler}
        pointToLayer={this.pointToLayer}
        maxClusterZoom={maxClusterZoom}
      />
    );
  }
}

export default GeoJSON;
