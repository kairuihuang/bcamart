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
const database = firebase.database();

router.get('/', (req, res) => {
   res.render('products');
});
//export this router to use in our index.js
module.exports = router;

var ref = firebase.database().ref("object");
console.log(ref);