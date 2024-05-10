class PolyDragger extends AbstractMarker {
  constructor(lat, lon, app, fixedId, updateFunc, deleteFunc, opt_createFunc) {
    const markerElement = document.createElement('div');
    markerElement.className = fixedId ? 'we-polydragger-a' : 'we-polydragger-b';

    super(lat, lon, markerElement);
    this.show(false);

    markerElement.addEventListener('mousedown', (e) => {
      if (e.button === 0) { // Left mouse button
        const moveHandler = (event) => {
          const carte = app.camera.camera.pickEllipsoid(new Cesium.Cartesian2(event.offsetX, event.offsetY));
          if (carte) {
            const carto = Cesium.Ellipsoid.WGS84.cartesianToCartographic(carte);
            this.lat = Cesium.Math.toDegrees(carto.latitude);
            this.lon = Cesium.Math.toDegrees(carto.longitude);
            this.setXY(event.offsetX, event.offsetY);
            if (fixedId !== undefined) {
              updateFunc(fixedId, this.lat, this.lon);
            } else if (opt_createFunc) {
              fixedId = opt_createFunc(this.lat, this.lon);
              markerElement.className = 'we-polydragger-a';
            }
            event.preventDefault();
          }
        };

        app.canvas.addEventListener('mousemove', moveHandler, false);

        const upHandler = () => {
          app.canvas.removeEventListener('mousemove', moveHandler);
          app.canvas.removeEventListener('mouseup', upHandler);
        };

        app.canvas.addEventListener('mouseup', upHandler, false);

        e.preventDefault();
      }
    });

    markerElement.addEventListener('click', (e) => {
      if (e.altKey && fixedId !== undefined) {
        deleteFunc(fixedId);
        e.preventDefault();
      }
    });
  }

  static installStyles() {
    const styleSheet = document.createElement("style");
    document.head.appendChild(styleSheet);
    styleSheet.sheet.insertRule('.we-polydragger-a { position: absolute; width: 8px; height: 8px; z-index: 100; margin-left: -4px; margin-top: -4px; background-color: #36f; cursor: pointer; border: 1px solid blue; }', 0);
    styleSheet.sheet.insertRule('.we-polydragger-b { position: absolute; width: 6px; height: 6px; z-index: 99; margin-left: -3px; margin-top: -3px; background-color: rgba(180,220,250,0.9); cursor: pointer; border: 1px solid blue; }', 1);
  }
}

PolyDragger.installStyles();
