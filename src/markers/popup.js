class Popup {
  constructor(contentHTML, maxWidth = 300, closeButton = true) {
    this.contentHTML = contentHTML;
    this.maxWidth = maxWidth;
    this.closeButton = closeButton;
    this.element = this.createElement();
    this.visible = false;
  }

  createElement() {
    const content = document.createElement('div');
    content.className = 'we-pp-content';
    content.innerHTML = this.contentHTML;

    const contentWrap = document.createElement('div');
    contentWrap.className = 'we-pp-wrapper';
    contentWrap.appendChild(content);

    const tipContainer = document.createElement('div');
    tipContainer.className = 'we-pp-tip-cont';
    const tip = document.createElement('div');
    tip.className = 'we-pp-tip';
    tipContainer.appendChild(tip);

    const popup = document.createElement('div');
    popup.className = 'we-pp';
    popup.style.width = `${this.maxWidth + 40}px`; // adding padding/margin compensation
    popup.style.marginLeft = `-${(this.maxWidth + 40) / 2}px`;

    if (this.closeButton) {
      const closeButton = document.createElement('a');
      closeButton.className = 'we-pp-close';
      closeButton.href = '#';
      closeButton.onclick = () => this.show(false);
      popup.appendChild(closeButton);
    }

    popup.appendChild(contentWrap);
    popup.appendChild(tipContainer);

    document.body.appendChild(popup); // This line is just an example of placement. You should append it to a proper element in your app.

    return popup;
  }

  show(visible) {
    if (visible === undefined) {
      visible = this.visible ? false : true;
    }
    this.visible = visible;
    this.element.style.opacity = visible ? '1' : '0';
    this.element.style.visibility = visible ? 'visible' : 'hidden';
  }

  adjust(markerHeight) {
    this.element.style.bottom = `${markerHeight}px`;
  }
}

// Utility method to install global styles, you can include these styles in your main CSS file.
function installPopupStyles() {
  const styles = `
    .we-pp-content p { margin: 18px 0; text-align: justify; }
    .we-pp-wrapper { padding: 1px; text-align: left; border-radius: 12px; }
    .we-pp { z-index: 100; transition: opacity 0.2s linear; position: absolute; background: white; box-shadow: 0 1px 10px #888; }
    .we-pp-close { position: absolute; top: 9px; right: 9px; width: 10px; height: 10px; overflow: hidden; background-image: url('path_to_close_icon.png'); }
    .we-pp-tip-cont { margin: 0 auto; width: 40px; height: 16px; position: relative; overflow: hidden; }
    .we-pp-tip { width: 15px; height: 15px; padding: 1px; margin: -8px auto 0; transform: rotate(45deg); }
  `;
  const styleSheet = document.createElement("style");
  styleSheet.type = "text/css";
  styleSheet.innerText = styles;
  document.head.appendChild(styleSheet);
}

installPopupStyles();
