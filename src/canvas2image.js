class Canvas2Image {
  static toBlob(canvas, callback, type = 'image/png') {
    if (!HTMLCanvasElement.prototype.toBlob) {
      const dataURI = canvas.toDataURL(type);
      const byteString = atob(dataURI.split(',')[1]);
      const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
      const ab = new ArrayBuffer(byteString.length);
      const ia = new Uint8Array(ab);
      for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
      }
      const blob = new Blob([ab], {type: mimeString});
      callback(blob);
    } else {
      canvas.toBlob(callback, type);
    }
  }

  static saveCanvasAsPNG(canvas, filename) {
    this.toBlob(canvas, blob => {
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename || 'download.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    });
  }

  static getCanvasAsDataURL(canvas) {
    return canvas.toDataURL('image/png');
  }
}

// Example usage:
// Canvas2Image.saveCanvasAsPNG(document.querySelector('canvas'), 'my-image.png');
