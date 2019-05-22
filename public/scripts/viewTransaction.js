$(document).ready(function() {
	const id = document.getElementsByName('id')[0].getAttribute('content');

	const loadTransactionStr = '/loadTransactions/' + id;

	$.get(loadTransactionStr, (data, status) => {
		var strOutput = '';
		var tbl = document.getElementById('vtTable');

		for(let k = 1;  k < data.items.length; k++){
			
		}


		for (let i = 0; i < data.items.length; i++){
			var printOut = "<pre>" + "<h1>Item Number " + (i+1) + ":</h1> <br>   " + data.items[i].name + " <br>   price: $" + data.items[i].price + " <br>   quantity: "+ data.items[i].quantity + " <br>   subtotal: $" + data.items[i].subtotal + "<br>" + "</pre>";
			strOutput += printOut;
			console.log(strOutput);
		}
	})
	$('.vtTable').DataTable({"bSort": false});
});