const express=require('express');
const app=express();
const mustacheExpress=require('mustache-express')
const PORT=3000;
//configuring view engine
app.engine('mustache',mustacheExpress())
app.set('views','./views');
app.set('view engine','mustache')
app.get('/register',(req,res)=>{
    res.render('register')
})
app.listen(PORT,()=>{
console.log(` server started ${PORT}`)
})