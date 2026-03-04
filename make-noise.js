let mic;
let myFont;
let allPoints = []; 
let hasPopped = false;
let explosionAlpha = 200;
let line1 = "MAKE SOME";
let line2 = "NOISE!";
let boldness = 8;     
let density = 0.12;   
let lineSpacing = 0.65; 

function preload() {
  myFont = loadFont('Laudez-3lRg8.otf');
}

function setup() {
  // Target the specific HTML container
  let canvas = createCanvas(600, 600);
  canvas.parent('make_noise-container');
  
  pixelDensity(displayDensity()); 
  colorMode(HSB, 300, 100, 100, 100);
  
  mic = new p5.AudioIn();
  mic.start();
  
  generatePoints();
}

function draw() {
  background(0, 0, 5, 100); 

  let micLevel = mic.getLevel();
  
  if (micLevel > 0.38 && !hasPopped) {
    for (let p of allPoints) {
      p.vx = random(-18, 18);
      p.vy = random(-18, 18);
    }
    hasPopped = true;
  }

  if (micLevel < 0.1 && explosionAlpha < 5) {
    generatePoints();
    hasPopped = false;
    explosionAlpha = 255;
  }

  noStroke();
  let currentHue = map(micLevel, 0, 0.4, 190, 330);
  blendMode(ADD);

  for (let i = allPoints.length - 1; i >= 0; i--) {
    let p = allPoints[i];
    if (!hasPopped) {
      let jitter = micLevel * 15;
      let x = p.x + random(-jitter, jitter);
      let y = p.y + random(-jitter, jitter);
      fill(currentHue, 80, 100, 70); 
      circle(x, y, boldness);
    } else {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.25; 
      p.vx *= 0.97; 
      explosionAlpha -= 0.15; 
      fill(currentHue, 80, 100, explosionAlpha);
      circle(p.x, p.y, boldness * 0.8); 
    }
  }
  blendMode(BLEND); 
}

function generatePoints() {
  allPoints = [];
  let fs = min(width, height) * 0.165; 
  let b1 = myFont.textBounds(line1, 0, 0, fs);
  let b2 = myFont.textBounds(line2, 0, 0, fs);

  let p1 = myFont.textToPoints(line1, width/2 - b1.w/2, height/2 - (fs * lineSpacing), fs, { sampleFactor: density });
  let p2 = myFont.textToPoints(line2, width/2 - b2.w/2, height/2 + (fs * lineSpacing), fs, { sampleFactor: density });

  for (let p of p1) allPoints.push({ x: p.x, y: p.y, vx: 0, vy: 0 });
  for (let p of p2) allPoints.push({ x: p.x, y: p.y, vx: 0, vy: 0 });
}

function mousePressed() {
  if (mouseX > 0 && mouseX < width && mouseY > 0 && mouseY < height) {
    userStartAudio();
  }
}
