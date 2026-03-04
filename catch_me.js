let letters = [];
const sentence = "CATCH  ME";
const fontSize = 100;
const catchRadius = 120;
const returnStrength = 0.08;
const driftStrength = 0.04;
const friction = 0.85;
const spreadForce = 0.002;
const lockDistance = 15;
const lockDuration = 180; 

function setup() {
  let canvas = createCanvas(600, 600);
  canvas.parent('catch_me-container');
  textFont('Arial Black');
  textAlign(CENTER, CENTER);
  initLetters();
}

function initLetters() {
  letters = [];
  textSize(fontSize);
  const charWidths = sentence.split('').map(c => textWidth(c));
  let totalWidth = charWidths.reduce((a, b) => a + b, 0);
  let currentX = width / 2 - totalWidth / 2;

  for (let i = 0; i < sentence.length; i++) {
    const char = sentence[i];
    const w = textWidth(char);
    letters.push({
      char,
      homeX: currentX + w / 2,
      homeY: height / 2,
      x: currentX + w / 2 + random(-100, 100),
      y: height / 2 + random(-100, 100),
      vx: 0, vy: 0, angle: 0, vAngle: 0,
      size: fontSize,
      isCaught: false, isLocked: false,
      lockTimer: 0, noiseOffset: random(1000)
    });
    currentX += w;
  }
}

function draw() {
  background(245, 242, 237);
  
  // Grid and Border
  stroke(20, 20, 20, 15);
  for (let i = 0; i < width; i += 50) line(i, 0, i, height);
  for (let i = 0; i < height; i += 50) line(0, i, width, i);
  noFill(); stroke(20, 20, 20, 40); rect(0, 0, width, height);

  for (let l of letters) {
    const dToMouse = dist(mouseX, mouseY, l.x, l.y);
    const dToHome = dist(l.x, l.y, l.homeX, l.homeY);

    if (l.lockTimer > 0) {
      l.lockTimer--;
      l.isLocked = true;
      l.x = lerp(l.x, l.homeX, 0.2);
      l.y = lerp(l.y, l.homeY, 0.2);
      l.angle = lerp(l.angle, 0, 0.2);
    } else {
      l.isLocked = false;
      if (dToMouse < catchRadius) {
        l.isCaught = true;
        l.vx += (l.homeX - l.x) * returnStrength;
        l.vy += (l.homeY - l.y) * returnStrength;
        if (dToHome < lockDistance) l.lockTimer = lockDuration;
      } else {
        l.isCaught = false;
        l.vx += (l.x - l.homeX) * spreadForce;
        l.vy += (l.y - l.homeY) * spreadForce;
        l.vx += (noise(l.noiseOffset + frameCount * 0.005) - 0.5) * driftStrength * 10;
        l.vy += (noise(l.noiseOffset + 100 + frameCount * 0.005) - 0.5) * driftStrength * 10;
        l.vAngle += random(-0.02, 0.02);
      }
      l.vx *= friction; l.vy *= friction; l.vAngle *= friction;
      l.x += l.vx; l.y += l.vy; l.angle += l.vAngle;
    }

    push();
    translate(l.x, l.y);
    rotate(radians(l.angle));
    textSize(l.size);
    noStroke();
    if (l.isLocked) {
      fill(20, 20, 20); text(l.char, 0, 0);
    } else if (l.isCaught) {
      fill(20, 20, 20, 220); text(l.char, random(-2, 2), random(-2, 2));
    } else {
      fill(20, 20, 20, 150); text(l.char, 0, 0);
    }
    pop();
  }

  // Mouse Ring
  push();
  noFill(); stroke(20, 20, 20, 50); strokeWeight(1.5);
  if (drawingContext.setLineDash) drawingContext.setLineDash([15, 10]);
  ellipse(mouseX, mouseY, catchRadius * 2, catchRadius * 2);
  pop();
}
