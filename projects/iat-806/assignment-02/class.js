class Overseer {
  constructor() {
    //is a game ongoing?
    this.playing = false;
    //has the player lost all of their lives?
    this.gameOver = false;

    this.lives = 2;
    this.score = 0;
    this.round = 0;
    this.difficulty = 3;

    this.sequence = 0;
    this.sequenceTimer = 0;

    this.invFrames = 0;
    this.maxInvFrames = 90;

    //create one instance of the interface class
    this.interface = new Interface();
    //create one instance of the menu class with the button saying "Start" and it being at height * 0.65
    this.menu = new Menu("Start", height * 0.65);
    //create one instance of the Gameover class with the menu class as its parent
    this.exit = new Gameover();
    //create a cursor. If there is no input from ml5, place in the middle
    this.cursor = new Cursor(width / 2, height / 2);
    //create an array for the targets
    this.targets = [];
    //I wanted to do something with custom target radii, but never got to it. This is just how big the targets are
    this.maxRadius = 50;
  }

  startGame() {
    //when starting the game all values are reset and a new sequence of targets is created
    this.playing = true;
    this.lives = 2;
    this.score = 0;
    this.round = 0;
    this.difficulty = 3;
    this.sequence = 0;
    this.sequenceTimer = 0;
    this.invFrames = 0;
    this.newSequence();
  }

  gameManager() {
    //always draw the background
    this.interface.drawBackground();
    //this is the general gameplay loop
    if (this.playing && !this.gameOver) {
      //show the level, lives, and score
      this.interface.show();
      //check the sequence
      this.checkSequence();
      //for every target, see if it contains the cursor and show it on screen
      this.targets.forEach((target) => {
        target.contains();
        target.show();
      });
      //this is the loop when in the main menu
    } else if (!this.playing && !this.gameOver) {
      this.menu.buttonActive();
      this.menu.show();
      //this is the loop when the player lost all their lives
    } else if (this.gameOver) {
      this.exit.buttonActive();
      this.exit.show();
    }
    //move the cursor and show it on top of everything
    this.cursor.move();
    this.cursor.show();
  }

  checkSequence() {
    //if the player's lives are below 0
    if (this.lives < 0) {
      //the game is stopped
      this.playing = false;
      //and the player is sent to the gameover menu
      this.gameOver = true;
      //all other code is halted
      return;
    }
    //always check the target's expiry
    this.expire();
    //if there is no target left in the targets array
    if (this.targets.length == 0) {
      //after 1.5 seconds have gone by
      if (this.sequenceTimer == 90) {
        //go to the next sequence
        this.sequence++;
        //check the round manager
        this.roundManager();
        //generate a new sequence of targets
        this.newSequence();
        //reset the timer
        this.sequenceTimer = 0;
      } else {
        this.sequenceTimer++;
      }
    }
  }

  roundManager() {
    //once there have been as many sequences as the difficulty, proceed to the next round and increase difficulty
    if (this.sequence == this.difficulty) {
      this.sequence = 0;
      this.round++;
      this.difficulty++;
    }
  }

  newSequence() {
    //empty the targets array
    this.targets = [];
    //create as many targets as the difficulty
    for (let i = 0; i < this.difficulty; i++) {
      this.newTarget();
    }
  }

  newTarget() {
    //create a target with a random position (within a constraint), a radius, a distinct "spawn" delay dependent on its position in the array, and a expiry value (300 is 5 seconds at 60fps)
    let target = new Target(
      random(width * 0.1 + this.maxRadius, width * 0.9 - this.maxRadius),
      random(height * 0.1 + this.maxRadius, height * 0.9 - this.maxRadius),
      this.maxRadius,
      this.targets.length * 45,
      300,
    );
    //push the target into the array
    this.targets.push(target);
  }

  expire() {
    //for every target going back instead of forth to prevent skipping values
    for (let i = this.targets.length - 1; i >= 0; i--) {
      //check if the target is expired
      if (this.targets[i].isExpired()) {
        //if so check whether the player has invincibility frames
        if (this.invincibleCheck()) {
          //if they do just remove the target
          this.targets.splice(i, 1);
        } else {
          //if they don't remove the target, a life, and give the player invincibility
          this.targets.splice(i, 1);
          this.lives--;
          this.invincible();
        }
      }
    }
  }

  invincible() {
    //from this moment MaxInvFrames into the future the player is invincible
    this.invFrames = frameCount + this.maxInvFrames;
  }

  invincibleCheck() {
    //check whether the alotted invincle time has been exceeded
    return frameCount < this.invFrames;
  }

  //this is run when the player presses the mouse
  hit() {
    //if the player is not on the main menu or on the game over screen
    if (this.playing && !this.gameOver) {
      //assume initially that the player did not hit anything
      let targetHit = false;
      //check for ever target if it was active when the player clicked (again checking backwards to prevent double numbers)
      for (let i = this.targets.length - 1; i >= 0; i--) {
        if (this.targets[i].active) {
          //determine how far the cursor was from the middle of the target and map that to a score 0-100
          let distanceScore = floor(
            map(
              dist(
                this.targets[i].x,
                this.targets[i].y,
                this.cursor.x,
                this.cursor.y,
              ),
              this.targets[i].r,
              0,
              0,
              100,
            ),
          );
          //add score to playerscore
          this.score += distanceScore;
          //if the score is above 70 play a critical hit sound and jitter the screen heavily
          if (distanceScore > 70) {
            sounds[2].play();
            this.interface.jitter(10, 10);
          } else {
            //otherwise play a regular hit sound and jitter the screen moderately
            sounds[0].play();
            this.interface.jitter(5, 5);
          }
          //every hit target is spliced out and targetHit is true
          this.targets.splice(i, 1) + 100;
          targetHit = true;
        }
      }
      //if the player did not hit anything
      if (!targetHit) {
        //play a dull hit sound and jitter the screen softly
        sounds[1].play();
        this.interface.jitter(3, 3);
      }
      //if the player is in the main menu
    } else if (!this.playing && !this.gameOver) {
      //restart the game when the player hits the start button
      if (this.menu.buttonContains()) {
        this.startGame();
      }
      //if the player is gameover
    } else if (this.gameOver) {
      if (this.exit.buttonContains()) {
        //go back to main menu when the player hits the continue button
        this.gameOver = false;
        this.playing = false;
      }
    }
  }
}

class Cursor {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.smoothing = 0.2;
  }
  move() {
    //the cursor moves according to the x and y of the ml5 keypoints. I have added a slight lerp to smoothen the jitter induced by the model
    if (poses[0]) {
      if (poses[0].keypoints[0].confidence > 0.1) {
        this.x = lerp(this.x, poses[0].keypoints[0].x, this.smoothing);
        this.y = lerp(this.y, poses[0].keypoints[0].y, this.smoothing);
      }
    }
  }

  show() {
    //show the beak as the cursor
    image(beak, this.x, this.y);
  }
}

class Target {
  constructor(x, y, r, delay, expiry) {
    this.x = x;
    this.y = y;
    this.r = r;
    //is the cursor hovering over the target?
    this.active = false;
    //the time after which this target becomes visible (to stagger their appearance)
    this.visibleFrame = frameCount + delay;
    //the time after which the target dissapears
    this.maxTime = frameCount + delay + expiry;
  }

  opacity() {
    //don't let the targets in level 1 fade away
    if (gameState.round > 0) {
      //map the framecount to the opacity value
      return constrain(
        map(frameCount, this.visibleFrame, this.maxTime, 255, 0),
        0,
        255,
      );
      //otherwise return full opacity
    } else {
      return 255;
    }
  }

  isExpired() {
    //return whether the framecount has exeeded the expiration and if this is a level beyond lvl 1
    return frameCount >= this.maxTime && gameState.round > 0;
  }

  isVisible() {
    //check whether the framecount has exceeded the set threshold to show the target
    return frameCount >= this.visibleFrame;
  }

  contains() {
    //if the target is not visible it cannot be active
    if (!this.isVisible()) {
      this.active = false;
      return;
    }
    //if the cursor is within the target it is active
    if (dist(this.x, this.y, gameState.cursor.x, gameState.cursor.y) < this.r) {
      this.active = true;
      //otherwise it is not
    } else {
      this.active = false;
    }
  }

  show() {
    //if the target is not visible don't show
    if (!this.isVisible()) {
      return;
    }

    //if the target is visible
    push();
    //depending on its mapped opacity
    tint(255, this.opacity());
    //place the target image from the center
    imageMode(CENTER);
    //if the target is active, place the green target image
    if (this.active) {
      image(targetImage[0], this.x, this.y);
      //if it is not active, place the red target image
    } else {
      image(targetImage[1], this.x, this.y);
    }
    pop();
  }
}

class Interface {
  constructor() {
    this.jFrames;
    this.jMagnitude;
    this.jDuration;
  }

  //pass on values for magnitude and duration to the variables that control the jitter
  jitter(magnitude, duration) {
    this.jMagnitude = magnitude;
    this.jFrames = duration;
    this.jDuration = duration;
  }

  drawBackground() {
    //draw the background that is not affected by the jitter
    image(mainBackground[0], 0, 0);
    push();
    //if there is a duration of jitter frames
    if (this.jFrames > 0) {
      //decrease the amount
      this.jFrames--;
      //create a falloff by dividing the frames by its initial value
      let f = this.jFrames / this.jDuration;
      //decrease the magnitude with this falloff
      let m = this.jMagnitude * f;
      //translate the background image with random movements between -m & m in both axes
      translate(random(-m, m), random(-m, m));
    }
    //draw the tree
    image(mainBackground[1], 0, 0);
    pop();
  }

  //show the lives, level, and the score (with all the zeroes, just like in mario!)
  show() {
    push();
    fill(255);
    stroke(0);
    strokeWeight(5);
    text("Lives: " + (gameState.lives + 1), width * 0.3, 40);
    text("Lvl: " + gameState.round, width * 0.1, 40);
    text(nf(gameState.score, 10), width * 0.66, 40);
    pop();
  }
}

class Menu {
  constructor(label, y) {
    this.label = label;
    this.button = { x: width / 2, y: y, w: 200, h: 60 };
    this.oc = color(255);
    this.hlc = color(255, 255, 0);
    this.c = this.oc;
  }

  buttonActive() {
    //highlight the button when it is hovered over by the cursor
    if (this.buttonContains()) {
      this.c = this.hlc;
    } else {
      this.c = this.oc;
    }
  }

  buttonContains() {
    //check whether the cursor is within the button box
    return (
      Math.abs(gameState.cursor.x - this.button.x) < this.button.w / 2 &&
      Math.abs(gameState.cursor.y - this.button.y) < this.button.h / 2
    );
  }

  show() {
    //draw everything
    push();
    fill(255);
    textAlign(CENTER, CENTER);
    textSize(40);
    stroke(0);
    strokeWeight(10);
    text("Woodpecker II:", width / 2, height * 0.15);
    textSize(30);
    text("The peckoning", width / 2, height * 0.25);
    textSize(20);
    fill(this.c);
    text(this.label, this.button.x, this.button.y);
    pop();

    push();
    noFill();
    stroke(this.c);
    strokeWeight(5);
    rectMode(CENTER);
    rect(this.button.x, this.button.y, this.button.w, this.button.h);
    pop();
  }
}

class Gameover extends Menu {
  //copy the Menu class with a slight alteration
  constructor() {
    super("Continue", height * 0.7);
  }

  show() {
    push();
    fill(255);
    textAlign(CENTER, CENTER);
    textSize(40);
    stroke(0);
    strokeWeight(10);
    text("Game Over!", width / 2, height * 0.25);
    textSize(20);
    text("Score: " + gameState.score, width / 2, height * 0.45);
    textSize(20);
    fill(this.c);
    text(this.label, this.button.x, this.button.y);
    pop();

    push();
    noFill();
    stroke(this.c);
    strokeWeight(5);
    rectMode(CENTER);
    rect(this.button.x, this.button.y, this.button.w, this.button.h);
    pop();
  }
}
