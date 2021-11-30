let createjs = window.createjs;
let stage;
let animation;
let currentMenu;
let data = {
  images: ["./images/char.png"],
  frames: {width: 90, height: 113},
  animations: {
    run:[0, 11, 'run']
  }
};

let bombData = {
  images: ["./images/bomb.png"],
  frames: {width: 32, height:32},
  animations: {
    run:[0, 4, 'fizzle']
  }
};

let levels = {
  1: { itemSpeed: 2800, itemInterval: 700 },
  2: { itemSpeed: 2800, itemInterval: 600 },
  3: { itemSpeed: 2600, itemInterval: 500 },
  4: { itemSpeed: 2400, itemInterval: 400 },
  5: { itemSpeed: 2200, itemInterval: 300 },
  6: { itemSpeed: 2000, itemInterval: 300 },
  7: { itemSpeed: 1900, itemInterval: 300 },
  8: { itemSpeed: 1800, itemInterval: 200 },
  9: { itemSpeed: 1700, itemInterval: 200 },
  10: { itemSpeed: 1600, itemInterval: 200 },
};

let ratio = ["b", "b", "b", "c", "c", "c", "c", "bc", "l"];
let highRatio = ["b", "b", "b", "bc", "c", "c", "c", "c", "bc", "l"];
let currentLevel = 1;

let blueCoinData = {
  images: ["./images/blue_coin.png"],
  frames: {width: 21, height: 26},
  animations: {
    run:[0, 11, 'sparkle']
  }
};
let tree;
let coin;
let log;
let jumping;
let isJumping = false;
let numCoins;
let position = {
  center: 290,
  right: 410,
  left: 170
};

let itemIdx = 0;
let bombIdx = 0;
let blueitemIdx = 0;

let gameOverText;
let gameOverModal;
let bitmap;
let bomb;
let bombArr = [];
let itemArr = [];
let coinCount = 0;
let randomPos = [[290, 100], [320, 310], [340, 510]];
let playing = false;
let Key = {
  _pressed: {
    LEFT: 37,
    UP: 38,
    RIGHT: 39,
    DOWN: 40 ,
    ENTER: 13,
    H: 72
    },

  onKeydown: function(event) {
    if (playing === true && isJumping === false) {
        if (event.keyCode === this._pressed.RIGHT) {
          if (animation.x === position.left) {
            createjs.Tween.get(animation)
              .to({x: position.center}, 150, createjs.Ease.quadInOut);
          } else if (animation.x === position.center) {
            createjs.Tween.get(animation)
              .to({x: position.right}, 150,createjs.Ease.quadInOut);
          }
        } else if (event.keyCode === this._pressed.LEFT) {
          if (  animation.x === position.right) {
            createjs.Tween.get(animation)
              .to({x: position.center}, 150,createjs.Ease.quadInOut);
          } else if (animation.x === position.center) {
            createjs.Tween.get(animation)
              .to({x: position.left}, 150,createjs.Ease.quadInOut);
          }
        } else if (event.keyCode === this._pressed.UP) {
        jump();
      }
    } else if (event.keyCode === this._pressed.ENTER) {
      if ( currentMenu === "start" || currentMenu === "help") {
        init();
      } else {
        resetGame();
      }
    } else if (event.keyCode === this._pressed.H) {
      showHelp();
    }
  }
};

window.addEventListener('keydown',  function(event) { Key.onKeydown(event); });

function init() {
  stage.removeAllChildren();
  currentMenu = null;
  playing = true;
  displayRoad();
  displayCoinCount();
  addRunningChar();
  play();
  addTree();
  createjs.Ticker.on("tick", tick);
}

function addTree() {
  if (playing === true) {
    let random = Math.random();
    tree = new createjs.Bitmap("./images/tree.png");
    tree.y = 215;
    tree.scaleX = 0.4;
    tree.scaleY = 0.4;
    stage.addChild(tree);
    if (random < 0.4) {
      tree.x = 230;
      createjs.Tween.get(tree).to({x: -1200, y: 800, scaleX: 9, scaleY:9}, levels[currentLevel].itemSpeed + 2000, createjs.Ease.quadIn);
    } else if (random < 0.8){
      tree.x = 380;
      createjs.Tween.get(tree).to({x: 1200, y: 800, scaleX: 9, scaleY:9}, levels[currentLevel].itemSpeed + 2000, createjs.Ease.quadIn);
    } else {
      tree.x = 500;
      tree.y = 240;
      tree.scaleX = 0.2;
      tree.scaleY = 0.2;
      createjs.Tween.get(tree).to({x: 2700, y: 800, scaleX: 9, scaleY:9}, levels[currentLevel].itemSpeed+ 8000, createjs.Ease.quadIn);
    }
    setTimeout(addTree, random * 1500 + 200);
  }
}

function addRunningChar() {
  let spriteSheet = new createjs.SpriteSheet(data);
  animation = new createjs.Sprite(spriteSheet,"run");
  animation.y = 410;
  animation.x = position.center;
  stage.addChild(animation);
}

function displayRoad() {
  let bg = new createjs.Bitmap("./images/background.png");
  bg.scaleY = 1.18;
  bg.scaleX = 1.5;
  bg.x = -300;
  stage.addChild(bg);
  let road = new createjs.Bitmap("./images/road.png");
  road.x = 80;
  road.y = 250;
  stage.addChild(road);
}

function play() {
  let randomTime = Math.floor(Math.random()* levels[currentLevel].itemInterval + 100);
  if (playing === true) {
    let randomIdx = Math.floor(Math.random()* ratio.length);
    if (ratio[randomIdx] === "b") {
      giveBomb();
    } else if (ratio[randomIdx] === "c"){
      giveCoin("yellow");
    } else if (ratio[randomIdx] === "bc"){
      giveCoin("blue");
    } else if (ratio[randomIdx] === "l" ){
      giveLog();
      randomTime += 700;
    }
    setTimeout(play, randomTime);
  }
}

function giveBomb() {
  let randomIdx = Math.floor(Math.random() * 3);
  let bombSheet = new createjs.SpriteSheet(bombData);
  bomb = new createjs.Sprite(bombSheet,"fizzle");
  bomb.x = randomPos[randomIdx][0];
  bomb.y = 240;
  bomb.scaleX = 0.7;
  bomb.scaleY = 0.7;
  bomb.name = "bomb";
  itemArr.push(bomb);
  stage.addChild(bomb);
  createjs.Tween.get(bomb).to(
    {
      x: randomPos[randomIdx][1],
      y: 600,
      scaleX: 3.5,
      scaleY: 3.5
    },
    levels[currentLevel].itemSpeed,
    createjs.Ease.quadIn
  );
  itemIdx += 1;
}

function giveCoin(color) {
  if (color === "yellow") {
    coin = new createjs.Bitmap("./images/coin.png");
    coin.name = "yellowCoin";
  } else if (color === "blue") {
    let blueCoinSheet = new createjs.SpriteSheet(blueCoinData);
    coin = new createjs.Sprite(blueCoinSheet,"sparkle");
    coin.name = "blueCoin";
  }
  let randomIdx = Math.floor(Math.random() * 3);
  coin.x = randomPos[randomIdx][0];
  coin.y = 240;
  coin.scaleX = 0.7;
  coin.scaleY = 0.7;
  itemArr.push(coin);
  stage.addChild(coin);
  createjs.Tween.get(coin).to({x: randomPos[randomIdx][1], y: 600, scaleX: 3.5, scaleY: 3.5}, levels[currentLevel].itemSpeed, createjs.Ease.quadIn);
  itemIdx += 1;
}

function giveLog() {
  log = new createjs.Bitmap("./images/log.png");
  log.x = 280;
  log.y = 230;
  log.scaleX = 0.15;
  log.scaleY = 0.1;
  log.name = "log";
  itemArr.push(log);
  itemIdx += 1;
  setTimeout(() => {
    stage.addChild(log);
    createjs.Tween.get(log).to({x: 20, y: 600, scaleX: 1, scaleY: 0.75}, levels[currentLevel].itemSpeed, createjs.Ease.quadIn);
  }, 500);
}


function tick() {
  // updates coin coint
  numCoins.text = `${coinCount}`;

  // level up
  if (coinCount === 30) {currentLevel = 2;}
  if (coinCount === 60) {currentLevel = 3;}
  if (coinCount === 90) {currentLevel = 4;}
  if (coinCount === 130) {currentLevel = 5;}
  if (coinCount === 170) {currentLevel = 6; ratio = highRatio;}
  if (coinCount === 200) {currentLevel = 7;}
  if (coinCount === 240) {currentLevel = 8;}
  if (coinCount === 280) {currentLevel = 9;}
  if (coinCount === 250) {currentLevel = 10;}
  let itemDup = itemArr;

  // collisions with objects
  for (let j = 0; j < itemDup.length; j++) {
    if (itemDup[j].y === 600){
      stage.removeChild(itemArr[j]);
      itemArr.splice(j, 1);
      itemIdx -= 1;
    } else if ( itemDup[j].y > 390 && itemDup[j].y < 460 && isJumping === false) {
        if (itemDup[j].name === "log") { gameOver(); }
        if ( itemDup[j].x > position.left - 50 && itemDup[j].x < position.left + 50 && animation.x === position.left ) {
          handleCollision(itemArr[j], j);
        } else if ( itemDup[j].x > position.center - 10 && itemDup[j].x < position.center + 50 && animation.x === position.center ) {
          handleCollision(itemArr[j], j);
        } else if ( itemDup[j].x > position.right - 30 && itemDup[j].x < position.right + 50 && animation.x === position.right ) {
          handleCollision(itemArr[j], j);
        }
    }
  }
}


function handleCollision(item, idx) {
  if (item.name === "bomb") {
    gameOver();
  } else {
    collectCoin(item, idx);
  }
}

function collectCoin (collectedCoin, idx) {
  if (collectedCoin.name === "yellowCoin") {
    coinCount += 1;
  } else if (collectedCoin.name === "blueCoin"){
    coinCount += 2;
  }
  stage.removeChild(collectedCoin);
  itemArr.splice(idx, 1);
  itemIdx -= 1;
}

function jump() {
  isJumping = true;
  let currentX = animation.x;
  let currentY = animation.y;
  stage.removeChild(animation);
  jumping = new createjs.Bitmap("./images/jumping.png");
  let shadow = new createjs.Bitmap("./images/shadow.png");
  jumping.y = currentY;
  jumping.x = currentX;
  shadow.y = currentY;
  shadow.x = currentX;
  stage.addChild(jumping, shadow);
  createjs.Tween.get(jumping)
    .to({ y: currentY - 150 }, 400, createjs.Ease.quadInOut)
    .to({ y: currentY }, 400, createjs.Ease.quadInOut);
  createjs.Tween.get(shadow)
    .to({ x: currentX + 50, y: currentY + 100, scaleX: 0, scaleY: 0 }, 400, createjs.Ease.quadInOut)
    .to({ x: currentX, y: currentY, scaleX: 1, scaleY: 1 }, 400, createjs.Ease.quadInOut);
  setTimeout(() => {
    stage.removeChild(jumping, shadow);
    stage.addChild(animation);
    isJumping = false;
  }, 800);
}

gameOverModal = new createjs.Shape();
gameOverModal.graphics.beginFill('#ccc').drawRect(0, 0, 700, 600);
gameOverModal.alpha = 0;
gameOverText = new createjs.Text();
gameOverText.text = "GAME OVER\nPress Enter to Play Again";
gameOverText.font = "bold 30px Gloria Hallelujah";
gameOverText.color = "#eee";
gameOverText.textAlign = "center";
gameOverText.x = 350;
gameOverText.y = 200;
gameOverText.alpha = 0;

function gameOver() {
  stage.addChild(gameOverModal, gameOverText);
  stage.removeChild(animation);
  createjs.Ticker.paused = true;
  playing = false;
  gameOverText.alpha = 1;
  gameOverModal.alpha = 0.75;
}

function resetGame() {
  createjs.Ticker.paused = false;
  stage.removeAllChildren();
  itemArr = [];
  bombArr = [];
  coinCount = 0;
  itemIdx = 0;
  bombIdx = 0;
  currentLevel = 1;
  currentMenu = "";
  init();
}

function displayCoinCount(){
  coin = new createjs.Bitmap("./images/coin.png");
  coin.x = 600;
  coin.y = 30;
  numCoins = new createjs.Text(`${coinCount}`, "25px Arial", "#f50");
  numCoins.x = 630;
  numCoins.y = 50;
  numCoins.textBaseline = "alphabetic";
  stage.addChild(numCoins, coin);
}

function showStart() {
  stage = new createjs.Stage("gamecanvas");
  let start = new createjs.Bitmap("./images/start_menu.png");
  start.x = 0;
  start.y = 0;
  start.name = "startmenu";
  stage.addChild(start);
  createjs.Ticker.addEventListener("tick", stage);
  createjs.Ticker.setFPS(30);
  addRunningChar();
}

function showHelp(){
  stage.removeAllChildren();
  let help = new createjs.Bitmap("./images/help.png");
  help.x = 0;
  help.y = 0;
  help.name = "helpmenu";
  stage.addChild(help);
}

document.addEventListener('DOMContentLoaded', () => {
  showStart();
});
