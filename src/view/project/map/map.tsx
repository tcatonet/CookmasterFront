//Thomas Catonet
//VERSION 1.0

import React from 'react';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import XYZ from 'ol/source/XYZ';
import { VectorLayer, InfosCommune } from './layers';
import { TMapProps, IMapContext, TMapState } from './map-types';
import 'ol/ol.css';
import '../../../style/map.css';
import { fromLonLat } from 'ol/proj';

export const MapContext = React.createContext<IMapContext | void>(undefined);

export class MapComponent extends React.PureComponent<TMapProps, TMapState> {
  private mapDivRef: React.RefObject<HTMLDivElement>;
  showLoader: boolean;
  state: TMapState = {};

  constructor(props: TMapProps) {
    super(props);
    this.mapDivRef = React.createRef<HTMLDivElement>();
    this.showLoader = true;
    localStorage.setItem('dataIsRecieved', 'true');
  }

  componentDidMount() {
    if (!this.mapDivRef.current) {
      return;
    }
    const map = new Map({
      target: this.mapDivRef.current,
      layers: [
        new TileLayer({
          source: new XYZ({
            url: 'https://{a-c}.tile.openstreetmap.org/{z}/{x}/{y}.png'
          })
        })
      ],
      //Initialise la zone visible de la map et le zoom
      view: new View({
        center: fromLonLat([2.3429151, 48.8627511]),
        zoom: 6,
        maxZoom: 10,
        constrainOnlyCenter: true
      })
    });

    const mapContext: IMapContext = { map };
    this.setState({
      mapContext: mapContext
    });
    console.log(mapContext);

    map.on('loadstart', function () {
      map.getTargetElement().classList.add('spinner');
    });
    map.on('loadend', function () {
      map.getTargetElement().classList.remove('spinner');
    });
  }

  render() {
    return (
      <>
        <div className="map" ref={this.mapDivRef}>
          {this.state.mapContext && (
            <MapContext.Provider value={this.state.mapContext}>
              <VectorLayer />
            </MapContext.Provider>
          )}
        </div>
        <InfosCommune />
      </>
    );
  }
}
