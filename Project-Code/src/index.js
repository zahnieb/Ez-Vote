//import dependencies
const express = require("express");
const pgp = require("pg-promise")();
const bodyParser = require("body-parser");
const session = require("express-session");
const axios = require('axios');
const bcrypt = require('bcrypt');

//define express application
const app = express();


// db config
const dbConfig = {
    host: "db",
    port: 5432,
    database: process.env.POSTGRES_DB,
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
  };
  
const db = pgp(dbConfig);

// db connection test
db.connect()
  .then((obj) => {
    // Can check the server version here (pg-promise v10.1.0+):
    console.log("Database connection successful");
    obj.done(); // success, release the connection;
  })
  .catch((error) => {
    console.log("ERROR:", error.message || error);
});

// set the view engine to ejs
app.set("view engine", "ejs");
app.use(bodyParser.json());

// set session
app.use(
    session({
      secret: "XASDASDA",
      saveUninitialized: true,
      resave: true,
    })
  );
  
app.use(
    bodyParser.urlencoded({
      extended: true,
    })
);

const user = {
    username: undefined,
    address: undefined
}


app.get('/', (req, res) =>{
    res.render('pages/info')
});

app.get('/test', (req, res)=>{
    //Making db query to retrieve address before API call to get voterInfo
    const query = "SELECT addressLine1, city, state, zip_code FROM voters WHERE username='test'";
    let value = "";
    db.any(query, value)
        .then((data) =>{
        value = data.addressLine1 + " " + data.city + " " + data.state + " " + data.zip_code;
        })
        .catch((error) => {
                //hanlde errors
                console.log(error);
                res.redirect("/");
        });
    //API call
    console.log(value);
    axios({
            url: "https://civicinfo.googleapis.com/civicinfo/v2/voterinfo",
            method: 'GET',
            dataType:'json',
            header: {
                address: `${value}`,
                authorization: `${process.env.API_KEY}`
            }
            })
         .then(results => {
            //console.log(results.data);
            //console.log(results.data.election);
            console.log(results.data.pollingLocations);
            res.render('pages/test', {
                election: results.data.election,
                location: results.data.pollingLocations
            });
         })
        .catch((error) => {
            //hanlde errors
            console.log(error);
            res.redirect("/");
        });
    });


app.listen(3000, () => {
    console.log('listening on port 3000');
});