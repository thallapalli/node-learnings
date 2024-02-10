const pgp = require('pg-promise')()
const username="postgres"
const password="Tinku_2015"
const host="localhost"
const port="5432"
const database="nailasgarden"
//const connectionString = "postgres://localhost:5432/nailasgarden";
const connectionString = `postgres://${username}:${password}@${host}:${port}/${database}`;

const db = pgp(connectionString)
/*
db.none('delete from nailasgarden.dishes WHERE dishid=$1',[3])
.then(()=>{
    console.log("delete");
}).catch(error=>console.log(error));


db.any('select dishid,name,course,price,imageURL FROM nailasgarden.dishes')
.then((dishes)=>{
    console.log(dishes)
})
.catch(error=>{
    console.log(error)
})

*/
