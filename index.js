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
    color: "#2C753C",
    name: "battlesnaKA",
    head_url: "https://vignette.wikia.nocookie.net/harrypotter/images/d/d3/0.61_Slytherin_Crest_Transparent.png/revision/latest?cb=20161020182557",
    taunt: "slytherin to a win",
    head_type: "fang",
    tail_type: "regular",
    secondary_color: "#2C753C"
  }

  return res.json(data)
})

// POST '/move' response
app.post('/move', (req, res) => {
  /**** TODO: figure out how to generate next move ***/

  /*
    things to consider:
    - can't go in the direction it came from
    - can't go in a direction if its body is there
    - can't go off the board
  */
  // Just set moves randomly for now
  const moves = ["up", "down", "left", "right"]

  const data = {
    move: moves[Math.floor(Math.random() * 4)],
    taunt: 'outta my wayyy'
  }

  return res.json(data)
})

app.use('*', fallbackHandler)
app.use(notFoundHandler)
app.use(genericErrorHandler)

app.listen(app.get('port'), () => {
  console.log('Server listening on port %s', app.get('port'))
})
