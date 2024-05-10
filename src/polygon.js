class Polygon {
  static REFERENCE_DISTANCE = 1000;
  static REFERENCE_CANVAS_HEIGHT = 768;

  constructor() {
    this.primitive = new Cesium.Polygon({ asynchronous: false });
    this.primitiveLineCol = new Cesium.PolylineCollection();
    this.primitiveLine = this.primitiveLineCol.add();
    this.head = null;
    this.vertices = [];
    this.numVertices = 0;

    // Set default colors and line width
    this.primitive.material.uniforms.color = new Cesium.Color(1, 0, 0, 0.8);
    this.primitiveLine.material.uniforms.color = new Cesium.Color(0, 0, 0, 1);
    this.primitiveLine.width = 2;

    this.roughArea = 0;
    this.valid = false;
    this.pointSwitchFlag = false;
    this.triangulation = [];
  }

  isValid() {
    return this.valid;
  }

  orientationChanged() {
    const oldValue = this.pointSwitchFlag;
    this.pointSwitchFlag = false;
    return oldValue;
  }

  getRoughArea() {
    return this.roughArea;
  }

  addPoint(lat, lng, opt_parent = this.vertices.length - 1, opt_more = false) {
    const vertex = new Node(lat, lng);

    if (this.numVertices === 0) {
      this.head = vertex;
      vertex.next = vertex;
      vertex.prev = vertex;
    } else {
      const parent = this.vertices[opt_parent] || this.head.prev;
      vertex.next = parent.next;
      parent.next = vertex;
      vertex.prev = parent;
      vertex.next.prev = vertex;
    }

    this.vertices.push(vertex);
    vertex.fixedId = this.vertices.length - 1;
    this.numVertices++;

    if (!opt_more) {
      this.rebufferPoints();
      this.solveTriangles();
    }

    return vertex.fixedId;
  }

  // Further methods like movePoint, removePoint, etc. can be added here similarly
}

class Node {
  constructor(lat, lng) {
    this.setLatLng(lat, lng);
    this.next = null;
    this.prev = null;
    this.fixedId = -1;
    this.tmpId = -1;
    this.ear = false;
  }

  setLatLng(lat, lng) {
    const rad = Math.PI / 180;
    this.x = lng * rad;
    this.y = lat * rad;
    const cosy = Math.cos(this.y);
    this.projX = Math.sin(this.x) * cosy;
    this.projY = Math.sin(this.y);
    this.projZ = Math.cos(this.x) * cosy;
  }
}

export default Polygon;
