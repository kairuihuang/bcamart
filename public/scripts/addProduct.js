$(document).ready(function() {

	$('#price-input').on('input', function(e) {
		var price = Number($('#price-input').val().replace('$', ''));
		var element = document.getElementById('price-input');
		if (price === '') {
			element.setCustomValidity('Please fill out this field.');
		}
		else if (Number.isNaN(price) || price < 0 ) {
			element.setCustomValidity('Please enter a positive decimal value.');
		}
		else {
			element.setCustomValidity('');
		}
	});

	$('#cost-input').on('input', function(e) {
		var cost = Number($('#cost-input').val().replace('$', ''));
		var element = document.getElementById('cost-input');
		if (cost === '') {
			element.setCustomValidity('Please fill out this field.');
		}
		else if (Number.isNaN(cost) || cost < 0) {
			element.setCustomValidity('Please enter a positive decimal value.');
		}
		else {
			element.setCustomValidity('');
		}
	});

	$('#quantity-input').on('input', function(e) {
		var quantity = Number($('#quantity-input').val());
		var element = document.getElementById('quantity-input');
		if (quantity === '') {
			element.setCustomValidity('Please fill out this field.');
		}
		else if (Number.isNaN(quantity) || !Number.isInteger(quantity) || quantity < 0) {
			element.setCustomValidity('Please enter a positive whole number.');
		}
		else {
			element.setCustomValidity('');
		}
	});
});
