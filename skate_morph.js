let font;
let fontSize = 150;
let speed = 0.05; 
let words = ["SKATE", "FLOW", "MOVE", "JUMP"];
let currentIndex = 0;
let currentPoints = []; 
let targetPoints = [];  
let morphPoints = [];   
let isPlaying = true;

function preload() {
  font = loadFont('rad-std.otf');
}

function setup() {
  let canvas = createCanvas(600, 600);
  canvas.parent('skate_morph-container');
  setupMorph(currentIndex);
}

function draw() {
  background(245, 244, 240); 
  noFill();
  stroke(20);
  strokeWeight(2);

  beginShape();
  for (let i = 0; i < morphPoints.length; i++) {
    vertex(morphPoints[i].x, morphPoints[i].y);
    if (isPlaying) {
      morphPoints[i].x = lerp(morphPoints[i].x, targetPoints[i].x, speed);
      morphPoints[i].y = lerp(morphPoints[i].y, targetPoints[i].y, speed);
    }
  }
  endShape(CLOSE);

  for (let i = 0; i < morphPoints.length; i += 10) {
    fill(255, 80, 0);
    noStroke();
    circle(morphPoints[i].x, morphPoints[i].y, 4);
  }
  
  fill(0, 150);
  noStroke();
  textSize(12);
  textAlign(CENTER);
  text("CLICK CANVAS TO MORPH", width/2, height - 40);
}

function mousePressed() {
  if (mouseX > 0 && mouseX < width && mouseY > 0 && mouseY < height) {
    currentIndex = (currentIndex + 1) % words.length;
    setupMorph(currentIndex);
  }
}

function setupMorph(wordIdx) {
  let nextIdx = (wordIdx + 1) % words.length;
  let pts1 = getPointsForWord(words[wordIdx]);
  let pts2 = getPointsForWord(words[nextIdx]);
  let matched = matchPoints(pts1, pts2);
  currentPoints = matched.a;
  targetPoints = matched.b;
  morphPoints = [];
  for (let p of currentPoints) {
    morphPoints.push({ x: p.x, y: p.y });
  }
}

function getPointsForWord(txt) {
  let bbox = font.textBounds(txt, 0, 0, fontSize);
  let x = width / 2 - bbox.w / 2;
  let y = height / 2 + bbox.h / 2;
  return font.textToPoints(txt, x, y, fontSize, { sampleFactor: 0.1, simplifyThreshold: 0 });
}

function matchPoints(arr1, arr2) {
  let max = Math.max(arr1.length, arr2.length);
  let a = [...arr1];
  let b = [...arr2];
  while (a.length < max) {
    let rand = floor(random(arr1.length));
    a.push({ x: arr1[rand].x, y: arr1[rand].y });
  }
  while (b.length < max) {
    let rand = floor(random(arr2.length));
    b.push({ x: arr2[rand].x, y: arr2[rand].y });
  }
  return { a, b };
}
