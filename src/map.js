class Map {
  constructor(layer) {
    if (!layer || !layer.imageryProvider) {
      throw new Error("Layer must be a valid Cesium.ImageryLayer with an imageryProvider.");
    }
    this.layer = layer;
    this.app = null; // This should be set if the app context is necessary for operations
  }

  setBoundingBox(minLat, maxLat, minLon, maxLon) {
    const toRadians = angle => (angle * Math.PI) / 180;
    const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

    const extent = this.layer.imageryProvider.rectangle;
    extent.west = toRadians(minLon);
    extent.south = toRadians(clamp(minLat, -85.051, 85.051));
    extent.east = toRadians(maxLon);
    extent.north = toRadians(clamp(maxLat, -85.051, 85.051));

    if (this.app) {
      this.app.sceneChanged = true;
    }
  }

  setOpacity(opacity) {
    this.layer.alpha = opacity;
    if (this.app) {
      this.app.sceneChanged = true;
    }
  }

  getOpacity() {
    return this.layer.alpha;
  }
}

export default Map;
