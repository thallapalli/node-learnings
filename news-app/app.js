
const express = require('express')
const app = express()
const mustacheExpress = require('mustache-express')
const bodyParser = require('body-parser')
const pgp = require('pg-promise')()
const bcrypt = require('bcrypt')
const session = require('express-session')

const PORT = 3000
const CONNECTION_STRING = "postgres://localhost:5432/newsdb"
const SALT_ROUNDS = 10

// configuring your view engine
app.engine('mustache',mustacheExpress())
app.set('views','./views')
app.set('view engine','mustache')

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
const db = pgp(connectionString);


app.get('/users/articles',(req,res) => {
  res.render('articles',{username: req.session.user.username})
})

app.post('/login',(req,res) => {

  let username = req.body.username
  let password = req.body.password

  db.oneOrNone('SELECT userid,username,password FROM newsdb.users WHERE username = $1',[username])
  .then((user) => {
      if(user) { // check for user's password

      bcrypt.compare(password,user.password,function(error,result){
        if(result) {

          // put username and userId in the session
          if(req.session) {
            req.session.user = {userId: user.userid, username: user.username}
          }

          res.redirect('/users/articles')

        } else {
            res.render('login',{message: "Invalid username or password!"})
        }
      })

    } else { // user does not exist
      res.render('login',{message: "Invalid username or password!"})
    }
  })

})

app.get('/login',(req,res) => {
  res.render('login')
})

app.post('/register',(req,res) => {

  let username = req.body.username
  let password = req.body.password

  db.oneOrNone('SELECT userid FROM users WHERE username = $1',[username])
  .then((user) => {
    if(user) {
      res.render('register',{message: "User name already exists!"})
    } else {
      // insert user into the users table

      bcrypt.hash(password,SALT_ROUNDS,function(error, hash){

        if(error == null) {
          db.none('INSERT INTO users(username,password) VALUES($1,$2)',[username,hash])
          .then(() => {
            res.send('SUCCESS')
          })
        }

      })

    }
  })

})

app.get('/register',(req,res) => {
  res.render('register')
})

app.listen(PORT,() => {
  console.log(`Server has started on ${PORT}`)
})
