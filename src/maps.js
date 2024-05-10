// Import necessary components or classes
import { Map } from './Map';
import { CustomMap } from './CustomMap';
import { OpenStreetMapImageryProvider, BingMapsImageryProvider, WebMapServiceImageryProvider } from 'cesium';

/**
 * Constants for map names.
 */
export const MapType = {
  OSM: 'osm',
  BING: 'bing',
  WMS: 'wms',
  CUSTOM: 'custom'
};

/**
 * Map to hold initialized maps.
 */
const mapMap = new Map();

/**
 * Initializes a map based on the provided type and options.
 */
export function initMap(app, type, opt_opts = {}) {
  let key = `${type}${opt_opts.name || opt_opts.url || ''}`;

  const secure = document.location.protocol === 'https:';
  const protocol = secure ? 'https:' : 'http:';
  let tileProvider;

  switch (type) {
    case MapType.OSM:
      tileProvider = new OpenStreetMapImageryProvider({
        url: opt_opts.url || `${protocol}//a.tile.openstreetmap.org`
      });
      break;
    case MapType.BING:
      tileProvider = new BingMapsImageryProvider({
        url: `${protocol}//dev.virtualearth.net`,
        mapStyle: opt_opts.mapStyle,
        key: opt_opts.key
      });
      break;
    case MapType.WMS:
      tileProvider = new WebMapServiceImageryProvider({
        url: opt_opts.url,
        layers: opt_opts.layers,
        parameters: opt_opts.parameters
      });
      break;
    case MapType.CUSTOM:
      tileProvider = new CustomMap({
        url: opt_opts.url,
        maximumLevel: opt_opts.maximumLevel,
        tileSize: opt_opts.tileSize,
        flipY: opt_opts.flipY
      });
      break;
    default:
      throw new Error(`Unknown MapType '${type}'!`);
  }

  const map = new Map(tileProvider);
  mapMap.set(key, map);
  return map;
}

/**
 * Retrieves a map from the map storage.
 */
export function getMap(type, opt_subtype = '') {
  return mapMap.get(`${type}${opt_subtype}`);
}

/**
 * Initializes default maps that do not require special parameters.
 */
export function initStatics(app) {
  initMap(app, MapType.OSM);
}
