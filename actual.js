let bird
let gravity = 0.6
let lift = -15
let velocity = 0
let pipes = []
let clouds = []
let score = 0
let gameOver = false

function setup() {
  createCanvas(1280, 720)
  bird = createVector(50, height / 2)
  pipes.push(new Pipe())
  for (let i = 0; i < 5; i++) {
    clouds.push(new Cloud())
  }
}

function draw() {
  background("skyblue")

  if (gameOver) {
    noStroke()
    fill("black")
    textSize(64)
    text("GAME OVER", width / 4, height / 2)
    showScore()
    noLoop()
    return
  }

  // Draw clouds.
  clouds.forEach((cloud, index) => {
    cloud.show()
    cloud.update()
    if (cloud.offscreen()) {
      clouds.splice(index, 1, new Cloud(true))
    }
  })

  // Draw pipes.
  for (let i = pipes.length - 1; i >= 0; i--) {
    pipes[i].show()
    pipes[i].update()

    if (pipes[i].hits(bird)) {
      gameOver = true
    }

    if (pipes[i].offscreen()) {
      pipes.splice(i, 1)
      score++
    }
  }

  // Draw bird
  bird.y += velocity
  velocity += gravity
  velocity *= 0.9
  fill("yellow")
  ellipse(bird.x, bird.y, 60, 60)

  // Bird's beak
  fill("orange")
  triangle(bird.x + 30, bird.y - 10, bird.x + 50, bird.y, bird.x + 30, bird.y + 10)

  // Bird's eye
  stroke(200)
  fill("white")
  ellipse(bird.x + 20, bird.y - 10, 20, 20)
  // Dynamically adjust pupil based on velocity
  let pupilY = bird.y - 10 + constrain(velocity, -5, 5)
  fill("black")
  ellipse(bird.x + 20, pupilY, 10, 10)

  // Add new pipes
  if (frameCount % 100 == 0) {
    pipes.push(new Pipe())
  }

  showScore()
}

function keyPressed() {
  if (key == " ") {
    velocity += lift
  }
}

function showScore() {
  fill("white")
  textSize(20)
  text("Score: " + score, 10, 30)
}

class Pipe {
  constructor() {
    this.top = random(height / 2)
    this.bottom = this.top + random(125, 200)
    this.x = width
    this.w = 45
    this.speed = 2 + frameCount / 1000
  }

  show() {
    stroke("lime")
    fill("green")
    rect(this.x, 0, this.w, this.top)
    rect(this.x, this.bottom, this.w, height - this.bottom)
    noStroke()
  }

  update() {
    // Move across the screen based on the speed
    this.x -= this.speed
  }

  offscreen() {
    return this.x < -this.w
  }

  hits(object) {
    if (object.y < this.top || object.y > this.bottom) {
      if (object.x > this.x && object.x < this.x + this.w) {
        return true
      }
    }
    return false
  }
}

class Cloud {
  constructor(offscreen = false) {
    this.x = offscreen ? width + 100 : random(width)
    this.y = random(height / 3) // Top part of sky
    this.size = random(50, 100)
    this.transparency = random(50, 200)
  }

  show() {
    noStroke()
    fill(255, 255, 255, this.transparency)
    ellipse(this.x, this.y, this.size, this.size / 2)
  }

  update() {
    // Clouds slower than pipes = parallax effect
    this.x -= 1
  }

  offscreen() {
    return this.x < -this.size
  }
}
