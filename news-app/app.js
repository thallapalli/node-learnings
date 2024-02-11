
const express = require('express')
const app = express()
const mustacheExpress = require('mustache-express')
const bodyParser = require('body-parser')
const pgp = require('pg-promise')()
const session = require('express-session')
const path=require('path')
const userRoutes=require('./routes/users')
const indexRoutes=require('./routes/index')
const PORT = 3000
const VIEWS_PATH = path.join(__dirname,'/views')
// configuring your view engine
app.engine('mustache',mustacheExpress(VIEWS_PATH + '/partials','.mustache'))
app.set('views',VIEWS_PATH)
app.set('view engine','mustache')
app.use('/css',express.static('css'))
app.use(session({
  secret: 'lhadhlsdalh',
  resave: false,
  saveUninitialized: false
}))

app.use(bodyParser.urlencoded({extended: false}))
const username = "postgres"
const password = "Tinku_2015"
const host = "localhost"
const port = "5432"
const database = "newsdb"

//const connectionString = "postgres://localhost:5432/nailasgarden";
const connectionString = `postgres://${username}:${password}@${host}:${port}/${database}`;
db = pgp(connectionString);
app.use('/users',userRoutes);
app.use('/',indexRoutes);

app.listen(PORT,() => {
  console.log(`Server has started on ${PORT}`)
})
