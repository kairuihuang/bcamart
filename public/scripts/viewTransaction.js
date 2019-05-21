$(document).ready(function() {
	const id = document.getElementsByName('id')[0].getAttribute('content');

	const loadTransactionStr = '/loadTransactions/' + id;

	$.get(loadTransactionStr, (data, status) => {
		var strOutput = '';
		for (let i = 0; i < data.items.length; i++){
			var printOut = "<pre>" + "<h1>Item Number " + (i+1) + ":</h1> <br>   " + data.items[i].name + " <br>   price: $" + data.items[i].price + " <br>   quantity: "+ data.items[i].quantity + " <br>   subtotal: $" + data.items[i].subtotal + "<br>" + "</pre>";
			strOutput += printOut;
			console.log(strOutput);
		}
		console.log(strOutput);
		document.getElementById('p1').innerHTML = strOutput;
	})
});