class App {
  static VERSION = 2;
  static UA = 'UA-20846306-1';

  constructor(divid, options = {}) {
    this.container = document.getElementById(divid);
    this.webGLSupported = this.detectWebGLSupport();
    this.resourceProtocol = window.location.protocol === 'file:' ? 'http:' : '';

    if (App.UA && App.UA.length > 0) {
      this.setupAnalytics();
    }

    if (!this.webGLSupported) {
      this.showWebGLError();
      return;
    }

    this.initializeCesium(options);
    this.setupEventListeners();
  }

  detectWebGLSupport() {
    const canvas = document.createElement('canvas');
    const glOptions = { alpha: false };
    const contexts = ["webgl", "experimental-webgl", "webkit-3d", "moz-webgl"];
    for (const context of contexts) {
      const gl = canvas.getContext(context, glOptions);
      if (gl && typeof gl.getParameter === 'function') {
        return true;
      }
    }
    return false;
  }

  setupAnalytics() {
    window['GoogleAnalyticsObject'] = 'ga';
    window['ga'] = window['ga'] || function() {
      (window['ga'].q = window['ga'].q || []).push(arguments);
    };
    window['ga'].l = 1 * new Date();
    const gaScript = document.createElement('script');
    const firstScript = document.getElementsByTagName('script')[0];
    gaScript.async = 1;
    gaScript.src = `${this.resourceProtocol}//www.google-analytics.com/analytics.js`;
    firstScript.parentNode.insertBefore(gaScript, firstScript);

    window['ga']('create', App.UA, {'name': 'we0'});
    window['ga']('we0.send', 'event', App.VERSION.toString(), window.location.host, window.location.href, this.webGLSupported ? 1 : 0);
  }

  showWebGLError() {
    const iframe = document.createElement('iframe');
    iframe.src = `${this.resourceProtocol}//www.webglearth.com/webgl-error.html`;
    iframe.style.cssText = "width:100%; height:100%; border:none;";
    this.container.appendChild(iframe);
  }

  initializeCesium(options) {
    this.canvas = document.createElement('canvas');
    this.canvas.style.cssText = 'width:100%; height:100%;';
    this.canvas.oncontextmenu = () => false;
    this.container.appendChild(this.canvas);

    this.scene = new Cesium.Scene({
      canvas: this.canvas,
      contextOptions: { webgl: { alpha: options.sky !== true } }
    });

    this.setupScene(options);
  }

  setupScene(options) {
    // Example of setting up Cesium Globe, Camera, and SkyBox
    this.scene.globe = new Cesium.Globe(Cesium.Ellipsoid.WGS84);
    if (options.sky) {
      this.scene.skyBox = new Cesium.SkyBox({
        sources: {
          positiveX: 'path/to/px.jpg',
          negativeX: 'path/to/nx.jpg',
          positiveY: 'path/to/py.jpg',
          negativeY: 'path/to/ny.jpg',
          positiveZ: 'path/to/pz.jpg',
          negativeZ: 'path/to/mz.jpg'
        }
      });
    }

    if (options.atmosphere) {
      this.scene.skyAtmosphere = new Cesium.SkyAtmosphere();
    }

    // Additional initialization logic as needed
  }

  setupEventListeners() {
    // Setup interactions, listeners, etc.
    window.addEventListener('resize', this.handleResize.bind(this));
  }

  handleResize() {
    const width = this.container.clientWidth;
    const height = this.container.clientHeight;

    if (this.canvas.width !== width || this.canvas.height !== height) {
      this.canvas.width = width;
      this.canvas.height = height;
      this.scene.camera.frustum.aspectRatio = width / height;
    }
  }
}
