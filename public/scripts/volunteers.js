$(document).ready(function() {

	const baseURL = 'http://localhost:4000/volunteers/';

	$.get('/loadVolunteers', (data, status) => {
		console.log(data);

		var codeArr = Object.keys(data);

		for (let i = 0; i < codeArr.length; i++) {
			let code = codeArr[i];

			let email = data[code].email;
			let firstName = data[code].firstName;
			let hours = data[code].hours;
			let lastName = data[code].lastName;

			let name = firstName + ' ' + lastName;
			hours = hours.toFixed(1);

			let row =
				"<tr class='volRow' id='" + code + "'>\
					<td class='text'>" + name + "</td>\
					<td class='text'>" + email + "</td>\
					<td class='number'>" + code + "</td>\
					<td class='number'>" + hours + "</td>\
				</tr>";

			$("tbody").append(row);
		}
		$('.productRow').click((event) => {
			location = baseURL + event.currentTarget.id;
		});
		$('table').DataTable();
	});
});
