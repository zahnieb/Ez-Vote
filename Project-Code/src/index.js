// Import dependencies
const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const axios = require('axios');
const bcrypt = require('bcrypt');

// Define express application
const app = express();

const {API_KEY, POSTGRES_DB, POSTGRES_PASSWORD, POSTGRES_USER, PORT} = process.env;
// Db config
const dbConfig = {
	host: 'db',
	port: 5432,
	database: POSTGRES_DB,
	user: POSTGRES_USER,
	password: POSTGRES_PASSWORD,
};

const db = pgp(dbConfig);

// Db connection test
db.connect()
	.then(obj => {
		// Can check the server version here (pg-promise v10.1.0+):
		console.log('Database connection successful');
		obj.done(); // Success, release the connection;
	})
	.catch(error => {
		console.log('ERROR:', error.message || error);
	});

// Set the view engine to ejs
app.set('view engine', 'ejs');
app.use(bodyParser.json());

// Set session
app.use(
	session({
		secret: 'XASDASDA',
		saveUninitialized: true,
		resave: true,
	}),
);

app.use(
	bodyParser.urlencoded({
		extended: true,
	}),
);

app.get('/', (req, res) => {
	res.render('pages/login');
});

// Constant api call to civics API
const civicRequest = axios.create({
	baseURL: 'https://civicinfo.googleapis.com',
	params: {apiKey: API_KEY},
});

app.get('/test', async (req, res) => {
	// Making db query to retrieve address before API call to get voterInfo
	const query = 'SELECT addressLine1, addressLine2, city, state, zip_code FROM voters WHERE username=\'test\';';
	const values = [{}];

	// Await to complete query & assign values
	try {
		const [user] = await db.any(query, values);

		const address = `${user.addressLine1} ${user.addressLine2} ${user.city} ${user.state} ${user.zip_code}`;
		const {elections} = await civicRequest('/civicinfo/v2/elections', {
			params: {
				address,
				electionId: 2000,
			},
		});
		res.render('pages/test', {
			election: elections.name,
			location: elections.electionDay,
		});
	} catch (error) {
		console.log(error);
		res.redirect('/');
	}
});

app.listen(PORT, () => {
	console.log('listening on port 3000');
});
