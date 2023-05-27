//Thomas Catonet
//VERSION 1.0

import Map from 'ol/Map';
import Feature from 'ol/Feature';

export type TVectorLayerProps = {};

export type TVectorLayerComponentProps = TVectorLayerProps & {
  map: Map;
  features?: Feature[];
};
