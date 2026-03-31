let handPose;
let video;
let hands = [];
let smoothedSizes = [0, 0]; 
let rotationAngle = 0;

function preload() {
  handPose = ml5.handPose();
}

function setup() {
  // 1. Create the canvas and store it in a variable
  let cnv = createCanvas(640, 480);
  
  // 2. THIS IS THE KEY: Put the canvas inside the HTML div
  cnv.parent('kaleidoscope-container');
  
  video = createCapture(VIDEO);
  video.size(640, 480);
  video.hide();
  
  handPose.detectStart(video, (results) => {
    hands = results;
  });
  
  angleMode(DEGREES);
  colorMode(HSB, 360, 100, 100, 1);
}

function draw() {
  background(0); 

  // Mirrored Video 
  push();
  translate(width, 0);
  scale(-1, 1);
  image(video, 0, 0, 640, 480); 
  pop();

  for (let i = 0; i < hands.length; i++) {
    let hand = hands[i];

    let p0 = hand.keypoints[0];
    let p5 = hand.keypoints[5];
    let p17 = hand.keypoints[17];
    let centerX = (p0.x + p5.x + p17.x) / 3;
    let centerY = (p0.y + p5.y + p17.y) / 3;

    let d = dist(p0.x, p0.y, hand.keypoints[12].x, hand.keypoints[12].y);
    let targetSize = map(d, 40, 150, 0, 350, true);
    
    smoothedSizes[i] = lerp(smoothedSizes[i] || 0, targetSize, 0.1);
    rotationAngle += map(smoothedSizes[i], 0, 350, 0.5, 5);

    let x = width - centerX; 
    let y = centerY;

    push();
    translate(x, y);
    rotate(rotationAngle); 
    drawDetailedKaleidoscope(smoothedSizes[i], i);
    pop();
  }
}

function drawDetailedKaleidoscope(s, handIndex) {
  let slices = 12;
  let hueOffset = handIndex * 60; 

  for (let i = 0; i < slices; i++) {
    rotate(360 / slices);

    // Center Hexagon
    push();
    noFill();
    stroke((map(s, 0, 350, 250, 360) + hueOffset) % 360, 80, 100, 0.8);
    strokeWeight(2);
    rotate(frameCount * 2); 
    polygon(0, 0, s / 10, 6); 
    pop();

    // OUTER OVALS
    noStroke();
    fill((map(s, 0, 350, 180, 360) + hueOffset) % 360, 80, 100, 0.6);
    ellipse(s / 2, 0, s / 3, s / 5);

    // INNER DIAMONDS
    fill((map(s, 0, 350, 0, 100) + hueOffset) % 360, 100, 100, 0.8);
    push();
    translate(s / 3, 0);
    rotate(45);
    rectMode(CENTER);
    rect(0, 0, s / 8, s / 8);
    pop();

    // WHITE LINES
    stroke(255, 0.5);
    strokeWeight(1);
    line(0, 0, s, 0);

    // SPARKLES
    if (s > 100) {
      fill(255, 1);
      noStroke();
      circle(s, 0, s / 15);
    }

    // MIRROR LAYER
    push();
    scale(1, -1);
    fill((map(s, 0, 350, 180, 360) + hueOffset) % 360, 50, 100, 0.3);
    ellipse(s / 2, 5, s / 4, s / 6);
    pop();
  }
}

function polygon(x, y, radius, npoints) {
  let angle = 360 / npoints;
  beginShape();
  for (let a = 0; a < 360; a += angle) {
    let sx = x + cos(a) * radius;
    let sy = y + sin(a) * radius;
    vertex(sx, sy);
  }
  endShape(CLOSE);
}
