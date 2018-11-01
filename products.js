var express = require('express');
var router = express.Router();

app.set('view engine', 'pug');
app.set('views','./public/views');

app.use('/stylesheets', express.static('public'));

router.get('/', (req, res) => {
   res.render('products');
});

//export this router to use in our index.js
module.exports = router;