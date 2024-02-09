const express = require('express');
const bodyparser=require('body-parser')
const app = express();
const PORT = 3000;
app.use(bodyparser.json());
app.get('/', (req, resp) => {
    return resp.send('hello express')
})
app.get('/movies/:genre/year/:year', (req, res) => {
    console.log(req.params.genre);
    return res.send('here')

})
app.get('/movies', (req, res) => {
    console.log(req.query.sort);
    let movies = [{
        title: "bahubalu",
        year: 2020
    },
    {
        title: "ddd",
        year: 2020
    },
    {
        title: "dssddd",
        year: 2020
    }


    ]
    return res.json(movies);

})
//{title:"lord",year:"2020"}

app.post('/movies', (req, res) => {


    let title = req.body.title
    console.log(title)
    let year = req.body.year
    return res.send("OK")

})


app.listen(PORT, () => {
    console.log(`server is runnin ${PORT}`)
})