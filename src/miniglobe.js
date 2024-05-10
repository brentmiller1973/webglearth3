class MiniGlobe {
  constructor(app, latBands, lngBands, textureUrl) {
    if (!app.canvas) {
      throw new Error("app.canvas is required for MiniGlobe initialization.");
    }

    this.app = app;
    this.canvas = document.createElement('canvas');
    this.app.canvas.parentElement.appendChild(this.canvas);

    const options = { depth: false, preserveDrawingBuffer: true };
    this.gl = this.canvas.getContext('webgl', options) || this.canvas.getContext('experimental-webgl', options);

    if (!this.gl) {
      throw new Error("Unable to initialize WebGL. Your browser may not support it.");
    }

    this.setupWebGL();
    this.createSphere(latBands, lngBands);
    this.loadTexture(textureUrl);
  }

  setupWebGL() {
    const gl = this.gl;
    gl.enable(gl.CULL_FACE);
    gl.cullFace(gl.BACK);
    gl.clearColor(0.0, 0.0, 0.0, 0.0);
  }

  createSphere(latBands, lngBands) {
    const gl = this.gl;
    const radius = 1;
    const vertexPositionData = [];
    const textureCoordData = [];
    const indexData = [];

    for (let latNumber = 0; latNumber <= latBands; latNumber++) {
      const theta = latNumber * Math.PI / latBands;
      const sinTheta = Math.sin(theta);
      const cosTheta = Math.cos(theta);

      for (let longNumber = 0; longNumber <= lngBands; longNumber++) {
        const phi = longNumber * 2 * Math.PI / lngBands - Math.PI / 2;
        const sinPhi = Math.sin(phi);
        const cosPhi = Math.cos(phi);

        const x = cosPhi * sinTheta;
        const y = cosTheta;
        const z = sinPhi * sinTheta;
        const u = 1 - (longNumber / lngBands);
        const v = 1 - (latNumber / latBands);

        textureCoordData.push(u, v);
        vertexPositionData.push(radius * x, radius * y, radius * z);
      }
    }

    for (let latNumber = 0; latNumber < latBands; latNumber++) {
      for (let longNumber = 0; longNumber < lngBands; longNumber++) {
        const first = (latNumber * (lngBands + 1)) + longNumber;
        const second = first + lngBands + 1;
        indexData.push(first + 1, second, first, first + 1, second + 1, second);
      }
    }

    this.initializeBuffers(vertexPositionData, textureCoordData, indexData);
  }

  initializeBuffers(vertexPositionData, textureCoordData, indexData) {
    const gl = this.gl;

    this.vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexPositionData), gl.STATIC_DRAW);

    this.texCoordBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.texCoordBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoordData), gl.STATIC_DRAW);

    this.indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indexData), gl.STATIC_DRAW);
  }

  loadTexture(textureUrl) {
    const gl = this.gl;
    const texture = gl.createTexture();
    const image = new Image();
    image.onload = () => {
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    };
    image.src = textureUrl;
    this.texture = texture;
  }

  // Additional methods to control drawing, resizing, and other operations would go here.
}

export default MiniGlobe;
