var express = require('express');
var app = express();
var router = express.Router();
const firebase = require('firebase');


const config = {
  apiKey: "AIzaSyCtyH_NnJVubNiJLycE7dcO_svhpCHQf-8",
  authDomain: "database-cdf92.firebaseapp.com",
  databaseURL: "https://database-cdf92.firebaseio.com",
};

firebase.initializeApp(config);



router.get('/', (req, res) => {
   res.render('products');
   console.log('hello');
   var preObject = Document.getElementById('object');

	var dbRefObject = firebase.database().ref().child('object');

	dbRefObject.on('value', snap => {
		preObject.innerText = JSON.stringify(snap.val())
	});
});


//export this router to use in our index.js
module.exports = router;

