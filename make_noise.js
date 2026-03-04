const makeNoiseSketch = (p) => {
  let mic, myFont;
  let allPoints = []; 
  let hasPopped = false;
  let explosionAlpha = 200;
  let line1 = "MAKE SOME", line2 = "NOISE!";
  let boldness = 8, density = 0.12, lineSpacing = 0.65; 

  p.preload = () => {
    myFont = p.loadFont('Laudez-3lRg8.otf');
  };

  p.setup = () => {
    let canvas = p.createCanvas(600, 600);
    p.pixelDensity(p.displayDensity()); 
    p.colorMode(p.HSB, 300, 100, 100, 100);
    mic = new p5.AudioIn();
    mic.start();
    generatePoints();
  };

  p.draw = () => {
    p.background(0, 0, 5, 100); 
    let micLevel = mic.getLevel();
    if (micLevel > 0.38 && !hasPopped) {
      allPoints.forEach(pt => { pt.vx = p.random(-18, 18); pt.vy = p.random(-18, 18); });
      hasPopped = true;
    }
    if (micLevel < 0.1 && explosionAlpha < 5) {
      generatePoints();
      hasPopped = false;
      explosionAlpha = 255;
    }
    p.noStroke();
    let currentHue = p.map(micLevel, 0, 0.4, 190, 330);
    p.blendMode(p.ADD);
    for (let i = allPoints.length - 1; i >= 0; i--) {
      let pt = allPoints[i];
      if (!hasPopped) {
        let jitter = micLevel * 15;
        p.fill(currentHue, 80, 100, 70); 
        p.circle(pt.x + p.random(-jitter, jitter), pt.y + p.random(-jitter, jitter), boldness);
      } else {
        pt.x += pt.vx; pt.y += pt.vy; pt.vy += 0.25; pt.vx *= 0.97; 
        explosionAlpha -= 0.15; 
        p.fill(currentHue, 80, 100, explosionAlpha);
        p.circle(pt.x, pt.y, boldness * 0.8); 
      }
    }
    p.blendMode(p.BLEND);
  };

  function generatePoints() {
    allPoints = [];
    let fs = p.min(p.width, p.height) * 0.165; 
    let b1 = myFont.textBounds(line1, 0, 0, fs);
    let b2 = myFont.textBounds(line2, 0, 0, fs);
    let p1 = myFont.textToPoints(line1, p.width/2 - b1.w/2, p.height/2 - (fs * lineSpacing), fs, { sampleFactor: density });
    let p2 = myFont.textToPoints(line2, p.width/2 - b2.w/2, p.height/2 + (fs * lineSpacing), fs, { sampleFactor: density });
    p1.forEach(pt => allPoints.push({ x: pt.x, y: pt.y, vx: 0, vy: 0 }));
    p2.forEach(pt => allPoints.push({ x: pt.x, y: pt.y, vx: 0, vy: 0 }));
  }

  p.mousePressed = () => {
    if (p.mouseX > 0 && p.mouseX < p.width && p.mouseY > 0 && p.mouseY < p.height) p.userStartAudio();
  };
};
// Start the sketch in its container
new p5(makeNoiseSketch, 'make_noise-container');
