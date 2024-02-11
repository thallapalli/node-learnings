
const express = require('express')
const app = express()
const mustacheExpress = require('mustache-express')
const bodyParser = require('body-parser')
const pgp = require('pg-promise')()
const bcrypt = require('bcrypt')
const session = require('express-session')
const path=require('path')
const PORT = 3000
const CONNECTION_STRING = "postgres://localhost:5432/newsdb"
const SALT_ROUNDS = 10
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
const db = pgp(connectionString);
app.get('/',(req,res) => {
  
 db.any('SELECT articleid,title,body FROM newsdb.articles')
 .then((articles)=>{
  res.render('index',{articles})
 })
  
})
///users/articles/edit/1
app.get('/users/articles/edit/:articleid',(req,res) => {
  let articleId=req.params.articleid;
  db.one('SELECT articleid,title,body FROM newsdb.articles WHERE articleid=$1',[articleId])
  .then((article)=>{
    res.render('edit-article',article)
  })
})
app.post('/users/delete-article',(req,res) => {
  let articleId=req.body.articleId;
  db.none('DELETE FROM newsdb.articles WHERE articleid=$1',[articleId])
  .then(()=>{
    res.redirect('/users/articles')
  })
  
})
app.get('/users/add-article',(req,res) => {
  res.render('add-article',{username:req.session.user.username})
})
app.get('/users/articles',(req,res) => {
  let userId=req.session.user.userId;
  //let userId=5;
  db.any('SELECT articleid,title,body FROM newsdb.articles WHERE userid=$1',[userId])
  .then((articles)=>{
    res.render('articles',{articles:articles})
  })

 
})
app.post('/users/update-article',(req,res) => {
  let title=req.body.title;
  let description=req.body.description;
  let articleid=req.body.articleId;
  db.none('UPDATE newsdb.articles SET title=$1,body=$2 WHERE articleid=$3',[title,description,articleid])
  .then(()=>{
    res.redirect("/users/articles")
  })
})
app.post('/users/add-article',(req,res) => {
  let title=req.body.title;
  let description=req.body.description;
  let userId=req.session.user.userId;
  db.none('INSERT INTO newsdb.articles(title,body,userid) VALUES($1,$2,$3)',[title,description,userId])
  .then(()=>{
    res.send("SUCCESS")
  })
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

          res.redirect('/users/add-article')

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

  db.oneOrNone('SELECT userid FROM newsdb.users WHERE username = $1',[username])
  .then((user) => {
    if(user) {
      res.render('register',{message: "User name already exists!"})
    } else {
      // insert user into the users table

      bcrypt.hash(password,SALT_ROUNDS,function(error, hash){

        if(error == null) {
          db.none('INSERT INTO newsdb.users(username,password) VALUES($1,$2)',[username,hash])
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
