/* eslint-disable no-underscore-dangle */
import L from 'leaflet';
import React from 'react';
import GeoJSONCluster from '../../../../app/component/map/GeoJSONCluster';

import GeoJSON, {
  getIcons,
  getMarker,
} from '../../../../app/component/map/GeoJSON';
import { shallowWithIntl } from '../../helpers/mock-intl-enzyme';
import PointFeatureMarker from '../../../../app/component/map/PointFeatureMarker';

describe('<GeoJSON />', () => {
  it('should render empty if there are no features', () => {
    const props = {
      data: {},
      options: {}
    };
    const wrapper = shallowWithIntl(<GeoJSON {...props} />, {
      context: { config: {} },
    });
    expect(wrapper.isEmptyRender()).to.equal(true);
  });

  it('should use the react-leaflet geojson component when geometry type !== Point', () => {
    const props = {
      data: {
        features: [
          {
            geometry: {
              coordinates: [60, 25],
              type: 'MultiPoint',
            },
          },
        ],
      },
      options: {}
    };
    const wrapper = shallowWithIntl(<GeoJSON {...props} />, {
      context: { config: {} },
    });
    expect(wrapper.find(GeoJSONCluster)).to.have.lengthOf(1);
  });

  it('should use native react-leaflet components when geometry type === Point', () => {
    const props = {
      data: {
        features: [
          {
            id: '1',
            geometry: {
              coordinates: [60, 25],
              type: 'Point',
            },
          },
        ],
      },
      options: {}
    };
    const wrapper = shallowWithIntl(<GeoJSON {...props} />, {
      context: { config: {} },
    });
    expect(wrapper.find(PointFeatureMarker)).to.have.lengthOf(1);
  });

  describe('getIcons', () => {
    it('should return an empty object if no features exist', () => {
      expect(getIcons(undefined)).to.deep.equal({});
      expect(getIcons([])).to.deep.equal({});
    });

    it('should generate svg-encoded icons', () => {
      const features = [
        {
          properties: {
            icon: {
              id: 'test',
              svg: '#<foobar>#',
            },
          },
        },
      ];

      const icons = getIcons(features);
      expect(icons.test.options.iconUrl).to.equal(
        'data:image/svg+xml;charset=utf-8,%23%3Cfoobar%3E%23',
      );
    });
  });

  describe('getMarker', () => {
    it('should use a custom marker for icons', () => {
      const feature = {
        properties: {
          icon: {
            id: 'test',
          },
        },
      };
      const latLng = L.latLng({
        lat: 60.45065,
        lng: 22.267,
      });
      const icons = {
        test: 'foobar',
      };

      const marker = getMarker(feature, latLng, icons);
      expect(marker.options.icon).to.equal(icons.test);
      expect(marker.options.interactive).to.equal(false);
      expect(marker._radius).equal(undefined);
    });

    it('should use a circleMarker by default', () => {
      const feature = {};
      const latLng = L.latLng({
        lat: 60.45065,
        lng: 22.267,
      });

      const marker = getMarker(feature, latLng);
      expect(marker.options.interactive).to.equal(false);
      expect(marker._radius).to.not.equal(undefined);
    });

    it('should use a circleMarker and a tooltip for textOnly', () => {
      const feature = {
        properties: {
          textOnly: 'Test',
        },
      };
      const latLng = L.latLng({
        lat: 60.45065,
        lng: 22.267,
      });

      const marker = getMarker(feature, latLng);
      expect(marker.options.interactive).to.equal(false);
      expect(marker._radius).to.not.equal(undefined);
      expect(marker._tooltip._content).to.equal(feature.properties.textOnly);
    });

    it('should bind popup content and mark the marker as interactive', () => {
      const feature = {
        properties: {
          popupContent: '<div>Test</div>',
        },
      };

      const marker = getMarker(feature);
      expect(marker.options.interactive).to.equal(true);
      expect(marker._popup._content).to.equal(feature.properties.popupContent);
    });
  });
});
