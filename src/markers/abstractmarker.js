class AbstractMarker {
  constructor(lat, lon, element) {
    this.lat = lat;
    this.lon = lon;
    this.element = element;
    this.parentElement = null;
    this.enabled = true;
    this.visible = false;
  }

  attach(parentElement) {
    if (this.parentElement) {
      this.detach();
    }
    this.parentElement = parentElement;
    this.parentElement.appendChild(this.element);
    this.show(true);
  }

  detach() {
    if (this.parentElement) {
      this.parentElement.removeChild(this.element);
      this.parentElement = null;
    }
  }

  enable(opt_enabled = true) {
    this.enabled = opt_enabled;
    if (!this.enabled) this.show(false);
  }

  isEnabled() {
    return this.enabled;
  }

  isVisible() {
    return this.visible;
  }

  show(opt_visible = true) {
    this.visible = opt_visible;
    this.element.style.display = this.visible ? '' : 'none';
  }

  setXY(x, y) {
    this.element.style.left = `${x}px`;
    this.element.style.top = `${y}px`;
    if (this.enabled) {
      this.show(true);
    }
  }

  draw2D(ctx) {
    // This method should be overridden to render on a 2D canvas.
  }
}
