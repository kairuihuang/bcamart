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
});

app.get('/products/addProduct', (req, res) => {
	res.render("addProduct");
});

app.get('/products/:id', (req, res) => {
	res.render('editProduct', {id: req.params.id});
});

// get all products in DB
app.get('/loadProducts', (req, res) => {
	database.ref("/products/list").once("value").then((snapshot) => {
		const products = snapshot.val();
		res.send(products);
	});
});

// loads single product by ID
app.get('/loadProduct/:id', (req, res) => {
	database.ref("/products/list/" + req.params.id).once("value").then((snapshot) => {
		const product = snapshot.val();
		res.send(product);
	});
});

app.post('/deleteProduct/:id', (req, res) => {
	console.log("delete request processed, id: " + req.params.id);
	database.ref("/products/list/" + req.params.id).remove();
	//res.redirect("http://localhost:4000/products"); // doesn't redirect
});

app.post('/addProductAction', (req, res) => {
	const reqBody = req.body;
	const price = parseFloat(reqBody.price);
	const cost =  parseFloat(reqBody.cost);
	const quantity = parseInt(reqBody.quantity);

	database.ref("/products/metadata/id_count").once("value").then((snapshot) => {
		let id = snapshot.val();
		addProduct(id, reqBody.name, price, cost, quantity, reqBody.department); // validate data beforehand
		database.ref("/products/metadata/").update({id_count: ++id});
	});

	res.redirect("http://localhost:4000/products");
});

// ___________________________________________________________________________________________________

app.get('/transactions', (req, res) => {
	res.render('transactions');
});

app.get('/volunteers', (req, res) => {
	res.render('volunteers');
});

app.post('/addVolunteer', (req, res) => {
	const reqBody = req.body;
	addProduct(8, reqBody.name, reqBody.price, reqBody.cost, reqBody.quantity);
	res.redirect("http://localhost:4000/volunteers");
});

app.get('/loadVolunteers', (req, res) => {
	database.ref("/volunteers").once("value").then((snapshot) => {
		const products = snapshot.val();
		res.send(products);
	});
});

// internal functions ___________________________________________________________________________________________________

function addProduct (id, name, price, cost, quantity, department) {
	const margin = round((price-cost)/price, 2);
	const markup = round(((price-cost)/cost), 2);
	const totalVal = round((quantity*cost), 2);

	database.ref("products/list/" + id).set({
		id: id,
		name: name,
		price: price,
		cost: cost,
		quantity: quantity,
		margin: margin,
		markup: markup,
		totalValue: totalVal,
		department: department
	});
}

function round(value, decimals) {
	return Number(Math.round(value+'e'+decimals)+'e-'+decimals);
}

// const port = process.env.PORT || 4000;
app.listen(4000, () => {
	console.log('Listening on port 4000...');
});