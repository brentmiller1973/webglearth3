class WebGLEarth {
  constructor(id, options = {}) {
    this.app = new weapi.exports.App(id, { ...options, empty: true });
    if (options.zoom) {
      this.app.setZoom(options.zoom);
    }
  }

  setView(center, zoom) {
    if (!Array.isArray(center)) center = [center.lat, center.lng];
    this.app.setPosition(center[0], center[1], zoom, undefined, 0, 0);
  }

  zoomIn(delta = 1) {
    this.app.setZoom(this.app.getZoom() + delta);
  }

  zoomOut(delta = 1) {
    this.app.setZoom(this.app.getZoom() - delta);
  }

  panInsideBounds(bounds, options = {}) {
    const [minLat, maxLat, minLon, maxLon] = this.normalizeBounds(bounds);
    this.app.flyToFitBounds(minLat, maxLat, minLon, maxLon, options.heading, options.tilt, options.duration);
  }

  fitBounds(bounds, options = {}) {
    const [minLat, maxLat, minLon, maxLon] = this.normalizeBounds(bounds);
    const altitude = this.app.camera.calcDistanceToViewBounds(minLat, maxLat, minLon, maxLon);
    const centerLat = (minLat + maxLat) / 2;
    const centerLon = (minLon + maxLon) / 2;

    this.app.setPosition(
        centerLat, centerLon, undefined, altitude, options.heading, options.tilt,
        options.heading !== undefined || options.tilt !== undefined
    );
  }

  panTo(center, options = {}) {
    if (!Array.isArray(center)) center = [center.lat, center.lng];
    this.app.flyTo(center[0], center[1], undefined, undefined, 0, 0, undefined, options.duration);
  }

  static tileLayer(url, options = {}) {
    const subdomains = options.subdomains || 'abc';
    url = url.replace('{s}', '{sub}');
    return new TileLayer(url, { ...options, subdomains });
  }

  normalizeBounds(bounds) {
    if (!Array.isArray(bounds)) {
      bounds = [bounds.getSouth(), bounds.getNorth(), bounds.getWest(), bounds.getEast()];
    }
    if (Array.isArray(bounds[0])) {
      bounds = [bounds[0][0], bounds[1][0], bounds[0][1], bounds[1][1]];
    }
    return bounds.map(coord => Math.toRadians(coord));
  }
}

class TileLayer {
  constructor(url, options = {}) {
    this.url = this.processUrl(url, options);
    this.options = options;
  }

  processUrl(url, options) {
    Object.keys(options).forEach(key => {
      url = url.replace(`{${key}}`, options[key]);
    });
    return url;
  }
}

// Example of adding a method to extend functionality
WebGLEarth.prototype.addTo = function(app) {
  app.setBaseMap(this);
};

// Example of usage
// const earth = new WebGLEarth('earth_div', { zoom: 4 });
// earth.setView({ lat: 50.083, lng: 14.416 }, 8);
