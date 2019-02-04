$(document).ready(function(){
	
	$.get("http://localhost:4000/loadProducts", (data, status) => {
		for (var i = 0; i < data.length; i++) {
			var name = data[i].name;
			var cost = data[i].cost;
			var price = data[i].price;
			var margin = data[i].margin * 100;
			var markup = data[i].markup * 100;
			var quantity = data[i].quantity;
			var totalVal = data[i].totalValue;

			var row = "<tr><td><a href='http://localhost:4000/products/" + i + "'>" + name +
					  "</a></td><td><a href='http://localhost:4000/products/" + i + "'>" + cost +
					  "</a></td><td><a href='http://localhost:4000/products/" + i + "'>" + price +
					  "</a></td><td><a href='http://localhost:4000/products/" + i + "'>" + margin +
					  " %</a></td><td><a href='http://localhost:4000/products/" + i + "'>" + markup +
					  " %</a></td><td><a href='http://localhost:4000/products/" + i + "'>" + quantity +
					  "</a></td><td><a href='http://localhost:4000/products/" + i + "'>" + totalVal + "</a></td></tr>";
			
			$("tbody").append(row);
		}
	});

});