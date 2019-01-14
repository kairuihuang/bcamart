const express = require('express');
const app = express();
const firebase = require('firebase');
const bodyParser = require('body-parser');
const multer = require('multer');
const upload = multer();

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

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(upload.array());

app.get('/', (req, res) => {
	res.send('Welcome to the root page!');
});

app.get('/products', (req, res) => {
	res.render('products');
	// Database stuff goes here
});

app.get('/loadProducts', (req, res) => {
	database.ref("/products").once("value").then((snapshot) => {
		var products = snapshot.val();
		res.send(products);
		// for (var i = 0; i < products.length; i++) {
		// 	console.log(products[i]);
		// }
	});
});

function addProduct (id, name, price, cost, quantity) {
	// id needs to be tracked
	database.ref("products/" + id).set({
		name: name,
		price: price,
		cost: cost,
		quantity: quantity
	});
}

app.post('/addProduct', (req, res) => {
	var reqBody = req.body;
	console.log(reqBody);
	addProduct(8, reqBody.name, reqBody.price, reqBody.cost, reqBody.quantity);
	res.redirect("http://localhost:4000/products");
});

app.get('/transactions', (req, res) => {
	res.render('transactions');
});

app.get('/volunteers', (req, res) => {
	res.render('volunteers');
});

app.post('/addVolunteer', (req, res) => {
	var reqBody = req.body;
	console.log(reqBody);
	addProduct(8, reqBody.name, reqBody.price, reqBody.cost, reqBody.quantity);
	res.redirect("http://localhost:4000/volunteers");
});

app.get('/loadVolunteers', (req, res) => {
	database.ref("/volunteers").once("value").then((snapshot) => {
		var products = snapshot.val();
		res.send(products);
		// for (var i = 0; i < products.length; i++) {
		// 	console.log(products[i]);
		// }
	});
});
/*
// margin & markup calculated at insertion / modification
database.ref("/products").set([
	{
		name: "Chex Mix",
		department: "Chips",
		cost: 0.75,
		price: 1.50,
		quantity: 400
	},
	{
		name: "Cheetos",
		department: "Chips",
		cost: 0.51,
		price: 1.00,
		quantity: 80
	},
	{
		name: "Water",
		department: "Drinks",
		cost: 0.31,
		price: 1.00,
		quantity: 200
	},
	{
		name: "Gatorade",
		department: "Drinks",
		cost: 0.81,
		price: 1.25,
		quantity: 150
	},
	{
		name: "Mini Oreos",
		department: "Snacks",
		cost: 0.98,
		price: 2.00,
		quantity: 100
	},
	{
		name: "Orbit Gum",
		department: "Snacks",
		cost: 0.85,
		price: 1.25,
		quantity: 125
	}
]);
*/

// const port = process.env.PORT || 4000;
app.listen(4000, () => {
	console.log('Listening on port 4000...');
});