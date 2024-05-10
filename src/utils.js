// Constants
export const EARTH_RADIUS = 6378137; // Simplified Earth radius

/**
 * Calculates distance of two points on the surface.
 * Uses the Haversine formula to calculate the great-circle distance between two points.
 */
export function calculateDistance(lat1, lon1, lat2, lon2) {
  const rad = Math.PI / 180;
  lat1 *= rad; lat2 *= rad; lon1 *= rad; lon2 *= rad;
  const dLat = lat2 - lat1;
  const dLon = lon2 - lon1;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
  return 2 * EARTH_RADIUS * Math.asin(Math.sqrt(a));
}

/**
 * Calculates screen position from latitude and longitude.
 * Requires Cesium.js to be loaded in the environment.
 */
export function getXYForLatLng(app, lat, lng, opt_alt = 0) {
  const pos = Cesium.Cartographic.fromDegrees(lng, lat, opt_alt);
  const cartes3 = Cesium.Ellipsoid.WGS84.cartographicToCartesian(pos);
  const cartes4 = new Cesium.Cartesian4(cartes3.x, cartes3.y, cartes3.z, 1);
  const mvp = app.scene.context.uniformState.modelViewProjection;
  const proj = Cesium.Matrix4.multiplyByVector(mvp, cartes4, new Cesium.Cartesian4());

  if (!proj) return null;

  const w = 1 / proj.w;
  const x = (proj.x * w + 1) / 2;
  const y = 1 - ((proj.y * w) + 1) / 2;
  const visibility = calculateVisibility(x, y, cartes3, app.camera);

  return [x * app.canvas.width, y * app.canvas.height, visibility];
}

function calculateVisibility(x, y, cartes3, camera) {
  if (x < -0.1 || x > 1.1 || y < -0.1 || y > 1.1) {
    return 0;
  }
  const direction = Cesium.Cartesian3.subtract(cartes3, camera.position, new Cesium.Cartesian3());
  const distance = Cesium.Cartesian3.magnitude(direction);
  const dot = Cesium.Cartesian3.dot(camera.direction, direction);
  const cdot = Cesium.Cartesian3.dot(camera.position, camera.position);
  const val = dot * dot - cdot + EARTH_RADIUS * EARTH_RADIUS;

  if (val < 0) {
    return 0;
  }
  const sqrtVal = Math.sqrt(val);
  const d1 = Math.min(dot + sqrtVal, dot - sqrtVal);
  const d2 = Math.max(dot + sqrtVal, dot - sqrtVal);

  return Math.abs(distance - d1) < Math.abs(distance - d2) ? 1 : 0;
}

/**
 * Dynamically installs CSS styles to the document.
 */
export function installStyles(stylesString, opt_node = document) {
  const styleEl = document.createElement('style');
  styleEl.type = 'text/css';
  if (styleEl.styleSheet) {
    styleEl.styleSheet.cssText = stylesString;
  } else {
    styleEl.appendChild(document.createTextNode(stylesString));
  }
  const head = opt_node.head || opt_node.getElementsByTagName('head')[0];
  head.appendChild(styleEl);
  return styleEl;
}
