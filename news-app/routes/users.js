const express=require('express')
const router=express.Router()

router.post('/delete-article',async (req,res) => {
    let articleId=req.body.articleId;
    await db.none('DELETE FROM newsdb.articles WHERE articleid=$1',[articleId])
    
      res.redirect('/users/articles')

    
  })
  router.get('/add-article',(req,res) => {
    res.render('add-article',{username:req.session.user.username})
  })
  router.get('/articles/edit/:articleid',async (req,res) => {
    let articleId=req.params.articleid;
   let article=await db.one('SELECT articleid,title,body FROM newsdb.articles WHERE articleid=$1',[articleId])
   
      res.render('edit-article',article)

  })
  
  
  router.get('/articles',async (req,res) => {
    let userId=req.session.user.userId;
    //let userId=5;
    let articles=await db.any('SELECT articleid,title,body FROM newsdb.articles WHERE userid=$1',[userId])
    
      res.render('articles',{articles:articles})

  
   
  })
  router.post('/update-article',async (req,res) => {
    let title=req.body.title;
    let description=req.body.description;
    let articleid=req.body.articleId;
    await db.none('UPDATE newsdb.articles SET title=$1,body=$2 WHERE articleid=$3',[title,description,articleid])
    
      res.redirect("/users/articles")

  })
  router.post('/add-article',async (req,res) => {
    let title=req.body.title;
    let description=req.body.description;
    let userId=req.session.user.userId;
    await db.none('INSERT INTO newsdb.articles(title,body,userid) VALUES($1,$2,$3)',[title,description,userId])
    
    res.redirect("/users/articles")
    
  })
module.exports=router;