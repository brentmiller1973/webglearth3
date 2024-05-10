// Assuming weapi.App and other dependencies like weapi.markers.Popup have been similarly refactored
import { App } from './App'; // Adjust path as necessary
import { Popup } from './markers/Popup'; // Adjust path as necessary

class PolyIcon {
  static REFERENCE_DISTANCE = 1000;
  static REFERENCE_CANVAS_HEIGHT = 768;

  constructor(lat, lng, app) {
    if (!(app instanceof App)) {
      throw new Error('app must be an instance of App');
    }

    this.app = app;
    this.billboard = null; // Assuming billboard management is done by Cesium directly
    this.lat_ = 0;
    this.lng_ = 0;
    this.src = '';
    this.setLatLng(lat, lng);
  }

  setLatLng(lat, lng) {
    this.lat_ = lat;
    this.lng_ = lng;

    if (this.billboard) {
      const position = Cesium.Ellipsoid.WGS84.cartographicToCartesian(
          new Cesium.Cartographic(this.lng_, this.lat_)
      );
      this.billboard.position = position;
    }
  }

  enable(enable) {
    if (this.billboard) {
      this.billboard.show = enable;
    }
  }

  destroy() {
    if (this.billboard) {
      this.app.polyIconCollection.remove(this.billboard);
      this.billboard = null;
    }
  }

  setImage(src, width, height) {
    if (src.length > 0) {
      if (!this.billboard) {
        this.billboard = this.app.polyIconCollection.add();
        this.setLatLng(this.lat_, this.lng_);
      }
      this.billboard.image = src;
      this.billboard.width = width;
      this.billboard.height = height;
      this.billboard.sizeInMeters = true;
      this.billboard.verticalOrigin = Cesium.VerticalOrigin.BOTTOM;

      this.setLatLng(this.lat_, this.lng_);
      this.app.sceneChanged = true;
    } else {
      if (this.billboard) {
        this.app.polyIconCollection.remove(this.billboard);
        this.billboard = null;
      }
    }
  }

  isPointIn(x, y) {
    // This method's implementation would depend on how hit testing is handled in your application
    return false;
  }
}

export default PolyIcon;
