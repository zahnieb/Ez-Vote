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

const {API_KEY} = process.env


app.get('/', (req, res) =>{
    res.render('pages/login')
});

//test request for api call to polling locations with test user
app.get('/test', async (req, res) =>{
    //Making db query to retrieve address before API call to get voterInfo
    const query = "SELECT addressLine1, addressLine2, city, state, zip_code FROM voters WHERE username='test';";
    const values = [user];

    //await to complete query & assign values
    await db.any(query, values)
    .then((data) =>{
        user.addressLine1 = data[0].addressline1;
        user.addressLine2 = data[0].addressline2;
        user.city = data[0].city;
        user.state = data[0].state;
        user.zip_code = data[0].zip_code;
    })
    .catch((err) => {
        console.log(err);
        res.redirect("/");
    });

    //set address for api call
    let address = `${user.addressLine1} ${user.addressLine2} ${user.city} ${user.state} ${user.zip_code}`;
    
    //axios API get request
    axios({
            url: `https://www.googleapis.com/civicinfo/v2/elections`,
            method: 'GET',
            //dataType:'json',
            params: {
                key : API_KEY,
                //address : address,
                electionId: 2000
            }
        })
         .then(results => {
            console.log(results);
            console.log(results.data.elections[0].name);
            console.log(results.data.elections[0].electionDay);
            res.render('pages/test', {
                election: results.data.elections[0],
                date: results.data.elections[0]
            });

         })
        .catch((error) => {
            //hanlde errors
            console.log(error);
        });
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