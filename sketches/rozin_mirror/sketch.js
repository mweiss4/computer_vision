let w = 352;
let h = 240;
let capture;


// let totalR = 0;
// let totalG = 0;
// let totalB = 0;

function setup() {
  let c = createCanvas(w, h);
  c.parent("#sketch-parent");

  createCanvas(w, h);
  pixelDensity(1);
  
  frameRate(30);
  
  capture = createCapture(VIDEO);
  capture.size(w, h);
  capture.hide();
  
//   for(let y = 0; y < capture.height; y++) {
//     for(let x = 0; x < capture.width; x++) {
//       const index = (x + y * capture.width) * 4;
      
//       let pixelCount = capture.width * capture.height;
      
//       r = capture.pixels[index];
//       g = capture.pixels[index+1];
//       b = capture.pixels[index+2];
      
//       totalR = totalR + r;
//       totalG = totalG + g;
//       totalB = totalB + b;
      
//       background(totalR / pixelCount, totalG / pixelCount, totalB / pixelCount);
//     }
//   }
  
}

function draw() {
  
  // background
  background(255);
  
  capture.loadPixels();
  let stepSize = 8;
  
  // let threshold = constrain(tRange, 0, 255);
  // above can be avoided using a boolean operator at the end of map();
  
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

      // fill(c);
      stroke(c);
      strokeWeight(colorTotal);
      
      push(); // mirror output
        translate(capture.width - 2, -5);
        scale(-1, 1);
        line (x, y, x - size, y + size);
      pop();
      
      // rect(x, y, size, size);

    }
  }
}