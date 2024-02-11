const express=require('express')
const bcrypt = require('bcrypt')
const router=express.Router()
const SALT_ROUNDS = 10
/*
router.get('/',(req,res) => {
  
    db.any('SELECT articleid,title,body FROM newsdb.articles')
    .then((articles)=>{
     res.render('index',{articles})
    })
     
   })
   */

   router.get('/',async (req,res) => {
  
    let articles=await db.any('SELECT articleid,title,body FROM newsdb.articles')
    res.render('index',{articles})
   
   })
   router.post('/login',async (req,res) => {
   
     let username = req.body.username
     let password = req.body.password
   
     let user=await db.oneOrNone('SELECT userid,username,password FROM newsdb.users WHERE username = $1',[username])
     
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
   
   router.get('/login',(req,res) => {
     res.render('login')
   })
   
   router.post('/register',async (req,res) => {
   
     let username = req.body.username
     let password = req.body.password
   
     let user=await db.oneOrNone('SELECT userid FROM newsdb.users WHERE username = $1',[username])
     
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
   
   router.get('/register',(req,res) => {
     res.render('register')
   })

   router.get('/logout',(req,res,next) => {
    if(req.session){
        req.session.destroy((error)=>{
            if(error){
                next(error)
            }else{
                res.redirect('/login')
            }
        })
    }
  })
module.exports=router;