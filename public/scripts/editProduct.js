$(document).ready(function() {
	const id = getMeta('id');
	const loadProductStr = '/loadProduct/' + id;
	const deleteProductStr = '/deleteProduct/' + id;

	var products = [];
	var isNewProd = true;
	var isEmpty = false;

	$.get('/loadProducts', (data, status) => {
		for (let i = 0; i < data.length; i++) {
			products.push(data[i].name);
		}
	});

	$.get(loadProductStr, (data, status) => {
		console.log(data);

		// extract & format data
		const name = data.name;
		const quantity = data.quantity;
		const isActive = data.isActive;
		const department = data.department.name;
		var cost = data.cost;
		var price = data.price;
		var totalVal = data.totalValue;

		cost = cost.toFixed(2);
		price = price.toFixed(2);
		totalVal = totalVal.toFixed(2);

		$('#name-input').val(name);
		$('#price-input').val(price);
		$('#cost-input').val(cost);
		$('#quantity-input').val(quantity);

		if (isActive) {
			$('#isActiveCheck').prop('checked', true);
		}

		$.get('/getDepartments', (data, status) => {
			for (let i = 0; i < data.length; i++) {
				let department = data[i].name;
				let html = "<option value='" + department + "'>" + department + "</option>";

				$('#addNew').after(html);
			}
			$('#department-select option[value="' + department + '"]')
				.prop("selected", "selected");
		});

	});

	$('#deleteBtn').click( () => {
		const response = confirm('Are you sure you want to delete this item?');
		if (response) {
			$.post(deleteProductStr);
			window.location.assign('/products');
		}
	});

	// toggle add new department input when add new is selected
	$('#department-select').change(() => {
		let str = $('#department-select option:selected').text();

		if (str === 'Add new') {
			let html =
				"<div class='input-group' id='depDiv1'>\
					<div class='input-group=prepend id='depDiv2'>\
						<span class='input-group-text' id='depSpan'>Enter here</span>\
					</div>\
					<input class='form-control' id='department-input' name='department'>\
				</div>"
			$('#depLabel').after(html);
			$('#department-select').removeAttr('name');
		}
		else {
			$('#depDiv1').remove();
			$('#depDiv2').remove();
			$('#depSpan').remove();
			$('#department-input').remove();
			$('#department-select').attr('name', 'department');
		}
	});

	// form validation stuff ___________________________________________________
	$('#name-input').on('input', () => {
		var name = $('#name-input').val();
		var element = document.getElementById('name-input');

		element.setCustomValidity('');
		isNewProd = true;
		isEmpty = false;

		if (name === '') {
			element.setCustomValidity('Product name cannot be blank.');
			isEmpty = true;
		}

		for (let i = 0; i < products.length; i++) {
			if (name === products[i]) {
				element.setCustomValidity('A product with the same name already exists.');
				isNewProd = false;
			}
		}
	});

	$('#price-input').on('input', () => {
		var price = Number($('#price-input').val().replace('$', ''));
		var element = document.getElementById('price-input');
		if (price === '') {
			element.setCustomValidity('Price cannot be blank.');
		}
		else if (Number.isNaN(price) || price < 0) {
			element.setCustomValidity('Please enter a positive decimal value.');
		}
		else {
			element.setCustomValidity('');
		}
	});

	$('#cost-input').on('input', () => {
		var cost = Number($('#cost-input').val().replace('$', ''));
		var element = document.getElementById('cost-input');
		if (cost === '') {
			element.setCustomValidity('Cost cannot be blank.');
		}
		else if (Number.isNaN(cost) || cost < 0) {
			element.setCustomValidity('Please enter a positive decimal value.');
		}
		else {
			element.setCustomValidity('');
		}
	});

	$('#quantity-input').on('input', () => {
		var quantity = Number($('#quantity-input').val());
		var element = document.getElementById('quantity-input');
		if (quantity === '') {
			element.setCustomValidity('Quantity cannot be blank.');
		}
		else if (Number.isNaN(quantity) || !Number.isInteger(quantity) || quantity < 0) {
			element.setCustomValidity('Please enter a positive whole number.');
		}
		else {
			element.setCustomValidity('');
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
