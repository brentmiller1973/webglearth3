class EditablePolygon {
  constructor(app, markerManager) {
    if (!app || !markerManager) {
      throw new Error("App and MarkerManager must be provided");
    }

    this.app = app;
    this.markerManager = markerManager;
    this.polygon = new Polygon(); // Assume Polygon is already modernized
    this.app.addPrimitive(this.polygon.primitive);
    this.app.addPrimitive(this.polygon.primitiveLineCol);
    this.app.sceneChanged = true;

    this.draggers = {};
    this.midMap = {};
    this.midDraggers = {};
    this.clickListenKey = null;

    // Assuming PolyIcon is already modernized
    this.icon = new PolyIcon(0, 0, this.app);
    this.onChangeCallback = () => {};
    this.lastClickToAdd = 0;
  }

  destroy() {
    this.disableClickToAdd();
    this.app.removePrimitive(this.polygon.primitive);
    this.app.removePrimitive(this.polygon.primitiveLineCol);
    this.app.sceneChanged = true;
    this.onChangeCallback = () => {};
    this.icon.destroy();
    Object.values(this.midDraggers).forEach(marker => this.markerManager.removeMarker(marker));
    Object.values(this.draggers).forEach(marker => this.markerManager.removeMarker(marker));
  }

  enableClickToAdd() {
    if (this.clickListenKey !== null) return;
    this.clickListenKey = this.app.canvas.addEventListener('mousedown', (e) => {
      this.app.canvas.addEventListener('mouseup', (e_) => {
        if (e_.button === 0 && this.clickListenKey !== null) {
          if (Math.max(Math.abs(e.offsetX - e_.offsetX), Math.abs(e.offsetY - e_.offsetY)) <= 3) {
            let cartesian = this.app.camera.camera.pickEllipsoid(
                new Cesium.Cartesian2(e_.offsetX, e_.offsetY));
            if (cartesian) {
              let cartographic = Cesium.Ellipsoid.WGS84.cartesianToCartographic(cartesian);
              this.addPoint(Cesium.Math.toDegrees(cartographic.latitude),
                  Cesium.Math.toDegrees(cartographic.longitude));
              e_.preventDefault();
              this.lastClickToAdd = Date.now();
            }
          }
        }
      }, { once: true });
    });
  }

  disableClickToAdd() {
    if (this.clickListenKey) {
      this.app.canvas.removeEventListener('mousedown', this.clickListenKey);
      this.clickListenKey = null;
    }
  }

  setFillColor(hexColor, opacity = 1.0) {
    let [r, g, b] = hexColor.match(/\w\w/g).map(x => parseInt(x, 16) / 255);
    this.polygon.primitive.material.uniforms['color'] = new Cesium.Color(r, g, b, opacity);
    this.app.sceneChanged = true;
  }

  setStrokeColor(hexColor, opacity = 1.0) {
    let [r, g, b] = hexColor.match(/\w\w/g).map(x => parseInt(x, 16) / 255);
    this.polygon.primitiveLine.material.uniforms['color'] = new Cesium.Color(r, g, b, opacity);
    this.app.sceneChanged = true;
  }

  setIcon(src, width, height) {
    this.icon.setImage(src, width, height);
    this.repositionIcon();
    this.app.sceneChanged = true;
  }

  setOnChange(onChangeFunction) {
    this.onChangeCallback = onChangeFunction;
  }

  isValid() {
    return this.polygon.isValid();
  }

  getRoughArea() {
    return this.polygon.getRoughArea();
  }

  getCentroid() {
    let centroid = this.polygon.calcCentroid();
    return { lat: centroid[1], lng: centroid[0] };
  }

  isPointIn(lat, lng) {
    if (Date.now() - this.lastClickToAdd < 100) return false;
    return this.polygon.isPointIn(lat, lng);
  }

  intersects(other) {
    return this.polygon.intersects(other.polygon);
  }
}
