import { GeoJSON as LeafletGeoJSON } from 'leaflet';
import { withLeaflet } from 'react-leaflet/es/context';
import Path from 'react-leaflet/es/Path';
import L from 'leaflet';
require('leaflet.markercluster');

class GeoJSONCluster extends Path {
  createLeafletElement(props) {
    let clusterGroup = new L.markerClusterGroup({
      showCoverageOnHover: false,
      zoomToBoundsOnClick: false,
      spiderfyOnMaxZoom: false,
      disableClusteringAtZoom: props.maxClusterZoom || 17
    });
    const geoJsonLayer = new LeafletGeoJSON(props.data, this.getOptions(props));
    clusterGroup.addLayer(geoJsonLayer);
    return clusterGroup;
  }

  updateLeafletElement(fromProps, toProps) {
    if (typeof toProps.style === 'function') {
      this.setStyle(toProps.style)
    } else {
      this.setStyleIfChanged(fromProps, toProps)
    }
  }
}

export default withLeaflet(GeoJSONCluster)