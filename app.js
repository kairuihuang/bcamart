const express = require('express');
const app = express();
const firebase = require('firebase');

const config = {
  apiKey: "AIzaSyCtyH_NnJVubNiJLycE7dcO_svhpCHQf-8",
  authDomain: "database-cdf92.firebaseapp.com",
  databaseURL: "https://database-cdf92.firebaseio.com",
};

firebase.initializeApp(config);
const database = firebase.database();

app.set('view engine', 'pug');
app.set('views','./public/views');

app.use(express.static('public'));

app.get('/', (req, res) => {
	res.send('Welcome to the root page!');
});

app.get('/products', (req, res) => {
	res.render('products');
});

app.get('/transactions', (req, res) => {
	res.render('transactions');
});

app.get('/volunteers', (req, res) => {
	res.render('volunteers');
});

/*
database.ref("/products").set({
	name: "Jacob",
	price: 1.00,
	quantity: 250,
});
*/

// const port = process.env.PORT || 4000;
app.listen(4000, () => {
	console.log('Listening on port 4000...');
});