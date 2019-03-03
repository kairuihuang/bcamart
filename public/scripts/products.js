$(document).ready(function(){
	
	$.get("http://localhost:4000/loadProducts", (data, status) => {
		for (let i = 0; i < data.length; i++) {
			console.log(data);
			var id = data[i].id;
			var name = data[i].name;
			var cost = data[i].cost;
			var price = data[i].price;
			var quantity = data[i].quantity;
			var totalVal = data[i].totalValue;
			var margin = (data[i].margin * 100);
			var markup = (data[i].markup * 100);

			cost = cost.toFixed(2);
			price = price.toFixed(2);
			totalVal = totalVal.toFixed(2);

			if (margin >= 100) { margin = margin.toFixed(); }
			else { margin = margin.toFixed(1); }
			if (markup >= 100) { markup = markup.toFixed(); }
			else { markup = markup.toFixed(1); }

			const row = "<tr><td><a href='http://localhost:4000/products/" + id + "'>" + name +
					  "</a></td><td><a href='http://localhost:4000/products/" + id + "'>" + cost +
					  "</a></td><td><a href='http://localhost:4000/products/" + id + "'>" + price +
					  "</a></td><td><a href='http://localhost:4000/products/" + id + "'>" + margin +
					  " %</a></td><td><a href='http://localhost:4000/products/" + id + "'>" + markup +
					  " %</a></td><td><a href='http://localhost:4000/products/" + id + "'>" + quantity +
					  "</a></td><td><a href='http://localhost:4000/products/" + id + "'>" + totalVal + "</a></td></tr>";
			
			$("tbody").append(row);
		}
	});

});