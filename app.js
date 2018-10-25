const express = require('express');
const app = express();

app.get('/hello', (req, res) => {
	res.send('Hello world');
});

app.listen(3003, () => {
	console.log('Listening on port 3003...');
});