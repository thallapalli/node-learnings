const express=require('express');
const router=express.Router();
function authenticate(req,res,next){
   
    if(req.session){
        console.log("in  session")
        if(req.session.name){
            console.log("session"+req.session.name)
            next()
        }else{
            res.redirect('/users/add-user');
        }
    }else{
        console.log("no session")
        res.redirect('/users/add-user');
    }
}
router.get('/', (req, res) => {

    let user = {
        name: req.session.name,
        age: req.session.age

    }
    console.log("from session "+user.name)
    res.render('index', user);
})
router.get('/add-user', (req, res) => {
    res.render('add-user');
})
router.get('/bank-accounts',authenticate,(req,res)=>{
    res.send('Bank Accounts');
})
router.post('/add-user', (req, res) => {
    let name = req.body.name;
    let age = req.body.age;
    if(req.session){
        req.session.name=name;
        req.session.age=age;
       
    }
    console.log(name + " and his age is " + age);
    res.status(200).send();
})
router.get('/users', (req, res) => {
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
    
    res.render('users', { users: users });

})


module.exports=router