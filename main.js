var AM = new AssetManager();

function Animation(spriteSheet, startX, startY, frameWidth, frameHeight, sheetWidth, frameDuration, frames, loop, scale) {
    this.spriteSheet = spriteSheet;
    this.startX = startX;
    this.startY = startY;
    this.frameWidth = frameWidth;
    this.frameDuration = frameDuration;
    this.frameHeight = frameHeight;
    this.sheetWidth = sheetWidth;
    this.frames = frames;
    this.totalTime = frameDuration * frames;
    this.elapsedTime = 0;
    this.loop = loop;
    this.scale = scale;
}

Animation.prototype.drawFrame = function (entity, tick, ctx, x, y) {
    this.elapsedTime += tick;
    if (this.isDone()) {
        if (this.loop) this.elapsedTime = 0;
    }
    var frame = this.currentFrame();
    var xindex = 0;
    var yindex = 0;
    xindex = frame % this.sheetWidth;
    yindex = Math.floor(frame / this.sheetWidth);


    switch (entity.state) {
        case 'left':
            ctx.drawImage(this.spriteSheet, this.startX +
                (this.currentFrame() * this.frameWidth),
                this.startY, this.frameWidth, this.frameHeight,
                x, y, this.frameWidth * this.scale,
                this.frameHeight * this.scale);
            break;

        case 'right':
            ctx.drawImage(this.spriteSheet, this.startX +
                (this.currentFrame() * this.frameWidth),
                this.startY, this.frameWidth, this.frameHeight,
                x, y, this.frameWidth * this.scale,
                this.frameHeight * this.scale);
            break;

        case 'down':
            ctx.drawImage(this.spriteSheet, this.startX +
                (this.currentFrame() * this.frameWidth),
                this.startY, this.frameWidth, this.frameHeight,
                x, y, this.frameWidth * this.scale,
                this.frameHeight * this.scale);
            break;

        case 'idle':
            ctx.drawImage(this.spriteSheet, this.startX +
                (this.currentFrame() * this.frameWidth),
                this.startY, this.frameWidth, this.frameHeight,
                x, y, this.frameWidth * this.scale,
                this.frameHeight * this.scale);
            break;

        case 'star':
            ctx.drawImage(this.spriteSheet, 0,
                this.currentFrame() * this.frameHeight, this.frameWidth, this.frameHeight,
                x, y, this.frameWidth * this.scale,
                this.frameHeight * this.scale);

            if (entity.counter >= 24) {
                entity.counter = 0;
            } else {
                entity.counter = this.currentFrame();
            }
            break;

        default:
            ctx.drawImage(this.spriteSheet, this.startX,
                this.startY, this.frameWidth, this.frameHeight,
                x, y, this.frameWidth * this.scale,
                this.frameHeight * this.scale);
            break;
    }

}

Animation.prototype.currentFrame = function () {
    return Math.floor(this.elapsedTime / this.frameDuration);
};

Animation.prototype.isDone = function () {
    return (this.elapsedTime >= this.totalTime);
};

// no inheritance
function Background(game, spritesheet) {
    this.name = 'Background';
    this.x = 0;
    this.y = 0;
    this.spritesheet = spritesheet;
    this.game = game;
    this.ctx = game.ctx;
}

Background.prototype.draw = function () {
    this.ctx.drawImage(this.spritesheet,
                   this.x, this.y);
};

Background.prototype.update = function () {
};

function Alien(game, spritesheet) {
    this.name = 'Alien';
    this.animations = this.animationInit(spritesheet);
    this.x = 500;
    this.y = 424;
    this.speed = 0;
    this.game = game;
    this.ctx = game.ctx;
    this.state = 'idle';
    this.direction = 'right';
}

Alien.prototype.animationInit = function (spritesheet) {
    let animations = [];
    animations['leftWalk'] = new Animation(spritesheet, 0, 36, 28, 36, 6, 0.038, 6, true, 1.8);
    animations['rightWalk'] = new Animation(spritesheet, 0, 0, 28, 36, 6, 0.038, 6, true, 1.8);
    animations['rightIdle'] = new Animation(spritesheet, 0, 72, 32, 36, 6, 0.11, 6, true, 1.8);
    animations['leftIdle'] = new Animation(spritesheet, 0, 108, 32, 36, 6, 0.11, 6, true, 1.8);
    animations['rightRoll'] = new Animation(spritesheet, 0, 144, 26, 36, 6, 0.05, 4, true, 1.8);
    animations['leftRoll'] = new Animation(spritesheet, 0, 180, 26, 36, 6, 0.05, 4, true, 1.8);
    return animations;
};

Alien.prototype.update = function () {
    // Update the speed of the Alien based on it's state.
    switch (this.game.userInput) {
        case 'idle':
            this.state = 'idle';
            this.speed = 0;
            break;
        case 'right':
            this.state = 'right';
            this.direction = 'right';
            this.speed = 286;
            break;
        case 'left':
            this.state = 'left';
            this.direction = 'left';
            this.speed = -286;
            break;
        case 'down':
            this.state = 'down';
            if (this.direction === 'right') {
                this.speed = 378;
            } else {
                this.speed = -378;
            }
            break;
    }

    this.x += this.game.clockTick * this.speed;

    if (this.x > 1024) {
        this.x = -27
    } else if (this.x < -27) {
        this.x = 1024;
    }

    Entity.prototype.update.call(this);
};

Alien.prototype.draw = function () {
    switch (this.state) {
        case 'left':
            this.animations['leftWalk'].drawFrame(this, this.game.clockTick, this.ctx, this.x, this.y);
            break;

        case 'right':
            this.animations['rightWalk'].drawFrame(this, this.game.clockTick, this.ctx, this.x, this.y);
            break;

        case 'down':
            if (this.direction === 'right') {
                this.animations['rightRoll'].drawFrame(this, this.game.clockTick, this.ctx, this.x, this.y);
            } else if (this.direction === 'left') {
                this.animations['leftRoll'].drawFrame(this, this.game.clockTick, this.ctx, this.x, this.y);
            }
            break;

        case 'idle':
            if (this.direction === 'right') {
                this.animations['rightIdle'].drawFrame(this, this.game.clockTick, this.ctx, this.x, this.y);
            } else if (this.direction === 'left') {
                this.animations['leftIdle'].drawFrame(this, this.game.clockTick, this.ctx, this.x, this.y);
            }

            break;
    }
};

function ShootingStar(game, spritesheet) {
    this.name = 'Star';
    this.animations = new Animation(spritesheet, 0, 0, 164, 34, 1, 0.09, 24, true, 1.6);
    this.x = 80;
    this.y = 40;
    this.speed = 0;
    this.game = game;
    this.ctx = game.ctx;
    this.state = 'star';
}

ShootingStar.prototype.update = function () {

};

ShootingStar.prototype.draw = function () {
    this.animations.drawFrame(this, this.game.clockTick, this.ctx, this.x, this.y);
};

function SlowStar(game, spritesheet) {
    this.name = 'Star';
    this.animations = new Animation(spritesheet, 0, 0, 164, 34, 1, 0.15, 24, true, 0.6);
    this.x = 800;
    this.y = 240;
    this.speed = 0;
    this.game = game;
    this.ctx = game.ctx;
    this.state = 'star';
}

SlowStar.prototype.update = function () {

};

SlowStar.prototype.draw = function () {
    this.animations.drawFrame(this, this.game.clockTick, this.ctx, this.x, this.y);
};


AM.queueDownload("./img/bg.png");
AM.queueDownload("./img/alienSprites.png");
AM.queueDownload("./img/star.png");
AM.queueDownload('./img/starReverse.png');

AM.downloadAll(function () {
    var canvas = document.getElementById("gameWorld");
    var ctx = canvas.getContext("2d");

    var gameEngine = new GameEngine();
    gameEngine.init(ctx);
    gameEngine.start();
    gameEngine.startInput();

    gameEngine.addEntity(new Background(gameEngine, AM.getAsset("./img/bg.png")));
    gameEngine.addEntity(new Alien(gameEngine, AM.getAsset("./img/alienSprites.png")));
    gameEngine.addEntity(new ShootingStar(gameEngine, AM.getAsset("./img/star.png")));
    gameEngine.addEntity(new SlowStar(gameEngine, AM.getAsset("./img/starReverse.png")));


    console.log("All Done!");
});
