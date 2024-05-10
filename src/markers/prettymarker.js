class PrettyMarker extends AbstractMarker {
  constructor(lat, lon, iconUrl = '', width = 25, height = 41) {
    super(lat, lon);
    this.iconUrl = iconUrl;
    this.width = width;
    this.height = height;
    this.popup = null;
    this.createElement();
  }

  createElement() {
    this.element = document.createElement('div');
    this.element.className = 'we-pm-icon';
    this.element.style.backgroundImage = `url(${this.iconUrl})`;
    this.element.style.width = `${this.width}px`;
    this.element.style.height = `${this.height}px`;
    this.element.style.marginLeft = `${-this.width / 2}px`;
    this.element.style.marginTop = `${-this.height}px`;

    this.element.addEventListener('click', () => {
      this.showPopup();
    });

    // Additional wrapper for marker and popup
    this.wrapper = document.createElement('div');
    this.wrapper.style.position = 'absolute';
    this.wrapper.appendChild(this.element);

    // Append to some parent container, example for direct append to body for simplicity
    document.body.appendChild(this.wrapper);
  }

  attachPopup(popup) {
    if (this.popup) {
      this.popup.remove();
    }
    this.popup = popup;
    this.wrapper.appendChild(popup.element);
    popup.adjust(this.height);
  }

  showPopup(visible = undefined) {
    if (this.popup) {
      if (visible === undefined) {
        this.popup.visible = !this.popup.visible;
      } else {
        this.popup.visible = visible;
      }
      this.popup.show(this.popup.visible);
    }
  }
}

class Popup {
  constructor(content, maxWidth = 300, closeBtn = true) {
    this.content = content;
    this.maxWidth = maxWidth;
    this.closeBtn = closeBtn;
    this.visible = false;
    this.element = document.createElement('div');
    this.setup();
  }

  setup() {
    this.element.style.width = `${this.maxWidth}px`;
    this.element.innerHTML = this.content;
    if (this.closeBtn) {
      const closeButton = document.createElement('button');
      closeButton.textContent = 'Close';
      closeButton.onclick = () => this.show(false);
      this.element.appendChild(closeButton);
    }
  }

  show(visible) {
    this.element.style.display = visible ? 'block' : 'none';
  }

  adjust(markerHeight) {
    this.element.style.marginTop = `${-markerHeight}px`;
  }

  remove() {
    if (this.element.parentNode) {
      this.element.parentNode.removeChild(this.element);
    }
  }
}

// Assuming AbstractMarker is defined elsewhere similar to PrettyMarker with required methods
class AbstractMarker {
  constructor(lat, lon) {
    this.lat = lat;
    this.lon = lon;
  }

  // Other methods can be added here
}

// You can also define utility methods as needed for additional functionality
