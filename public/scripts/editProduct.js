$(document).ready(function() {
	
	const id = getMeta("id");
	const loadProductStr = "/loadProduct/" + id;
	const deleteProductStr = "/deleteProduct/" + id;

	$.get(loadProductStr, (data, status) => {
		console.log(data);
		const name = data.name;
		const quantity = data.quantity;
		var cost = data.cost;
		var price = data.price;
		var margin = data.margin * 100;
		var markup = data.markup * 100;
		var totalVal = data.totalValue;

		cost = cost.toFixed(2);
		price = price.toFixed(2);
		totalVal = totalVal.toFixed(2);

		if (margin >= 100) { margin = margin.toFixed(); }
		else { margin = margin.toFixed(1); }
		if (markup >= 100) { markup = markup.toFixed(); }
		else { markup = markup.toFixed(1); }
	});

	$("#deleteBtn").click( () => {
		const response = confirm("Are you sure you want to delete this item?");
		if (response) {
			$.post(deleteProductStr);
			window.location.assign('/products');
		}
	});

});

function getMeta(metaName) {
  const metas = document.getElementsByTagName('meta');

  for (let i = 0; i < metas.length; i++) {
    if (metas[i].getAttribute('name') === metaName) {
      return metas[i].getAttribute('content');
    }
  }

  return 'not found';
}