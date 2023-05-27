//Thomas Catonet
//VERSION 2.0

import React from 'react';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import Style from 'ol/style/Style';
import Fill from 'ol/style/Fill';
import Stroke from 'ol/style/Stroke';
import { MapContext } from '../../map';
import { IMapContext } from '../../map-types';
import { TVectorLayerProps, TVectorLayerComponentProps } from './vector-types';
import GeoJSON from 'ol/format/GeoJSON';
import { Select } from 'ol/interaction';
import '../../../../../style/pageProjectLogic.css';

const selectedStyle = new Style({
  fill: new Fill({
    color: 'rgba(255, 255, 255, 0.6)'
  }),
  stroke: new Stroke({
    color: 'rgba(255, 255, 255, 0.7)',
    width: 2
  })
});

const select = new Select({
  style: function (feature) {
    const color = feature.get('COLOR_BIO') || '#eeeeee';
    selectedStyle.getFill().setColor(color);
    return selectedStyle;
  }
});

const selectedFeatures = select.getFeatures();

class VectorLayerComponent extends React.PureComponent<TVectorLayerComponentProps> {
  layer: any;
  source: VectorSource;

  componentDidMount() {
    let token = localStorage.getItem('auth_token') || '';
    let project = localStorage.getItem('currentProject') || '';

    //Charge le geoJson de l'api
    this.source = new VectorSource({
      url: 'http://0.0.0.0:5001/project?token=' + token + '&project_name=' + project,
      format: new GeoJSON()
    });

    //Défini une couleur par défault
    const style = new Style({
      fill: new Fill({
        color: '#eeeeee'
      })
    });

    //Définie la couleur d'affichage de chaque commune
    this.layer = new VectorLayer({
      source: this.source,
      style: function (feature) {
        const color = feature.get('generalColor');
        style.getFill().setColor(color);
        return style;
      }
    });

    this.props.map.addLayer(this.layer);
    this.props.map.addInteraction(select);
  }

  render() {
    return <></>;
  }
}

export const VectorLayerWithContext = (props: TVectorLayerProps) => {
  return (
    <MapContext.Consumer>
      {(mapContext: IMapContext | void) => {
        if (mapContext) {
          console.log(mapContext);
          return <VectorLayerComponent {...props} map={mapContext.map} />;
        }
      }}
    </MapContext.Consumer>
  );
};

export function InfosCommune() {
  const [communeName, setCommuneName] = React.useState('?');
  const [communeRadon, setCommuneRadon] = React.useState('?');
  const [communeFlood, setCommuneFlood] = React.useState('?');
  const [communEarthquake, setCommuneEarthquake] = React.useState('?');
  const [communeRadonColor, setCommuneRadonColor] = React.useState('');
  const [communeFloodColor, setCommuneFloodColor] = React.useState('');
  const [communEarthquakeColor, setCommuneEarthquakeColor] = React.useState('');

  selectedFeatures.on(['add', 'remove'], function () {
    const names = selectedFeatures.getArray().map(function (feature) {
      return feature.get('libgeo');
    });

    const radon = selectedFeatures.getArray().map(function (feature) {
      return feature.get('radonValue');
    });

    const flood = selectedFeatures.getArray().map(function (feature) {
      return feature.get('floodValue');
    });

    const earthquake = selectedFeatures.getArray().map(function (feature) {
      return feature.get('earthquakeValue');
    });

    const radonColor = selectedFeatures.getArray().map(function (feature) {
      return feature.get('radonColor');
    });

    const floodColor = selectedFeatures.getArray().map(function (feature) {
      return feature.get('floodColor');
    });

    const earthquakeColor = selectedFeatures.getArray().map(function (feature) {
      return feature.get('earthquakeColor');
    });

    if (names.length > 0) {
      setCommuneName(names.join(', '));
      setCommuneRadon(radon.join(', '));
      setCommuneFlood(flood.join(', '));
      setCommuneEarthquake(earthquake.join(', '));
      setCommuneRadonColor(radonColor.join(', '));
      setCommuneFloodColor(floodColor.join(', '));
      setCommuneEarthquakeColor(earthquakeColor.join(', '));
    } else {
      setCommuneName('?');
      setCommuneRadon('?');
      setCommuneFlood('?');
      setCommuneEarthquake('?');
    }
  });

  return (
    <>
      <div className="geoInfoBar">
        <div className="contentGeoInfoBar">
          <h1 className="titleGeoInfoBar">Selected regions: {communeName}</h1>

          <div className="contentGeoData">
            <div className="dataField" style={{ backgroundColor: communeRadonColor }}>
              RADON: <span>{communeRadon}</span>
            </div>

            <div className="dataField" style={{ backgroundColor: communeFloodColor }}>
              FLOOD: <span>{communeFlood}</span>
            </div>

            <div className="dataField" style={{ backgroundColor: communEarthquakeColor }}>
              EARTHQUAKE: <span>{communEarthquake}</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
