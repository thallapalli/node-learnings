const express=require('express');

const app=express();
app.use(log)
function log(req,res,next){
    console.log('Logged ')
    next()
}
app.get('/',(req,res)=>{
    res.send('ROOT')
})
app.get('/login',(req,res)=>{
    res.send('LOGIN')
})
app.listen(3000,()=>{
    console.log('server is running at ')
})