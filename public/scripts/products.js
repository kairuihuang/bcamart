$(document).ready(function() {

	const baseURL = "\'http://localhost:4000/products/";

	$.get('/loadProducts', (data, status) => {
		for (let i = 0; i < data.length; i++) {
			if (data[i] != null) {
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

				const row =
					"<tr>\
						<td class='text'>\
							<a href=" + baseURL + id + "'>" + name + "</a>\
						</td>\
						<td class='number'>\
							<a href=" + baseURL + id + "'>" + cost +"</a>\
						</td>\
						<td class='number'>\
							<a href=" + baseURL + id + "'>" + price + "</a>\
						</td>\
						<td class='number'>\
							<a href=" + baseURL + id + "'>" + margin + "%</a>\
						</td>\
						<td class='number'>\
							<a href=" + baseURL + id + "'>" + markup + "%</a>\
						</td>\
						<td class='number'>\
							<a href=" + baseURL + id + "'>" + quantity + "</a>\
						</td>\
						<td class='number'>\
							<a href=" + baseURL + id + "'>" + totalVal + "</a>\
						</td>\
					</tr>";

				$("tbody").append(row);
			}
		}
	});

});
