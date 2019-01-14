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

			var row = "<tr><td>" + name + "</td><td>" + cost + "</td><td>" + price + "</td><td>" + margin +
					  " %</td><td>" + markup + " %</td><td>" + quantity + "</td><td>" + totalVal + "</td></tr>";
			
			$("tbody").append(row);
		}
	});
});