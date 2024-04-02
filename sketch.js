// Global variables
var i = 0;
let systems = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  systems = [];
}

function draw() {
  background(0);
  
  // Draw interactive ellipse
  stroke(255);
  strokeWeight(10);
  noFill();
  ellipse(250, mouseY, 200 + i);

  // Run the particle system
  for (let j = systems.length - 1; j >= 0; j--) {
    systems[j].run();
    systems[j].addParticle();
  }
  
  // Display instructions if there are no particle systems
  if (systems.length === 0) {
    displayInstructions();
  }
}

function mouseWheel(event) {
  i += event.delta;
}

function mousePressed() {
  this.p = new ParticleSystem(createVector(mouseX, mouseY));
  systems.push(p);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function displayInstructions() {
  fill(255);
  textAlign(CENTER);
  textSize(32);
  text("See Through Hole", width / 2, height / 2);
}




function setup() {
  createCanvas(windowWidth, windowHeight);
  systems = [];
}

function draw() {
  background(51);
  background(0);
  for (i = 0; i < systems.length; i++) {
    systems[i].run();
    systems[i].addParticle();
  }
  if (systems.length == 0) {
    fill(100);
    textAlign(CENTER);
    textSize(32);
    text("See Through Hole", width / 2, height / 2);
  }
}

function mousePressed() {
  this.p = new ParticleSystem(createVector(mouseX, mouseY));
  systems.push(p);
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
  this.lifespan -= 2;
};


// Method to display
Particle.prototype.display = function () {
    stroke(this.color);
    strokeWeight(0.5);
    fill(100, this.lifespan);
    this.size = random(5, 100);
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
  if (int(random(0, 3)) == 0) {
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
  this.theta = 0.0;
};


CrazyParticle.prototype = Object.create(Particle.prototype); // See note below

// Set the "constructor" property to refer to CrazyParticle
CrazyParticle.prototype.constructor = CrazyParticle;

// Notice we don't have the method run() here; it is inherited from Particle

// This update() method overrides the parent class update() method
CrazyParticle.prototype.update=function() {
  Particle.prototype.update.call(this);
  // Increment rotation based on horizontal velocity
  this.theta += (this.velocity.x * this.velocity.mag()) / 10.0;
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
