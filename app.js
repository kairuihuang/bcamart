const firebase = require('firebase');
const express = require('express');
const app = express();

const products = require('./products.js');
const transactions = require('./transactions.js');
const volunteers = require('./volunteers.js');

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

app.use('/products', products);
app.use('/transactions', transactions);
app.use('/volunteers', volunteers);

app.get('/', (req, res) => {
	res.send('Welcome to the root page!');
});


// const port = process.env.PORT || 4000;
app.listen(4000, () => {
	console.log('Listening on port 4000...');
});