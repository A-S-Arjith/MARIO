var PLAY = 1;
var END = 0;
var gameState = PLAY;

var mario, mario_running, mario_collided;
var ground, invisibleGround, groundImage;

var luckysGroup, luckyImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;

var score=0;

var gameOver, restart;


function preload(){
  mario_running =   loadAnimation("mario1.png","mario2.png","mario3.png");
  mario_collided = loadAnimation("mario_collided.png");
  
  groundImage = loadImage("ground1.png");
  luckyImage = loadImage("luckyBlock.png")
  
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.jpg");
  obstacle3 = loadImage("obstacle3.jpg");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  
  gameOverImg = loadImage("gameOver.png");
  restartImg = loadImage("restart.png");
}

function setup() {
  createCanvas(600, 350);
  
  mario = createSprite(50,280,20,50);
  
  mario.addAnimation("running", mario_running);
  mario.addAnimation("collided", mario_collided);
  mario.scale = 0.5;
  
  ground = createSprite(100,300,400,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  ground.velocityX = -(6 + 3*score/100);
  
  gameOver = createSprite(300,100);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(300,140);
  restart.addImage(restartImg);
  
  gameOver.scale = 0.5;
  restart.scale = 0.5;

  gameOver.visible = false;
  restart.visible = false;
  
  invisibleGround = createSprite(200,285,400,10);
  invisibleGround.visible = false;
  
  luckysGroup = new Group();
  obstaclesGroup = new Group();
  
  score = 0;
}

function draw() {
  background(255);
  text("Score: "+ score, 500,50);
  
  if (gameState===PLAY){
    score = score + Math.round(getFrameRate()/60*2);
    ground.velocityX = -(6 + 3*score/200);
  
    if(keyDown("space") && mario.y >= 150) {
      mario.velocityY = -12;
      console.log(mario.y)
    }
  
    mario.velocityY = mario.velocityY + 0.8
  
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
  
    mario.collide(invisibleGround);
    spawnluckys();
    spawnObstacles();

    if(luckysGroup.isTouching(mario)){
      obstaclesGroup.destroyEach();
      }
    if(obstaclesGroup.isTouching(mario)){
        gameState = END;
    }
  }
  else if (gameState === END) {
    gameOver.visible = true;
    restart.visible = true;
    
    ground.velocityX = 0;
    mario.velocityY = 0;
    obstaclesGroup.setVelocityXEach(0);
    luckysGroup.setVelocityXEach(0);
    
    mario.changeAnimation("collided",mario_collided);
    
    obstaclesGroup.setLifetimeEach(-1);
    luckysGroup.setLifetimeEach(-1);
    
    if(mousePressedOver(restart)) {
      reset();
    }
  }
  
  
  drawSprites();
}

function spawnluckys() {
  if (frameCount % 300 === 0) {
    var lucky = createSprite(600,120,80,10);
    lucky.addImage("luckBlock",luckyImage)
    lucky.y = Math.round(random(80,110));
    lucky.velocityX = -3;
    
    lucky.scale=0.5
    lucky.lifetime = 200;
    
    lucky.depth = mario.depth;
    mario.depth = mario.depth + 1;
    
    luckysGroup.add(lucky);
  }
  
}

function spawnObstacles() {
  if(frameCount % 80 === 0) {
    var obstacle = createSprite(600,230,10,40);
    obstacle.velocityX = -(6 + 3*score/100);
    
    var rand = Math.round(random(1,5));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
      obstacle.scale = 0.3;
              break;
      case 2: obstacle.addImage(obstacle2);
      obstacle.scale = 0.3;
              break;
      case 3: obstacle.addImage(obstacle3);
      obstacle.scale = 0.1;
              break;
      case 4: obstacle.addImage(obstacle4);
      obstacle.scale = 0.3;
              break;
      case 5: obstacle.addImage(obstacle5);
      obstacle.scale = 0.3;
              break;
      default: break;
    }
    
    obstacle.lifetime = 300;
    obstaclesGroup.add(obstacle);
  }
}

function reset(){
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;
  
  obstaclesGroup.destroyEach();
  luckysGroup.destroyEach();
  
  mario.changeAnimation("running",mario_running);
  
  if(localStorage["HighestScore"]<score){
    localStorage["HighestScore"] = score;
  }
  console.log(localStorage["HighestScore"]);
  
  score = 0;
  
}