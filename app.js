const express = require('express');
const app = express();
const firebase = require('firebase');
const bodyParser = require('body-parser')


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
// for parsing application/json
app.use(bodyParser.json()); 

// for parsing application/xwww-
app.use(bodyParser.urlencoded({ extended: true })); 
//form-urlencoded

// for parsing multipart/form-data

app.get('/', (req, res) => {
	res.send('Welcome to the root page!');
});


app.get('/products', (req, res) => {
	res.render('products');
	
});
app.post('/products', function(req, res){
	res.send('hello');
		// var productInfo = req.body;
		// console.log("reached");
		// if (!productInfo.name || !productInfo.age || !productInfo.nationality){
		// 	res.render('show_message', {
		// 		message: "Sorry, you provided wrong info", type: "error"});
		// } else {
		// 	var newProduct = new Product({
		// 		name: productInfo.name,
		// 		age: productInfo.age,
		// 		nationality: productInfo.nationality
		// 	});

		// 	database.ref('products/').set({
		// 		name: newProduct.name,
		// 		age: newProduct.age,
		// 		nationality: newProduct.nationality
		// 	});
		// }
	});

app.get('/transactions', (req, res) => {
	res.render('transactions');
});

app.get('/volunteers', (req, res) => {
	res.render('volunteers');
});




// const port = process.env.PORT || 4000;
app.listen(4000, () => {
	console.log('Listening on port 4000...');
});