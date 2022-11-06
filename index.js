const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.width = 1024
canvas.height = 576


c.fillRect(0, 0, canvas.width, canvas.height)

const gravity = 0.7

const background = new Sprite({
  position: {
    x: 0,
    y: 0
  },
  imageSrc: './img/background.png' 
})

const shop = new Sprite({
  position: {
    x: 640,
    y: 160
  }, 
  imageSrc: './img/shop_anim.png',
  scale: 2.5,
  framesMax: 6
})

const player = new Fighter({
position:{
    x: 250, 
    y: 0,
},
velocity:{
    x: 0, 
    y: 0
},
offset: {
  x: 0,
  y: 0
},
imageSrc: './img/knight/Idle.png',
framesMax: 10,
scale: 2.5,
offset: {
  x: 140, 
  y: 65 
  },
  sprites: {
    idle: {
      imageSrc: './img/knight/Idle.png',
      framesMax: 10
    },
    run: {
      imageSrc: './img/knight/Run.png',
      framesMax: 6
    },
    jump: {
      imageSrc: './img/knight/Jump.png',
      framesMax: 2
    },
    fall: {
      imageSrc: './img/knight/Fall.png',
      framesMax: 2
    },
    attack1: {
      imageSrc: './img/knight/Attack1.png',
      framesMax: 4
  },
  takeHit: {
    imageSrc: './img/knight/Take Hit.png',
    framesMax: 3
  },
  death: {
    imageSrc: './img/knight/Death.png',
    framesMax: 9
  }
 },
 attackBox: {
  offset: {
    x: 67,
    y: 50
  },
  width: 100,
  height: 50
 }
})


const enemy = new Fighter({
    position:{
    x: 725, 
    y: 100
},
velocity:{
    x: 0, y: 0
},
direction: x = -1,
color: 'blue',
offset: {
  x: -50,
  y: 0
},
imageSrc: './img/king/Idle.png',
framesMax: 8,
scale: 2.1,
offset: {
  x: 150, 
  y: 70 
  },
  sprites: {
    idle: {
      imageSrc: './img/king/Idle.png',
      framesMax: 8
    },
    run: {
      imageSrc: './img/king/Run.png',
      framesMax: 8
    },
    jump: {
      imageSrc: './img/king/Jump.png',
      framesMax: 2
    },
    fall: {
      imageSrc: './img/king/Fall.png',
      framesMax: 2
    },
    attack1: {
      imageSrc: './img/king/Attack1.png',
      framesMax: 4
  },
    takeHit: {
    imageSrc: './img/king/Take Hit.png',
    framesMax: 4
 },
 death: {
   imageSrc: './img/king/Death.png',
   framesMax: 6
 }
},
 attackBox: {
  offset: {
    x: -130,
    y: 50
  },
  width: 90,
  height: 50
 }
})

console.log(player)

const keys = {
    a: {
        pressed: false
    },
    d: {
        pressed: false
    },
    ArrowRight: {
        pressed: false
    },
    ArrowLeft: {
        pressed: false
    }
}

decreaseTimer()

function animate(){
     window.requestAnimationFrame(animate)
     c.fillStyle = 'black'
     background.update()
     shop.update()
     player.update()
     enemy.update()

     player.velocity.x = 0
     enemy.velocity.x = 0

    // player movement
    
     if (keys.a.pressed && player.lastkey === 'a'){
        player.velocity.x = -5
        player.switchSprite('run')
     
     }  else if (keys.d.pressed && player.lastkey === 'd'){
        player.velocity.x = 5
        player.switchSprite('run')
       
     } else {
      player.switchSprite('idle') 
     }
     
     // jumping
     if (player.velocity.y < 0) {
      player.switchSprite('jump')
     
     } else if (player.velocity.y > 0) {
      player.switchSprite('fall')
    
     }

      // enemy movement
      if (keys.ArrowLeft.pressed && enemy.lastkey === 'Arrowleft'){
        enemy.velocity.x = -5
        enemy.switchSprite('run')
        
     }  else if (keys.ArrowRight.pressed && enemy.lastkey === 'ArrowRight'){
        enemy.velocity.x = 5
        enemy.switchSprite('run')
     
     } else {
      enemy.switchSprite('idle')
     }

       // jumping
       if (enemy.velocity.y < 0) {
        enemy.switchSprite('jump')
        
       } else if (enemy.velocity.y > 0) {
        enemy.switchSprite('fall')
        
       }

     // detect for collision & enemy gets hit
     if (
      rectangularCollision({
        rectangle1: player,
        rectangle2: enemy
      }) &&
      player.isAttacking && 
      player.framesCurrent === 2
    ) {
      enemy.takeHit()
      player.isAttacking = false

      gsap.to('#EnemyHealth', {
        width: enemy.health +'%'
      })
     }

     // if player misses
     if (player.isAttacking && 
      player.framesCurrent === 2
      ) {
      player.isAttacking = false
     }

     // this is where our player gets hit

     if (
      rectangularCollision({
        rectangle1: enemy,
        rectangle2: player
      }) &&
      enemy.isAttacking && 
      enemy.framesCurrent === 2
    ) {
      player.takeHit()
      enemy.isAttacking = false

        gsap.to('#PlayerHealth', {
        width: player.health +'%'
      })
     }
      
     // if enemy misses
     if (enemy.isAttacking && enemy.framesCurrent === 2) {
      enemy.isAttacking = false
     }


  // end game base on health
  if (enemy.health <= 0 || player.health <= 0 ) {
    determineWinner({player, enemy, timerId})
  }
}

animate()

window.addEventListener('keydown', (event) => {
  if (!player.death) {

  
    switch (event.key){
      case 'd':
        keys.d.pressed = true
        player.lastkey = 'd'
        break
      case 'a':
        keys.a.pressed = true
        player.lastkey = 'a'
        break
      case 'w':
        player.velocity.y = -18
        break    
      case 's':
        player.attack()
        break 
    }
  }
  if (!enemy.death) {
    switch(event.key){
      case 'ArrowRight':
        keys.ArrowRight.pressed = true
        enemy.lastkey = 'ArrowRight'
        break
      case 'ArrowLeft':
        keys.ArrowLeft.pressed = true
        enemy.lastkey = 'Arrowleft'
        break
      case 'ArrowUp':
        enemy.velocity.y = -18
        break
      case 'ArrowDown':
        enemy.attack()
        break
    }
  }
})

window.addEventListener('keyup', (event) => {
    console.log(event.key);
    switch (event.key){
      case 'd':
        keys.d.pressed = false
        break
      case 'a':
        keys.a.pressed = false
        break   
      
    }
                         
    // enemy keys
    switch (event.key){
       case 'ArrowRight':
        keys.ArrowRight.pressed = false
        break
       case 'ArrowLeft':
        keys.ArrowLeft.pressed = false
        break
       
    }
} )