// TODO
// change color based on speed (without changing all objects)
// reset button?
// load functions from separate file
// sliders at top, buttons at bottom

let w = 400;
let h = 400;
let drawState = false;
let layerOne;
let layerTwo;

let functions;
let saveButton;
let playButton;
let clearButton;
let resetButton;
let accSlider;
let strokeSliderMax;
let strokeSliderMin;
let segSlider;

let pointOne;
// radial variables
  let radOne = 0;
  let velOne = 3;
  let minOne = -150;
  let maxOne = 150;
  let signOne = true;
// circumferential variables
  let angleOne = 135;
  let rotOne = 0.5;
  let accOne;
  let clockwiseOne = true;

let pointTwo;
// radial variables
  let radTwo = 0;
  let velTwo = 3;
  let minTwo = -150;
  let maxTwo = 150;
  let signTwo = true;
// circumferential variables
  let angleTwo = 315;
  let rotTwo = 0.5;
  let accTwo;
  let clockwiseTwo = true;

let segments = [];
let distArray = [];
let penPos;
let prevPos;
let segLimit = 800;
let strokeMax = 4;
let strokeMin = 0.5;

let xOff = 0;
let speed = 0;
let speedMod;
let lerpAmount;

// function preload() {
//   functions = loadJSON('functions.js');
// }

function setup() {
  
  pixelDensity(2);
  angleMode(DEGREES);
  // frameRate(30);
  
  let c = createCanvas(600, h);
  c.parent("#sketch-parent");
  layerOne = createGraphics(600, h);
  layerOne.clear();
  layerTwo = createGraphics(w, h);
  layerTwo.clear();
  
  // controls
  
    fill(0);
    noStroke();
    textSize(11);
    textAlign(LEFT);
  
    saveButton = createButton('Save');
    saveButton.size(60, 25);
    saveButton.position(410, 375);
    saveButton.mousePressed(saveImg);

    playButton = createButton('▶ / ❚❚');
    playButton.size(60, 25);  
    playButton.position(410, 345);
    playButton.mousePressed(playPause);
  
    clearButton = createButton('Clear');
    clearButton.size(60, 25);
    clearButton.position(475, 345);
    clearButton.mousePressed(clearStroke);
    
    resetButton = createButton('Reset');
    resetButton.size(60, 25);
    resetButton.position(475, 375);
    resetButton.mousePressed(reset);
    
    accSlider = createSlider(0.1, 0.5, 0.1, 0);
    accSlider.position(407, 15);
    accSlider.style('width', '100px');
  
    strokeSliderMin = createSlider(0.5, 10, 0.5, 0);
    strokeSliderMin.position(407, 75);
    strokeSliderMin.style('width', '100px');
  
    strokeSliderMax = createSlider(0.5, 10, 5, 0);
    strokeSliderMax.position(407, 95);
    strokeSliderMax.style('width', '100px');
  
    segSlider = createSlider(50, 2400, 800, 50);
    segSlider.position(407, 155);
    segSlider.style('width', '100px');
  
    // lifespan slider
    // minimum radius slider (0 - 100)
    // maximum radius slider (100 - 175)
    // clear stroke button?
    // show / hide markers?
    // use spacebar for play / pause instead of button?

  pointOne = createVector(0.25 * w, 0.25 * h);
  accOne = random(-0.04, 0.04);
  pointTwo = createVector(0.75 * w, 0.75 * h);
  accTwo = random(-0.04, 0.04);
  
  minOne = random(-170, -50);
  maxOne = random(50, 170);
  minTwo = random(-170, -50);
  maxTwo = random(50, 170);
  
  noLoop();
  
}

// declare functions

function saveImg() {
  saveCanvas('MIDTERM-0.4.3_' + JSON.stringify(random(100, 10000)), 'png');
}

function clearStroke() {
  segments = [];
  layerOne.clear();
}

function playPause() {
  
  if (isLooping()) {
    drawState = false;
    noLoop();
  } else {
    drawState = true;
    loop();
  }
  
}

function layerZero() {

  noStroke();
  fill(230);
  rect(0, 0, 400, 400);
  stroke(200);
  strokeWeight(1);
  noFill();
  ellipse(w / 2, h / 2, 350, 350);
  line(w / 2, (h / 2) - 10, w / 2, (h / 2) + 10);
  line((w / 2) - 10, h / 2, (w / 2) + 10, h / 2);
  
}  

function reset() {
  
  layerOne.clear();
  layerTwo.clear();
  noStroke();
  fill(230);
  rect(0, 0, 400, 400);
  fill(255);
  rect(400, 0, 600, 400);
  fill(0);
  textSize(11);
  textAlign(LEFT);
  text('Interpolation Speed', 410, 10);
  text(round(accSlider.value(), 2), 515, 29);
  text('Stroke Width', 410, 70);
  text(round(strokeSliderMin.value(), 2) + ' (min)', 515, 89);
  text(round(strokeSliderMax.value(), 2) + ' (max)', 515, 109);
  text('Lifespan', 410, 150);
  text(segSlider.value(), 515, 169);
  accSlider.value(0.1);
  strokeSliderMin.value(0.5);
  strokeSliderMax.value(5);
  segSlider.value(800);
  drawState = false;
  noLoop();
  
  segments = [];
  distArray = [];
  
  // POINT 01
  
    radOne = 0;
    velOne = 3;
    minOne = -150;
    maxOne = 150;
    signOne = true;
    angleOne = 135;
    rotOne = 0.5;
    clockwiseOne = true;
  
  // POINT 02
  
    radTwo = 0;
    velTwo = 3;
    minTwo = -150;
    maxTwo = 150;
    signTwo = true;
    angleTwo = 315;
    rotTwo = 0.5;
    clockwiseTwo = true;
  
}
  
function draw() {
  
  noStroke();
  fill(230);
  rect(0, 0, 400, 400);

  if (drawState == true) {
    layerZero();
    layerOne.clear();
    layerTwo.clear();
  }
  
  // draw control text
  noStroke();
  fill(255);
  rect(400, 0, 600, 400);
  fill(0);
  textSize(11);
  textAlign(LEFT);
  text('Interpolation Speed', 410, 10);
  text(round(accSlider.value(), 2), 515, 29);
  text('Stroke Width', 410, 70);
  text(round(strokeSliderMin.value(), 2) + ' (min)', 515, 89);
  text(round(strokeSliderMax.value(), 2) + ' (max)', 515, 109);
  text('Lifespan', 410, 150);
  text(segSlider.value(), 515, 169);
  
  let acceleration = accSlider.value();
  strokeMin = strokeSliderMin.value();
  strokeMax = strokeSliderMax.value();
  segLimit = segSlider.value();
  
  // POINT 01
  
    // circumferential change
    if (abs(rotOne) > 2 && clockwiseOne == true) {
      accOne = random(-0.01, 0);
    } else if (abs(rotOne) > 2 && clockwiseOne == false) {
      accOne = random(0, 0.01);
    }

    if (rotOne > 0) {
      clockwiseOne = true;
    } else if (rotOne < 0) {
      clockwiseOne = false;
    }

    rotOne += accOne + map(noise(xOff, 1), 0, 1, -0.02, 0.02);
    angleOne += rotOne;
  
    // radial change
    if (radOne > maxOne) {
      minOne = random(-170, -50);
      signOne = false;
    } else if (radOne < minOne) {
      maxOne = random(50, 170);
      signOne = true;
    }
  
    if (signOne == true) {
      if (radOne < 0) {
        velOne = map(radOne, minOne, 0, 0.1, 3);  
      } else if (radOne > 0) {
        velOne = map(radOne, 0, maxOne, 3, 0.1)
      }
    } else if (signOne == false) {
      if (radOne > 0) {
        velOne = map(radOne, maxOne, 0, -0.1, -3);  
      } else if (radOne < 0) {
        velOne = map(radOne, 0, minOne, -3, -0.1)
      }
    }
  
    radOne += velOne;
  
    pointOne.x = (w / 2) + (radOne * cos(angleOne));
    pointOne.y = (h / 2) + (radOne * sin(angleOne));
  
  // POINT 02
  
    // circumferential change
    if (abs(rotTwo) > 2 && clockwiseTwo == true) {
      accTwo = random(-0.01, 0);
    } else if (abs(rotTwo) > 2 && clockwiseTwo == false) {
      accTwo = random(0, 0.01);
    }

    if (rotTwo > 0) {
      clockwiseTwo = true;
    } else if (rotTwo < 0) {
      clockwiseTwo = false;
    }

    rotTwo += accTwo + map(noise(xOff, 2), 0, 1, -0.02, 0.02);
    angleTwo += rotTwo;
  
    // radial change
    if (radTwo > maxTwo) {
      minTwo = random(-170, -50);
      signTwo = false;
    } else if (radTwo < minTwo) {
      maxTwo = random(50, 170);
      signTwo = true;
    }
  
    if (signTwo == true) {
      if (radTwo < 0) {
        velTwo = map(radTwo, minTwo, 0, 0.1, 3);  
      } else if (radTwo > 0) {
        velTwo = map(radTwo, 0, maxTwo, 3, 0.1)
      }
    } else if (signTwo == false) {
      if (radTwo > 0) {
        velTwo = map(radTwo, maxTwo, 0, -0.1, -3);  
      } else if (radTwo < 0) {
        velTwo = map(radTwo, 0, minTwo, -3, -0.1)
      }
    }
  
    radTwo += velTwo;
  
    pointTwo.x = (w / 2) + (radTwo * cos(angleTwo));
    pointTwo.y = (h / 2) + (radTwo * sin(angleTwo));
  
  speedMod = 2 * (0.5) ** (map(p5.Vector.dist(pointOne, pointTwo), 0, 400, 10, 4, true));
  // speed += 0.1 + speedMod;
  speed += acceleration;
  
  lerpAmount = map(sin(speed * 20), -1, 1, 0.1, 0.9, true);
  penPos = p5.Vector.lerp(pointOne, pointTwo, lerpAmount); // interpolation function
  
  if (drawState == true) {
    
    layerTwo.fill(35);
    layerTwo.noStroke();
    layerTwo.ellipse(pointOne.x, pointOne.y, 10, 10);
    layerTwo.ellipse(pointTwo.x, pointTwo.y, 10, 10);

    // draw numbers in points
    layerTwo.fill(255);
    layerTwo.textAlign(CENTER);
    layerTwo.textSize(8);
    layerTwo.textStyle(BOLD);
    layerTwo.text('1', pointOne.x, pointOne.y + 3);
    layerTwo.text('2', pointTwo.x, pointTwo.y + 3);
    
    // draw pen
    layerTwo.fill(35);
    layerTwo.noStroke();
    layerTwo.ellipse(penPos.x, penPos.y, 4, 4);
    
    // draw segments
    if (segments.length < segLimit) {
      segments.push(new Segment());
      distArray.push(map(p5.Vector.dist(prevPos, penPos), 0, 5, strokeMax, strokeMin, true))
    }
    
    for (let i = 0; i < segments.length; i++) {
      
      let s = segments[i];
      
      if(s.age > s.lifespan) {

        segments.splice(i, 1);
        segments.push(new Segment());
        distArray.splice(i, 1);
        distArray.push(map(p5.Vector.dist(prevPos, penPos), 0, 5, strokeMax, strokeMin, true));
        
      }
      
      if (i > 0) {
        s.update();
        s.draw();
        layerOne.strokeWeight(distArray[i]);
      }
    }
  }
  
  prevPos = penPos;
  
  image(layerOne, 0, 0);
  if (drawState == true) {
    image(layerTwo, 0, 0);  
  }
  xOff += 0.05;
  
}

// define Segment object

class Segment {

  constructor() {

    this.pos = createVector(penPos.x, penPos.y);
    this.lastPos = createVector(prevPos.x, prevPos.y);
    // this.color = (0, 100 + (map(p5.Vector.dist(pointOne, pointTwo), 0, 200, 100, 0)), 255);
    this.color = (0, 100, 255);
    this.age = 0;
    this.lifespan = segLimit; // adjust as necessary
    
  }

  update() {
    
    this.age ++;
    let lineAlpha = this.lifespan - this.age;
    this.color = color(0, 100, 255, lineAlpha);
    
  }

  draw() {
    
    layerOne.noFill();
    layerOne.stroke(this.color);
    layerOne.line(this.pos.x, this.pos.y, this.lastPos.x, this.lastPos.y);
    
  }
  
}