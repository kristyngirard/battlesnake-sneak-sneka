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
  
  const allSnakes = gameState.snakes.data

  console.log("snake head ", snakeHead)
  console.log("snake prevStep ", snakePrevStep)
  
    var up = snakeHead.y -1
    var down = snakeHead.y +1
    var left = snakeHead.x -1
    var right = snakeHead.x +1
    
    function isOccupied(direction, snakeHead, allSnakes) {
        
        var x = 0
        var y = 0
        
        if (direction === "up") {
            y = snakeHead.y-1
            x = snakeHead.x
        }
        else if (direction === "down"){
            y = snakeHead.y+1
            x = snakeHead.x
        }
        else if (direction === "left"){
            y = snakeHead.y
            x = snakeHead.x-1
        }
        else if(direction === "right"){
            y = snakeHead.y
            x = snakeHead.x+1
        }
        
        console.log("move direction ", direction, " x ", x, " y ", y)
        
        for(let i = 0; i < allSnakes.length; i++){
            if (allSnakes[i].health > 0) {
                for(let j = 0; j < allSnakes[i].body.data.length; j++) {
                    if (allSnakes[i].body.data[j].x === x && allSnakes[i].body.data[j].y === y) {
                        console.log("me, sneks x ", x, "y ", y)
                        return true;
                    }
                }
            }
        }
        
        return false;
    }
    
//    //check for itself collision
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
//    
    
    //check for walls
    //gameState.Width, snakeHead
    var wallud = ""
    var walllr = ""
    
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
    //if on same x
  if (snakeHead.x - food.x === 0) {
      
    if (snakeHead.y - food.y > 0 && wallud !== "up" ) {
        
        console.log("Try first up")
        
        if (!(isOccupied("up", snakeHead, allSnakes))) {
            move = "up"
        } else if (!(isOccupied("right", snakeHead, allSnakes)) && wallud !== "right") {
            move = "right"
        } else {
            move = "left"
        }
    } else if (wallud !== "down") {
        
        console.log("Try first down")
        
        if (!(isOccupied("down", snakeHead, allSnakes))) {
            move = "down"
        } else if (!(isOccupied("right", snakeHead, allSnakes)) && wallud !== "right") {
            move = "right"
        } else {
            move = "left"
        }
    }
    //else if same on y  
  } else if (snakeHead.y - food.y === 0) {
      
        console.log("first left")
      
        if (snakeHead.x - food.x > 0 && walllr !== "left" ) {
            if (!(isOccupied("left", snakeHead, allSnakes))) {
                move = "left"
            } else if (!(isOccupied("up", snakeHead, allSnakes)) && wallud !== "up") {
                move = "up"
            } else {
                move = "down"
            }
        } else if (walllr !== "right" ) {
            
            console.log("first right")
            
            if (!(isOccupied("right", snakeHead, allSnakes))) {
                move = "right"
            } else if (!(isOccupied("up", snakeHead, allSnakes)) && wallud !== "up") {
                move = "up"
            } else {
                move = "down"
            }
        }  
  }
    //else anything else
    else {
        if (snakeHead.x - food.x > 0 && walllr !== "left" ) { 
            
            console.log("else left")
            
            if (!(isOccupied("left", snakeHead, allSnakes))) {
                move = "left"
            } else if (!(isOccupied("up", snakeHead, allSnakes)) && wallud !== "up") {
                move = "up"
            } else {
                move = "down"
            }
        } else if (walllr !== "right" ) {
            
            console.log("else right")
            
            if (!(isOccupied("right", snakeHead, allSnakes))) {
                move = "right"
            } else if (!(isOccupied("up", snakeHead, allSnakes)) && wallud !== "up") {
                move = "up"
            } else {
                move = "down"
            }
        } else{
            if (snakeHead.y - food.y > 0 && wallud !== "up" ) {
                
                console.log("else up")
                
                if (!(isOccupied("up", snakeHead, allSnakes))) {
                    move = "up"
                } else if (!(isOccupied("right", snakeHead, allSnakes)) && wallud !== "right") {
                    move = "right"
                } else {
                    move = "left"
                }
            } else {
                
                console.log("else down")
                
                if (!(isOccupied("down", snakeHead, allSnakes))) {
                    move = "down"
                } else if (!(isOccupied("right", snakeHead, allSnakes)) && wallud !== "right") {
                    move = "right"
                } else {
                    move = "left"
                }
            }
        }
    }
    
    console.log("snek move ", move)
     
  //Return
  res.json({ 
    'move': move,
    "taunt": "heck"
  })
})

app.use('*', fallbackHandler)
app.use(notFoundHandler)
app.use(genericErrorHandler)

app.listen(app.get('port'), () => {
  console.log('Server listening on port %s', app.get('port'))
})
