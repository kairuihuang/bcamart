var express = require('express');
var app = express();
var router = express.Router();

router.get('/', (req, res) => {
   res.render('products');
});

//export this router to use in our index.js
module.exports = router;