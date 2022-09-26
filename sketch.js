var bg,bgImg;
var player, shooterImg, alienImg;
var skateImg;
var bulletGroup;
var heart1, heart2, heart3;
var heart1Img, heart2Img, heart3Img;
var life = 3;
var bullets = 15;
var wall;
var score = 0;
var star;
var alienboss,BossImg;
var bossLife= 100;
var gameState = 'play';



function preload(){
  
  shooterImg = loadAnimation("assets/Shooter/1.png","assets/Shooter/22.png")
  alienImg = loadAnimation("assets/Alien/1.png","assets/Alien/15.png")
  skateImg = loadImage('assets/skate/skate3.png')


  bgImg = loadImage("assets/BackGround.jpg")
  buImg = loadImage("assets/bullet1.png")

  heart1Img = loadImage('assets/heart_1.png')
  heart2Img = loadImage('assets/heart_2.png')
  heart3Img = loadImage('assets/heart_3.png')

  starImg = loadImage('assets/pixel-star.png')

  BossImg = loadAnimation("assets/Boss/Boss1.png","assets/Boss/Boss2.png","assets/Boss/Boss3.png")

}

function setup() {

  
  createCanvas(windowWidth,windowHeight);

//adicionando a imagem de fundo
    bg = createSprite(displayWidth/2+100,displayHeight/2,20,20)
    bg.addImage(bgImg)
    bg.scale = 2.9
  

//criando o sprite do jogador
    player = createSprite(displayWidth-1150, displayHeight-300, 50, 50);
    player.addAnimation('player',shooterImg)
    player.setCollider("circle",0,30,110)
    base= createSprite(player.x-10,player.y+130,100,10)
    base.addImage(skateImg)
    base.scale = 0.4

   alienGroup = new Group()
   bulletGroup = new Group();
   starGroup = new Group()

   heart1 = createSprite(displayWidth-100,40,20,20)
   heart1.visible = false;
   heart1.addImage('heart1',heart1Img);
   heart1.scale = 0.4

   heart2 = createSprite(displayWidth-150,40,20,20)
   heart2.visible = false;
   heart2.addImage('heart2',heart2Img);
   heart2.scale = 0.4

   heart3 = createSprite(displayWidth-200,40,20,20)
   heart3.addImage('heart3',heart3Img);
   heart3.scale = 0.4

   wall =createSprite(0,0,200,1550)
   wall.visible = false;

   

 

}

function draw() {
  background(0); 

 if(gameState=='play'){
  if(life==3){
    heart3.visible = true;
    heart1.visible = false;
    heart2.visible = false;
  }

  if(life==2){
    heart3.visible = false;
    heart1.visible = false;
    heart2.visible = true;
  }

  if(life==1){
    heart3.visible = false;
    heart1.visible = true;
    heart2.visible = false;
  }

  if(life==0){
  gameState = "lost"
  heart1.visible = false;

  }

  if(bullets===0){
    gameState = 'bullet'
  }
 
  if (score === 10){
    BossGenerator()
  }

  //movendo o jogador para cima e para baixo e tornando o jogo compatível com dispositivos móveis usando toques
// if(keyDown("UP_ARROW")||touches.length>0){
//   player.y = player.y-30
//   base.y-=30
// }
// if(keyDown("DOWN_ARROW")||touches.length>0){
//  player.y = player.y+30
//  base.y+=30
// }

player.y = mouseY
base.y = mouseY+128

if(mouseWentDown('leftButton')){
bullet = createSprite(player.x+120,player.y+25,40,10)
bullet.addImage("bullet",buImg)
bullet.velocityX = 15
bullet.scale = 0.08
bullet.depth = player.depth
bullet.depth-=1
bulletGroup.add(bullet)
bullets -=1
bullet.lifetime = 400
}

if(alienGroup.isTouching(player)){
  for(var i=0;i< alienGroup.length;i++){
    if(alienGroup[i].isTouching(player)){
      alienGroup[i].destroy()
      life-=1
    }
  }
}

if(alienGroup.isTouching(wall)){
  for(var i=0;i< alienGroup.length;i++){
    if(alienGroup[i].isTouching(wall)){
      alienGroup[i].destroy()
      life-=1
    }
  }
}

if(starGroup.isTouching(player)){
  for(var i=0;i< starGroup.length;i++){
    if(starGroup[i].isTouching(player)){
      starGroup[i].destroy()
      bullets +=5;
    }
  }
}

if(starGroup.isTouching(wall)){
  for(var i=0;i< starGroup.length;i++){
    if(starGroup[i].isTouching(wall)){
      starGroup[i].destroy()
      life-=1
    }
  }
}

alienGroup.overlap(bulletGroup,(alien,bullet)=>{
  bullet.destroy();
  alien.destroy();
  score +=5;
})



AlienGenerator();
StarsGenerator();
 }
 
drawSprites();

textSize(45)
fill('white')
text('Score: '+ score,displayWidth-50,displayHeight/2-325)

textSize(45)
fill('white')
text('Balas: '+ bullets,displayWidth/3-350,displayHeight/2-325)


if(gameState == 'lost'){
  gameOver()
  player.destroy();
  base.destroy();
  alienGroup.destroyEach();
  bulletGroup.destroyEach();
  starGroup.destroyEach();
}

if(gameState == 'bullet'){
  Bullet()
  player.destroy();
  base.destroy();
  alienGroup.destroyEach();
  bulletGroup.destroyEach();
  starGroup.destroyEach();
}

if(gameState == 'win'){
  Win()
  player.destroy();
  base.destroy();
  alienGroup.destroyEach();
  bulletGroup.destroyEach();
  starGroup.destroyEach();
}

if(gameState == 'bossRound'){
  alienGroup.destroyEach();
 
}



}
function AlienGenerator(){
  if(frameCount%50===0){
  alien = createSprite(width,random(100,height-100),40,40)
  alien.addAnimation("alien",alienImg)
  alien.velocityX = -5
  alienGroup.add(alien)
  alien.setCollider("circle",0,0,90)
  }
}

function StarsGenerator(){
  if(frameCount%350===0){
  star = createSprite(width,random(100,height-100),40,40)
  star.addImage('star',starImg)
  star.scale = 0.13
  star.velocityX = -25
  starGroup.add(star)
  star.setCollider("circle",0,0,250)
  }
}

function BossGenerator(){
 alienboss = createSprite(width/2,height/2,40,40)
 alienboss.addAnimation('alienboss',BossImg)
 alienboss.scale = 1.5
  //Boss.velocityY = -25
 alienboss.debug = true
 alienboss.setCollider("circle",0,0,170)
  }


function gameOver() {
  swal({
    title: `Game Over`,
    text: "Parece que os aliens foram mais rápidos!",
    imageUrl:
      "https://cdn.shopify.com/s/files/1/1061/1924/products/Thumbs_Down_Sign_Emoji_Icon_ios10_grande.png",
    imageSize: "100x100",
    confirmButtonText: "Obrigado por jogar"
  },
  function(confirm){
    if(confirm){
      location.reload()
    }
  }
  );
}

 function Bullet() {
  swal({
    title: `Game Over`,
    text: "Você ficou sem munição.",
    imageUrl:
      "https://cdn.shopify.com/s/files/1/1061/1924/products/Thumbs_Down_Sign_Emoji_Icon_ios10_grande.png",
    imageSize: "100x100",
    confirmButtonText: "Obrigado por jogar"
  },
  function(confirm){
    if(confirm){
      location.reload()
    }
  });
}

function Win() {
  swal({
    title: `You Win`,
    text: "Parabéns! Os aliens foram derrotados e todos estão á salvo agora.",
    imageUrl:
      "https://images.emojiterra.com/google/noto-emoji/v2.034/128px/1f389.png",
    imageSize: "100x100",
    confirmButtonText: "Obrigado por jogar"
  },
  function(confirm){
    if(confirm){
      location.reload()
    }
  });
}