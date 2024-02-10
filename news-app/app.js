
const express = require('express')
const app = express()
const mustacheExpress = require('mustache-express')
const bodyParser = require('body-parser')
const PORT = 3000
const pgp = require('pg-promise')()
const bcrypt = require('bcrypt')
const username = "postgres"
const password = "Tinku_2015"
const host = "localhost"
const port = "5432"
const database = "newsdb"
const SALT_ROUNDS = 10
//const connectionString = "postgres://localhost:5432/nailasgarden";
const connectionString = `postgres://${username}:${password}@${host}:${port}/${database}`;
const db = pgp(connectionString);

// configuring your view engine
app.engine('mustache', mustacheExpress())
app.set('views', './views')
app.set('view engine', 'mustache')

app.use(bodyParser.urlencoded({ extended: false }))

app.post('/register', (req, res) => {

  let username = req.body.username
  let password = req.body.password

  db.oneOrNone('SELECT userid FROM newsdb.users WHERE username=$1', [username])
    .then((user) => {
      if (user) {
        res.render('register', { message: "User exists" })
      } else {

        bcrypt.hash(password, SALT_ROUNDS, function (error, hash) {
          if (error == null) {
            db.none('INSERT INTO newsdb.users(username,password) VALUES($1,$2)', [username, hash])
              .then(() => {
                res.send('SUCCESS')
              })
          }
        })

      }
    })



})

app.get('/register', (req, res) => {
  res.render('register')
})

app.listen(PORT, () => {
  console.log(`Server has started on ${PORT}`)
})
