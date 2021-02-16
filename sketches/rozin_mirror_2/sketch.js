let w = 352;
let h = 240;
let capture;

function setup() {
  let c = createCanvas(w, h);
  c.parent("#sketch-parent");
  pixelDensity(1);
  
  frameRate(30);
  
  capture = createCapture(VIDEO);
  capture.size(w, h);
  capture.hide();
  
}

function draw() {
  
  background(220);
  
  capture.loadPixels();
  let stepSize = 8;
  
  for (let y = -50; y < capture.height + 50; y += stepSize) {
    for (let x = -50; x < capture.width + 50; x += stepSize) {
      const index = (x + y * capture.width) * 4;

      let r = capture.pixels[index];
      let g = capture.pixels[index + 1];
      let b = capture.pixels[index + 2];
      let c = color(r + 10, g, b + 35);
      
      let colorTotal = map((r + g + b), 0, 765, 8, 0);
      let brightness = (r + g + b) / 3;
      let size = map(brightness, 0, 255, 0, stepSize * 1.5);

      stroke(c);
      strokeWeight(colorTotal);
      
      push(); // mirror output
        translate(capture.width - 2, -5);
        scale(-1, 1);
        line (x, y, x - size, y + size);
      pop();
      
    }
  }
}