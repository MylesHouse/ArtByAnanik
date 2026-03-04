const catchMeSketch = (p) => {
  let letters = [];
  const sentence = "CATCH  ME", fontSize = 100, catchRadius = 120;

  p.setup = () => {
    p.createCanvas(600, 600);
    p.textFont('Arial Black'); p.textAlign(p.CENTER, p.CENTER);
    initLetters();
  };

  function initLetters() {
    p.textSize(fontSize);
    let currentX = p.width / 2 - sentence.split('').reduce((a, b) => a + p.textWidth(b), 0) / 2;
    for (let char of sentence) {
      let w = p.textWidth(char);
      letters.push({ char, homeX: currentX + w/2, homeY: p.height/2, x: currentX + w/2 + p.random(-100, 100), y: p.height/2 + p.random(-100, 100), vx: 0, vy: 0, angle: 0, vAngle: 0, lockTimer: 0, noiseOffset: p.random(1000) });
      currentX += w;
    }
  }

  p.draw = () => {
    p.background(245, 242, 237);
    letters.forEach(l => {
      let dMouse = p.dist(p.mouseX, p.mouseY, l.x, l.y), dHome = p.dist(l.x, l.y, l.homeX, l.homeY);
      if (l.lockTimer > 0) { l.lockTimer--; l.x = p.lerp(l.x, l.homeX, 0.2); l.y = p.lerp(l.y, l.homeY, 0.2); l.angle = p.lerp(l.angle, 0, 0.2); }
      else {
        if (dMouse < catchRadius) { l.vx += (l.homeX - l.x) * 0.08; l.vy += (l.homeY - l.y) * 0.08; if (dHome < 15) l.lockTimer = 180; }
        else { l.vx += (p.noise(l.noiseOffset + p.frameCount * 0.005) - 0.5); l.vAngle += p.random(-0.02, 0.02); }
        l.vx *= 0.85; l.vy *= 0.85; l.x += l.vx; l.y += l.vy; l.angle += l.vAngle;
      }
      p.push(); p.translate(l.x, l.y); p.rotate(p.radians(l.angle)); p.fill(20); p.text(l.char, 0, 0); p.pop();
    });
  };
};
new p5(catchMeSketch, 'catch_me-container');
