// Attribution: crop image from canvas
// Source: http://stackoverflow.com/a/22267731
// Author: potomek
// Accessed: March 28, 2017

export default function cropImageFromCanvas(ctx, canvas) {
  const imageData = ctx.getImageData(0,0,canvas.width,canvas.height);
  const w = canvas.width,
        h = canvas.height,
  var pix = {x:[], y:[]};
  var x, y, index;
  
  for (y = 0; y < h; y++) {
    for (x = 0; x < w; x++) {
      index = (y * w + x) * 4;
      if (imageData.data[index+3] > 0) {
        pix.x.push(x);
        pix.y.push(y);
      }   
    }
  }
  pix.x.sort(function(a,b){return a-b});
  pix.y.sort(function(a,b){return a-b});
  var n = pix.x.length-1;

  w = pix.x[n] - pix.x[0];
  h = pix.y[n] - pix.y[0];
  var cut = ctx.getImageData(pix.x[0], pix.y[0], w, h);

  canvas.width = w;
  canvas.height = h;
  ctx.putImageData(cut, 0, 0);
}