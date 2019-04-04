$(document).ready(function() {

	var products = [];
	var isNewProd = true;

	$.get('/getDepartments', (data, status) => {
		// will display in alphabetical order due to nature of .after()
		data.sort(dynamicSort('-name'));

		for (let i = 0; i < data.length; i++) {
			let department = data[i].name;
			let html = "<option value='" + department + "'>" + department + "</option>";

			$('#addNew').after(html);
		}
	});

	$.get('/loadProducts', (data, status) => {
		for (let i = 0; i < data.length; i++) {
			products.push(data[i].name);
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
			element.setCustomValidity('Please fill out this field.');
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
			element.setCustomValidity('Please fill out this field.');
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

function dynamicSort(property) {
    var sortOrder = 1;

    if(property[0] === "-") {
        sortOrder = -1;
        property = property.substr(1);
    }

    return function (a,b) {
        if (sortOrder == -1) {
            return b[property].localeCompare(a[property]);
        }
		else {
            return a[property].localeCompare(b[property]);
        }
    }
}
