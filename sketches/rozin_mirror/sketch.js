let w = 352;
let h = 240;
let capture;
let mic;
let stepSize;

function setup() {
  createCanvas(w, h);
  pixelDensity(1);
  
  frameRate(30);
  
  capture = createCapture(VIDEO);
  capture.size(w, h);
  capture.hide();
  
  mic = new p5.AudioIn();
  mic.start();
  
}

function draw() {

  background(230);
  
  capture.loadPixels();
  let vol = mic.getLevel();
  let mod;
  
  if (mod > 0) {
    mod = mod - 0.001;
  } else {
    if (vol < 0.02) {
      mod = 0;
    } else {
      mod = 6;  
    }
  }
    
  // if (vol < 0.02) {
  //   mod = 0; 
  // } else {
  //   mod = map(vol, 0.02, 0.4, 4, 8);
  // }
  
  stepSize = 12 - round(mod);
  
  for (let y = 0; y < capture.height; y += stepSize) {
    for (let x = 0; x < capture.width; x += stepSize) {
      const index = (x + y * capture.width) * 4;

      let r = capture.pixels[index];
      let g = capture.pixels[index + 1];
      let b = capture.pixels[index + 2];
      let c = color(r + 10, g, b + 35);
      
      let colorTotal = map((r + g + b), 0, 765, 8, 0);
      let size = map(vol, 0, 0.4, 2, 10);

      stroke(c);
      strokeWeight(colorTotal);
      
      push(); // mirror output
        translate(capture.width - 2, 4);
        scale(-1, 1);
        line (x, y, x - size, y + size);
        // line (x, y, x + size, y + size);
      pop();

    }
  }
}