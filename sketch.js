// Global variables
let systems = [];
let showScreenLayer = false; // Initially, the screen layer with holes is not shown
let textClicked = false;

let holes = [];
let numHoles = 9; // 원하는 원의 개수
let holeDiameter = 200; // 원의 지름
let maxAttempts = 100; // 겹치지 않는 위치를 찾기 위한 최대 시도 횟수

// 추가된 변수 초기화
let x, y; // 마우스 추적을 위한 변수

function setup() {
  createCanvas(windowWidth, windowHeight);
  x = width / 2;
  y = height / 2;

  // Define your specific sizes here
  let holeSizes = [300, 450, 600]; 

  // 초기 파티클 시스템 생성
  systems.push(new ParticleSystem(createVector(width / 2, height / 2)));

  // 구멍 생성 로직...
  for (let i = 0; i < numHoles; i++) {
    let attempts = 0;
    while (attempts < maxAttempts) {
      let holeDiameter = random(holeSizes); // Randomize the diameter between 100 and 300
      let hole = {
        x: random(holeDiameter / 2, width - holeDiameter / 2),
        y: random(holeDiameter / 2, height - holeDiameter / 2),
        diameter: holeDiameter,
        vx: random(-2, 2),
        vy: random(-2, 2)
      };

      let overlapping = false;
      for (let other of holes) {
        let d = dist(hole.x, hole.y, other.x, other.y);
        if (d < hole.diameter / 2 + other.diameter / 2) {
          overlapping = true;
          break;
        }
      }

      if (!overlapping) {
        holes.push(hole);
        break;
      }

      attempts++;
    }
  }
}


function draw() {
  background(50); // Set the background color
  
  // If the "See Through Hole" text has been clicked, we run the particle systems.
  if (showScreenLayer) {
    systems.forEach((system) => {
      system.run();
      system.addParticle();
    });
  }

  // Display "See Through Hole" text only if it hasn't been clicked yet.
  if (!textClicked) {
    displayInstructions();
  }
  
  // If the text has been clicked, show the masking layer.
  if (showScreenLayer) {
    drawMaskingLayer();
    updateHoles();
  }
}

function drawMaskingLayer() {
  fill(30);
  noStroke();
  rect(0, 0, width, height); // Draw a rectangle to cover the entire screen

  erase(); // Enable eraser
  holes.forEach(hole => {
    ellipse(hole.x, hole.y, hole.diameter, hole.diameter); // Draw transparent circles
  });
  noErase(); // Disable eraser
}

function mousePressed() {
  // Toggle the masking layer when clicking the "See Through Hole" text
  if (!textClicked && mouseX > width / 2 - 100 && mouseX < width / 2 + 100 && mouseY > height / 2 - 16 && mouseY < height / 2 + 16) {
    textClicked = true;
    showScreenLayer = true;
  } else if (showScreenLayer) {
    // Add a new particle system at the mouse position if the masking layer is shown
    systems.push(new ParticleSystem(createVector(mouseX, mouseY)));
  }
}



  

// 다른 함수들(drawMaskingLayer, updateHoles, displayInstructions, Particle, ParticleSystem, CrazyParticle) 정의는 동일하게 유지합니다.


function isHoleSafe(newHole, holes) {
  for (let hole of holes) {
    let d = dist(newHole.x, newHole.y, hole.x, hole.y);
    if (d < newHole.diameter / 2 + hole.diameter / 2) {
      return false;
    }
  }
  return true;
}

// drawMaskingLayer, updateHoles, displayInstructions, Particle, ParticleSystem, CrazyParticle 함수 정의는 동일합니다.

  

  
function updateHoles() {
  holes.forEach(hole => {
    hole.x += hole.vx;
    hole.y += hole.vy;

    // 화면 경계에서 반사
    if (hole.x <= 0 || hole.x >= width) hole.vx *= -1;
    if (hole.y <= 0 || hole.y >= height) hole.vy *= -1;
  });
}


function displayInstructions() {
  fill(255); // Set text color to white
  textAlign(CENTER, CENTER);
  textSize(32);
  text("See Through Hole", width / 2, height / 2);
}

function drawMaskingLayer() {
  fill(20);
  noStroke();

  // Drawing the masking layer
  rect(0, 0, width, height); // Draw a rectangle to cover the entire screen

  erase();
  holes.forEach(hole => {
    ellipse(hole.x, hole.y, hole.diameter, hole.diameter);
  });
  noErase();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}


function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}







// A simple Particle class
let Particle = function(position) {
  this.acceleration = createVector(0, 0.05);
  this.velocity = createVector(random(-2, 2), random(-1, 1));
  this.position = position.copy();
  this.lifespan = 111.0;
  this.color = color(random(255), random(255), random(255));
  this.size = random(5, 10);
};

Particle.prototype.run = function() {
  this.update();
  this.display();
};

// Method to update position
Particle.prototype.update = function(){
  this.velocity.add(this.acceleration);
  this.position.add(this.velocity);
  this.lifespan -= 1;
};


// Method to display
Particle.prototype.display = function () {
    stroke(this.color);
    strokeWeight(0.5);
    fill(100, this.lifespan);
    this.size = random(5, 50);
    // 여기에서 this.size를 사용하여 파티클의 크기를 조정
    ellipse(this.position.x, this.position.y, this.size, this.size);
  };

// Is the particle still useful?
Particle.prototype.isDead = function () {
  if (this.lifespan < 0) {
    return true;
  } else {
    return false;
  }
};

let ParticleSystem = function (position) {
  this.origin = position.copy();
  this.particles = [];
};

ParticleSystem.prototype.addParticle = function () {
  // Add either a Particle or CrazyParticle to the system
  if (int(random(0, 10)) == 0) {
    p = new Particle(this.origin);
  }
  else {
    p = new CrazyParticle(this.origin);
  }
  this.particles.push(p);
};

ParticleSystem.prototype.run = function () {
  for (let i = this.particles.length - 1; i >= 0; i--) {
    let p = this.particles[i];
    p.run();
    if (p.isDead()) {
      this.particles.splice(i, 1);
    }
  }
};

// A subclass of Particle

function CrazyParticle(origin) {
  // Call the parent constructor, making sure (using Function#call)
  // that "this" is set correctly during the call
  Particle.call(this, origin);

  // Initialize our added properties
  this.theta = 0.20;
};


CrazyParticle.prototype = Object.create(Particle.prototype); // See note below

// Set the "constructor" property to refer to CrazyParticle
CrazyParticle.prototype.constructor = CrazyParticle;

// Notice we don't have the method run() here; it is inherited from Particle

// This update() method overrides the parent class update() method
CrazyParticle.prototype.update=function() {
  Particle.prototype.update.call(this);
  // Increment rotation based on horizontal velocity
  this.theta += (this.velocity.x * this.velocity.mag()) / 10.10;
}

// This display() method overrides the parent class display() method
CrazyParticle.prototype.display=function() {
  // Render the ellipse just like in a regular particle
  Particle.prototype.display.call(this);
  // Then add a rotating line
  push();
  translate(this.position.x, this.position.y);
  rotate(this.theta);
  stroke(100, this.lifespan);
  line(0, 0, 0, 0);
  pop();
}
