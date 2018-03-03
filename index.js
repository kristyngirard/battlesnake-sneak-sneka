const bodyParser = require('body-parser')
const express = require('express')
const logger = require('morgan')
const app = express()
const {
  fallbackHandler,
  notFoundHandler,
  genericErrorHandler,
  poweredByHandler
} = require('./handlers.js')

// For deployment to Heroku, the port needs to be set using ENV, so
// we check for the port number in process.env
app.set('port', (process.env.PORT || 9001))

app.enable('verbose errors')

app.use(logger('dev'))
app.use(bodyParser.json())
app.use(poweredByHandler)

// POST '/start' response
app.post('/start', (req, res) => {
  // Response data
  const data = {
    color: "#169056",
    name: "sneak-sneka",
    head_url: "https://ih0.redbubble.net/image.280444667.5089/flat,800x800,075,f.jpg",
    taunt: "slytherin to a win",
    head_type: "fang",
    tail_type: "regular",
    secondary_color: "#C4D000"
  }

  return res.json(data)
})

// POST '/move' response
app.post('/move', (req, res) => {
  const gameState = req.body
  const mySnake = gameState.you

  const snakeHead = mySnake.body.data[0]
  const snakeTail = mySnake.body.data[mySnake.length - 1]
  const snakePrevStep = mySnake.body.data[1]
  const food = gameState.food.data[0]

  console.log("snake head ", snakeHead)
  console.log("snake tail ", snakeTail)
  console.log("snake prevStep ", snakePrevStep)

    var up = snakeHead.y -1
    var down = snakeHead.y +1
    var left = snakeHead.x -1
    var right = snakeHead.x +1
    
    
    //check for itself collision
    var notDirection
    
    if (up === snakePrevStep.y) {
        notDirection = "up"
    }
    else if (down === snakePrevStep.y) {
        notDirection = "down"
    }
    else if (left === snakePrevStep.x) {
        notDirection = "left"
    }
    else {
        notDirection = "right"
    }
    
    console.log("snake notDirection ", notDirection)
    
    
    //check for walls
    //gameState.Width, snakeHead
    var wallud = ""
    var walllr = ""
    
    console.log("height ", gameState.height)
    console.log("width ", gameState.width)
    
    if (up < 0) {
        wallud = "up"
    }
    else if (down > gameState.height - 1) {
        wallud = "down"
    }
    
    if (left < 0) {
        walllr = "left"
    }
    else if (right > gameState.width - 1) {
        walllr = "right"
    }    
    
    console.log("snake wall ud ", wallud)
    console.log("snake wall lr ", walllr)
    
    //determine next move
  if (snakeHead.x - food.x === 0) {
      
    if (snakeHead.y - food.y > 0 && notDirection !== "up" && wallud !== "up" ) {
      move = "up"
    } else if (notDirection !== "down" && wallud !== "down" ) {
      move = "down"
    }
    else {
    if (snakeHead.x - food.x > 0 && notDirection !== "left" && walllr !== "left" ) {
      move = "left"
    } else {
      move = "right"
    }
    }
      
  } else {
    if (snakeHead.x - food.x > 0 && notDirection !== "left" && walllr !== "left" ) {
      move = "left"
    } else if (notDirection !=="right" && walllr !== "right" ) {
      move = "right"
    }
      else{
    if (snakeHead.y - food.y > 0 && notDirection !== "up" && wallud !== "up" ) {
      move = "up"
    } else {
      move = "down"
    }
      }
  }

    console.log("snek move ", move)
     
  //Return
  res.json({ 
    'move': move,
    "taunt": "Hi"
  })
})

app.use('*', fallbackHandler)
app.use(notFoundHandler)
app.use(genericErrorHandler)

app.listen(app.get('port'), () => {
  console.log('Server listening on port %s', app.get('port'))
})
