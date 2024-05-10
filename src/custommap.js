class CustomMap extends Cesium.TileMapServiceImageryProvider {
  constructor(opts) {
    super(opts);
    this.setOptions(opts);
  }

  setOptions(opts) {
    this._url = opts.url;

    this._minimumLevel = opts.minimumLevel || 0;
    this._maximumLevel = opts.maximumLevel || 18;

    this.tileSize = opts.tileSize || 256;
    this._tileWidth = this._tileHeight = this.tileSize;

    let rectangle = null;
    if (opts.bounds && opts.bounds.length > 3) {
      rectangle = Cesium.Rectangle.fromDegrees(
          opts.bounds[0], opts.bounds[1], opts.bounds[2], opts.bounds[3]
      );
    }

    this.flipY = opts.flipY || false;
    this.subdomains = opts.subdomains || [];

    this._credit = new Cesium.Credit(opts.copyright, undefined, opts.copyrightLink);

    this._proxy = opts.proxy;

    this.emptyTile = document.createElement('canvas');
    this.emptyTile.width = this.tileSize;
    this.emptyTile.height = this.tileSize;

    this._errorEvent = new Cesium.Event();
    this._tilingScheme = new Cesium.WebMercatorTilingScheme();
    this._rectangle = rectangle || this._tilingScheme.rectangle;
    this._ready = Boolean(this._url);
  }

  buildTileURL(zoom, x, y) {
    let url = this._url.replace('{z}', zoom.toString());
    url = url.replace('{x}', x.toString());
    url = url.replace('{y}', (this.flipY ? ((1 << zoom) - y - 1) : y).toString());
    if (this.subdomains.length > 0) {
      const subIndex = (x + y + zoom) % this.subdomains.length;
      url = url.replace('{sub}', this.subdomains[subIndex]);
    }
    return this._proxy ? this._proxy.getURL(url) : url;
  }

  requestImage(x, y, level) {
    if (level < this._minimumLevel || level > this._maximumLevel) {
      return Promise.resolve(this.emptyTile);
    }
    const url = this.buildTileURL(level, x, y);
    return Cesium.ImageryProvider.loadImage(this, url);
  }
}
