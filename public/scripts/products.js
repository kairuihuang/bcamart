$(document).ready(function() {

	const baseURL = 'http://localhost:4000/products/';

	$.get('/loadProducts', (data, status) => {
		for (let i = 0; i < data.length; i++) {
			if (data[i] !== null) {
				var id = data[i].id;
				var name = data[i].name;
				var cost = data[i].cost;
				var price = data[i].price;
				var quantity = data[i].quantity;
				var totalVal = data[i].totalValue;
				var margin = (data[i].margin * 100);
				var markup = (data[i].markup * 100);

				var department = data[i].department.name;

				cost = cost.toFixed(2);
				price = price.toFixed(2);
				totalVal = totalVal.toFixed(2);

				if (margin >= 100) { margin = margin.toFixed(); }
				else { margin = margin.toFixed(1); }
				if (markup >= 100) { markup = markup.toFixed(); }
				else { markup = markup.toFixed(1); }

				// TODO: Table sorting!

				const row =
					"<tr class='productRow' id='" + id + "'>\
						<td class='text'>" + department + "</td>\
						<td class='text'>" + name + "</td>\
						<td class='number'>" + cost + "</td>\
						<td class='number'>" + price + "</td>\
						<td class='number'>" + margin + "</td>\
						<td class='number'>" + markup + "</td>\
						<td class='number'>" + quantity + "</td>\
						<td class='number'>" + totalVal + "</td>\
					</tr>";

				$('tbody').append(row);
			}
		}
		$('.productRow').click((event) => {
			location = baseURL + event.currentTarget.id;
		})
	});

	// table filtering
	$('#productSearch').on("keyup", function() {
    	var value = $(this).val().toLowerCase();
    	$("#productBody tr").filter(function() {
			$(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
		});
  	});

});
