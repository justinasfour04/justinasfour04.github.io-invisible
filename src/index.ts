import '../static/stylesheet/index.css';

import Controller from './controller';
import Friend from './friend';
import GameBackground from './gamebackground';
import ImageCache from './imageCache';
import ObstacleFactory from './obstacleFactory';
import { randomNumber } from './util';

const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');
canvas.width = (document.body.clientWidth / 1.1);
canvas.height = (document.body.clientHeight / 2);

const container = document.createElement('div');
container.className = 'container';

const scoreDiv = document.createElement('div');
scoreDiv.className = 'score';
const scoreText = document.createElement('p');
let score = 0;
const scoreValue = document.createElement('span');
scoreValue.textContent = score.toString(10);
scoreText.innerHTML = `Score: ${scoreValue.innerHTML}`;
scoreText.style.fontSize = '25px';
scoreDiv.appendChild(scoreText);

const titleDiv = document.createElement('div');
titleDiv.className = 'title';
const title = document.createElement('p');
title.innerText = 'INVISIBLE FRIENDS RUNNER';
title.style.fontSize = '40px';
titleDiv.appendChild(title);

container.appendChild(titleDiv);
container.appendChild(scoreDiv);
container.appendChild(canvas);

document.body.appendChild(container);

const controller = new Controller(canvas);
const friend = new Friend(ctx);
const gameBackgroud = new GameBackground(ctx, [0, canvas.width]);
const obstacleFactory = new ObstacleFactory(ctx);

const lineDash = [25, 30];
let then: number;
let elapsed: number;

function update(secondsPassed: number = 1) {
  friend.update(controller.buttonPressed);
  gameBackgroud.update(secondsPassed);
  obstacleFactory.update(secondsPassed);
}

async function draw() {
  if (ctx !== null) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = 'black';

    ctx.save();
    ctx.setLineDash([0]);
    ctx.beginPath();
    ctx.lineTo(canvas.width, 409);
    ctx.moveTo(0, 409);
    ctx.stroke();
    ctx.restore();

    ctx.save();
    ctx.setLineDash(lineDash);
    ctx.beginPath();
    ctx.moveTo(0, 460);
    ctx.lineTo(canvas.width, 460);
    ctx.stroke();
    ctx.restore();

    ctx.save();
    ctx.fillStyle = '#0083A3';
    ctx.rect(0, 0, canvas.width, 410);
    ctx.fill();
    ctx.restore();

    gameBackgroud.draw();
    obstacleFactory.drawTop();
    friend.draw();
    obstacleFactory.drawBottom();
  }
}

function setScore() {
  const closestTopObstacle = obstacleFactory.getClosestObstacle(true);
  const cloestBottomObstacle = obstacleFactory.getClosestObstacle(false);

  const topObstaclePassed = friend.passedObstacle(closestTopObstacle);
  const bottomObstaclePassed = friend.passedObstacle(cloestBottomObstacle);

  const isCollision = friend.checkCollision(closestTopObstacle)
    || friend.checkCollision(cloestBottomObstacle);

  if ((topObstaclePassed || bottomObstaclePassed) && !isCollision) {
    score += 1;
    scoreValue.textContent = score.toString(10);
    scoreText.innerHTML = `Score: ${scoreValue.innerHTML}`;
  }

  if (topObstaclePassed) {
    obstacleFactory.deleteOldestObstacle(true);
  }

  if (bottomObstaclePassed) {
    obstacleFactory.deleteOldestObstacle(false);
  }
}

async function mainLoop(frameTime?: number) {
  if (frameTime) {
    if (!then) {
      then = frameTime;
    }
    elapsed = (frameTime - then) / 1000;

    setScore();

    update(Math.min(elapsed, 0.1));

    obstacleFactory.create(randomNumber(0, 1000) % 2 === 0);
    await draw();

    then = frameTime;
    window.requestAnimationFrame(mainLoop);
  } else {
    window.requestAnimationFrame(mainLoop);
  }
}

(async () => {
  await ImageCache.loadAllImages(canvas);
  await mainLoop();
})();
