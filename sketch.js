let stage = "start-screen"; //"start-screen";

let holes = [];
let numHoles = 4;
let systems = [];
let canvas;

function setup() {
  canvas = createCanvas(windowWidth, windowHeight);

  textSize(25);
  textAlign(CENTER, CENTER);
  textStyle(BOLD);
  textFont("arial");
  let holeSizes = [150, 200, 350];

  //data for holes
  for (let i = 0; i < numHoles; i++) {
    let d = random(holeSizes); //random diameter between random(150-350)
    holes[i] = {
      x: random(d, width - d),
      y: random(d, height - d),
      xv: random(-4, 4),
      yv: random(-4, 4),
      d: d,
//       mask: ()=> {}
    };
    
    holes[i].mask = () => {
      circle(holes[i].x, holes[i].y, holes[i].d);
    };
  }

}

function draw() {
  background(10);
  switch (stage) {
    case "start-screen":
      fill(50);
      circle(mouseX, mouseY, 20);
      // rect(width/2 - 130,height/2 -15,260,30);//text area
      fill(255);
      text("See Through Hole", width / 2, height / 2);
      //mouse click on text area
      if (
        mouseX > width / 2 - 130 &&
        mouseX < width / 2 + 130 &&
        mouseY > height / 2 - 15 &&
        mouseY < height / 2 + 15
      ) {
        if (mouseIsPressed) {
          mouseIsPressed = false;
          //change stage
          stage = "see-through";
        }
      }
      break;
    case "see-through":
      background(10);

      for (let i = 0; i < numHoles; i++) {
        push();
        clip(holes[i].mask);
        
        drawParticles();
        pop();

        
        //move them around
        holes[i].x += holes[i].xv;
        holes[i].y += holes[i].yv;
        
        //bounds 
        if (
          holes[i].x - holes[i].d / 2 < 0 ||
          holes[i].x + holes[i].d / 2 > width
        ) {
          holes[i].xv *= -1; //change direction
        } else if (
          holes[i].y - holes[i].d / 2 < 0 ||
          holes[i].y + holes[i].d / 2 > height
        ) {
          holes[i].yv *= -1; //change direction
        }
      }

      for (let system of systems) {
        system.run();
        system.addParticle(); //for adding new  falling circles
      }

  }
}

function drawParticles() {
  background(25);


  for (let system of systems) {
    system.display();
  }
  //
  if (mouseIsPressed) {
    mouseIsPressed = false; //only one click happens
    systems.push(new ParticleSystem(createVector(mouseX, mouseY)));
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}








// A simple Particle class
let Particle = function (position) {
  this.acceleration = createVector(0, 0.1);
  this.velocity = createVector(random(-2, 2), random(-1, 1));
  this.position = position.copy();
  this.lifespan = 111.0;
  this.color = color(random(255), random(255), random(255));
  this.size = random(5, 10);
};

Particle.prototype.run = function () {
  this.update();
};
Particle.prototype.display = function () {
  this.display();
};

// Method to update position
Particle.prototype.update = function () {
  this.velocity.add(this.acceleration);
  this.position.add(this.velocity);
  this.lifespan -= 1;
};

// Method to display
Particle.prototype.display = function () {
  stroke(this.color);
  strokeWeight(0.8);
  fill(100, this.lifespan);
  this.size = random(10, 60);
  // 여기에서 this.size를 사용하여 파티클의 크기를 조정
  ellipse(this.position.x, this.position.y, this.size, this.size);
};


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
  if (int(random(0, 2)) == 0) {
    p = new Particle(this.origin);
  } else {
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
ParticleSystem.prototype.display = function () {
  for (let i = this.particles.length - 1; i >= 0; i--) {
    let p = this.particles[i];
    p.display();
  }
};


// A subclass of Particle

function CrazyParticle(origin) {
  
  Particle.call(this, origin);

  // Initialize our added properties
  this.theta = 0.6;
}

CrazyParticle.prototype = Object.create(Particle.prototype); 

// Set the "constructor" property to refer to CrazyParticle
CrazyParticle.prototype.constructor = CrazyParticle;

// This update() method overrides the parent class update() method
CrazyParticle.prototype.update = function () {
  Particle.prototype.update.call(this);
  // Increment rotation based on horizontal velocity
  this.theta += (this.velocity.x * this.velocity.mag()) / 10.1;
};

// This display() method overrides the parent class display() method
CrazyParticle.prototype.display = function () {
  // Render the ellipse just like in a regular particle
  Particle.prototype.display.call(this);
  // Then add a rotating line
 push();
  translate(this.position.x, this.position.y);
  rotate(this.theta);
  stroke(50, this.lifespan);
  line(0, 0, 0, 0);
  pop();
};

