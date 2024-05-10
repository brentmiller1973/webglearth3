class CameraAnimator {
  static CAMERA_ANIMATION_DURATION = 3;
  static CAMERA_ANIMATION_MAX_ASCENT = 0.2;

  constructor(camera) {
    this.camera = camera;
    this.animation = null;
  }

  flyTo(latitude, longitude, altitude, heading = 0, tilt = 0, targetPosition = false, duration = CameraAnimator.CAMERA_ANIMATION_DURATION) {
    if (this.animation) {
      this.animation.cancel();
      this.animation = null;
    }

    const startPos = this.camera.getPos();
    const startAlt = startPos[2];
    const endAlt = altitude || startAlt;

    if (targetPosition) {
      const newPos = Camera.calculatePositionForGivenTarget(latitude, longitude, altitude, heading, tilt);
      latitude = newPos[0];
      longitude = newPos[1];
    }

    const lonStart = (startPos[1] % (2 * Math.PI));
    const lonEnd = (longitude % (2 * Math.PI));
    const lonDiff = lonStart - lonEnd;

    const endPos = [latitude, lonEnd, endAlt, heading, tilt];
    const easeInOut = t => t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;

    this.animateCamera(startPos, endPos, duration, easeInOut);
  }

  animateCamera(startPos, endPos, duration, easingFunction) {
    const startTime = performance.now();
    const endTime = startTime + duration * 1000;

    const animateStep = () => {
      const now = performance.now();
      const time = (now - startTime) / (endTime - startTime);
      const easedTime = easingFunction(Math.min(1, time));

      const currentPos = startPos.map((start, i) => start + (endPos[i] - start) * easedTime);

      this.camera.setPosHeadingAndTilt(...currentPos);

      if (time < 1) {
        requestAnimationFrame(animateStep);
      } else {
        this.animation = null;
      }
    };

    this.animation = { cancel: () => cancelAnimationFrame(animateStep) };
    requestAnimationFrame(animateStep);
  }

  cancel() {
    if (this.animation) {
      this.animation.cancel();
      this.animation = null;
    }
  }
}

// Usage:
// const camera = { getPos: () => [0, 0, 100], setPosHeadingAndTilt: () => {} };
// const animator = new CameraAnimator(camera);
// animator.flyTo(0.1, 0.1, 150);
