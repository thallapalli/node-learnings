const express = require('express')
const app = express();
const boyParser = require('body-parser');
const path = require('path');
const mustacheExpress = require('mustache-express');
const session = require('express-session')

app.set('trust proxy', 1) // trust first proxy
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false
   
}))
const VIEWS_PATH = path.join(__dirname, '/views');
const userRoutes = require('./routes/users')
app.use(boyParser.urlencoded({
    extended: false
}))
app.use('/users', userRoutes)
app.use('/css', express.static("css"));
app.engine('mustache', mustacheExpress(VIEWS_PATH + '/partials', '.mustache'));
app.set('views', VIEWS_PATH);

app.set('view engine', "mustache");



app.listen(3000, () => {
    console.log("server is listening")
})
