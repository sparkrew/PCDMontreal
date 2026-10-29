let img;
let imgW, imgH;   // taille de l'image affichée (calculée automatiquement)

// ---- Réglages, en proportion de l'image (0 à 1) ----
let centerXRatio = 0.333;   // position horizontale du milieu des deux yeux
let centerYRatio = 0.327;   // position verticale des yeux
let eyeSizeRatio = 0.025;   // diamètre d'un oeil, par rapport à la largeur de l'image
let eyeGapRatio = 0.08;   // écart entre les centres des yeux, par rapport à la largeur
let pupilSize = 0.5;       // pupille, en fraction de l'oeil
let lidAngle = 0.12;       // 0 = paupière sur la moitié haute, plus grand = oeil plus ouvert
// -----------------------------------------------------

// valeurs en pixels, recalculées à partir des proportions
let centerX, centerY, eyeSize, eyeGap;

async function setup() {
  img = await loadImage('creepy_doll.jpg');
  computeLayout();
  createCanvas(imgW, imgH);
  image(img, 0, 0, imgW, imgH);
}

function windowResized() {
  computeLayout();
  resizeCanvas(imgW, imgH);
  image(img, 0, 0, imgW, imgH);
}

// calcule la taille de l'image sans déformation et la position des yeux
function computeLayout() {
  let s = min(windowWidth / img.width, windowHeight / img.height);
  imgW = img.width * s;
  imgH = img.height * s;

  centerX = centerXRatio * imgW;
  centerY = centerYRatio * imgH;
  eyeSize = eyeSizeRatio * imgW;
  eyeGap = eyeGapRatio * imgW;
}

function draw() {
  if (!imgW) return;   // attend que l'image soit chargée
  drawEye(centerX - eyeGap / 2, centerY);
  drawEye(centerX + eyeGap / 2, centerY);
}

function drawEye(x, y) {
  // blanc de l'oeil
  fill(100);
  stroke(0);
  strokeWeight(eyeSize * 0.03);
  circle(x, y, eyeSize);

  // pupille : suit la souris et reste dans l'oeil
  let pupilD = eyeSize * pupilSize;
  let maxOffset = (eyeSize - pupilD) / 2 - eyeSize * 0.03;
  let angle = atan2(mouseY - y, mouseX - x);
  let d = min(maxOffset, dist(x, y, mouseX, mouseY));
  fill(0);
  circle(x + cos(angle) * d, y + sin(angle) * d, pupilD);

  // paupière noire
  fill(0);
  noStroke();
  arc(x, y, eyeSize, eyeSize, PI + lidAngle, TWO_PI - lidAngle, CHORD);
}