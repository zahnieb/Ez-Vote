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
    password: undefined,
    addressLine1: undefined,
    addressLine2: undefined,
    city: undefined,
    state: undefined,
    zip_code: undefined,
};


app.get('/', (req, res) => {
    res.render('pages/login')
});

app.get('/test', (req, res) => {
    axios({
         url: `https://www.googleapis.com/civicinfo/v2/voterinfo?address=24%20Scott%20Drive%20broomfield%20CO&includeOffices=true&levels=regional&roles=governmentOfficer&key=${process.env.API_KEY}`,
            method: 'GET',
            dataType:'json',
            param: {
                "address": "24 Scott Drive broomfield co",
                "includeOffices": true,
                "levels":[
                    "regional"
                ],
                "roles": [
                    "governmentOfficer"
                ]
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
        .catch(error => {
            //hanlde errors
            res.render({
                results: [],
                error: error,
            })
        })
});

app.get('/login', (req, res) =>{
    res.render('pages/login')
});

app.get('/info', (req, res) =>{
    res.render('pages/info')
});

app.get('/register', (req, res) =>{
    res.render('pages/register')
});

app.get('/wciv', (req, res) =>{
    res.render('pages/wciv')
});

app.listen(3000, () => {
    console.log('listening on port 3000');
});

app.get('/register', (req, res) => {
    res.render('pages/register', {});
});

app.get('/login', (req, res) => {
    console.log(user.username + 
        user.password + 
        user.addressLine1 + 
        user.addressLine2 +
        user.city + 
        user.state + 
        user.zip_code);
    res.render('pages/login', {});
});

// Register submission
app.post('/register', async (req, res) => {
    const query = 'INSERT INTO voters (username, password, addressLine1, addressLine2, city, state, zip_code) VALUES ($1, $2, $3, $4, $5, $6, $7)';
    //const hash = await bcrypt.hash(req.body.password, 10);
    db.any(query, [
        req.body.username,
        req.body.password,
        req.body.addressLine1,
        req.body.addressLine2,
        req.body.city,
        req.body.state,
        req.body.zip_code
    ])
        .then(function (data) {
            user.username = req.body.username;
            user.password = req.body.password;
            user.addressLine1 = req.body.addressLine1;
            user.addressLine2 = req.body.addressLine2;
            user.city = req.body.city;
            user.state = req.body.state;
            user.zip_code = req.body.zip_code;
            res.redirect('/login');
        })
        .catch(function (err) {
            console.log(err);
            res.redirect('/register');
        });
});