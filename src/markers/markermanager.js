class MarkerManager {
  constructor(app, element) {
    this.app = app;
    this.element = element;
    this.markers = new Map();
  }

  addMarker(key, marker) {
    const actualKey = key || Math.random().toString(36).substring(2, 15);
    marker.attach(this.element);
    this.markers.set(actualKey, marker);
    return actualKey;
  }

  getMarker(key) {
    return this.markers.get(key);
  }

  removeMarker(key) {
    const marker = this.markers.get(key);
    if (marker) {
      marker.detach();
      this.markers.delete(key);
    }
    return marker;
  }

  removeMarkerEx(marker) {
    for (let [key, value] of this.markers.entries()) {
      if (value === marker) {
        this.removeMarker(key);
        break;
      }
    }
  }

  updateMarkers() {
    this.markers.forEach(marker => {
      this.updateMarker(marker);
    });
  }

  updateMarker(marker) {
    if (marker.isEnabled()) {
      const pos = this.app.getXYForLatLng(marker.lat, marker.lon);
      if (pos) {
        marker.setXY(pos[0], pos[1]);
        marker.show(pos[2] > 0);
      } else {
        marker.show(false);
      }
    }
  }

  forEach(callback) {
    this.markers.forEach(callback);
  }
}
