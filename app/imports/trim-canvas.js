// Attribution: clone an html5 canvas quickly
// Source: http://stackoverflow.com/a/8306028
// Author: Robert Hurst
// Accessed: March 29, 2017
function cloneCanvas(oldCanvas) {
  // Create a new canvas
  var newCanvas = document.createElement('canvas');
  var context = newCanvas.getContext('2d');
  newCanvas.width = oldCanvas.width;
  newCanvas.height = oldCanvas.height;
  // Apply the old canvas to the new one
  context.drawImage(oldCanvas, 0, 0);
  return newCanvas;
}

// Attribution: crop image from canvas
// Source: http://stackoverflow.com/a/22267731
// Author: potomek
// Accessed: March 28, 2017
// -- Used it as a template, modified to fit our needs.
// @arg canvas: a fabricjs canvas
export default function trimCanvasToSketch(fabricCanvas, callback) {
  let oldHTML5Canvas = fabricCanvas.getElement();
  let canvas = cloneCanvas(oldHTML5Canvas);
  let ctx = canvas.getContext('2d');

  let w = canvas.width;
  let h = canvas.height;
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  let pix = {x:[], y:[]};
  let x, y, index;
  
  for (y = 0; y < h; y++) {
    for (x = 0; x < w; x++) {
      index = (y * w + x) * 4;
      if (imageData.data[index+3] > 0) {
        pix.x.push(x);
        pix.y.push(y);
      }   
    }
  }

  // Cant trim an empty canvas
  if (!pix.x.length || !pix.y.length) {
    callback(canvas, 0, 0, w, h);
    return;
  }

  pix.x.sort((a, b) => a - b);
  pix.y.sort((a, b) => a - b);
  const n = pix.x.length - 1;

  w = pix.x[n] - pix.x[0];
  h = pix.y[n] - pix.y[0];
  const cut = ctx.getImageData(pix.x[0], pix.y[0], w, h);

  canvas.width = w;
  canvas.height = h;

  ctx.putImageData(cut, 0, 0);

  callback(canvas, pix.x[0], pix.y[0], w, h);
}
