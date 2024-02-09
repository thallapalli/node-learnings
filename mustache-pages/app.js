const express = require('express')
const app = express();
const boyParser=require('body-parser');
app.use(boyParser.urlencoded({
    extended:false
}))
const mustacheExpress = require('mustache-express');
app.engine('mustache', mustacheExpress());
app.set('views', "./views");

app.set('view engine', "mustache");
app.get('/add-user',(req,res)=>{
    res.render('add-user');
})
app.post('/add-user',(req,res)=>{
    let name=req.body.name;
    let age=req.body.age;
    console.log(name+" and his age is "+age);
    res.status(200).send();
})
app.get('/users', (req, res) => {
    let users = [{
        name: "karnakr",
        age: 14

    }, {
        name: "karnakr2",
        age: 14

    }, {
        name: "karnakr3",
        age: 14

    }]
    users=[];
    res.render('users', {users:users});

})
app.get('/', (req, res) => {

    let user = {
        name: "karnakr",
        age: 14

    }
    res.render('index', user);
})
app.listen(3000, () => {
    console.log("server is listening")
})
